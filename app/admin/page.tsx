import { supabase } from '@/lib/supabase'
import { updateMatchStatus } from '@/app/actions'
import { scoreBadgeColor, scoreLabel } from '@/lib/matching'
import Link from 'next/link'
import type { Senior, Match } from '@/lib/supabase'

type SeniorStatus = '미매칭' | '매칭대기' | '배정완료'

type SeniorRow = Senior & {
  bestScore: number
  bestMatchId: string | null
  seniorStatus: SeniorStatus
}

function getSeniorStatus(matches: Match[]): SeniorStatus {
  if (matches.length === 0) return '미매칭'
  if (matches.some((m) => m.status === 'assigned' || m.status === 'done')) return '배정완료'
  return '매칭대기'
}

const STATUS_BADGE: Record<SeniorStatus, string> = {
  '미매칭':  'bg-gray-100 text-gray-600',
  '매칭대기': 'bg-yellow-100 text-yellow-800',
  '배정완료': 'bg-green-100 text-green-800',
}

const NEXT_MATCH_STATUS: Record<string, { to: Match['status']; label: string; color: string }[]> = {
  pending:  [{ to: 'assigned', label: '배정 완료 ✓', color: 'bg-green-600 hover:bg-green-700 text-white' }],
  assigned: [{ to: 'done',    label: '처리 완료',   color: 'bg-blue-600 hover:bg-blue-700 text-white'  }],
  done:     [],
}

export default async function AdminPage() {
  const [{ data: allSeniors }, { data: allMatches }] = await Promise.all([
    supabase.from('seniors').select('*').order('created_at', { ascending: false }),
    supabase.from('matches').select('*').order('score', { ascending: false }),
  ])

  const seniors = (allSeniors ?? []) as Senior[]
  const matches = (allMatches ?? []) as Match[]

  const rows: SeniorRow[] = seniors.map((senior) => {
    const myMatches = matches.filter((m) => m.senior_id === senior.id)
    const best = myMatches[0] ?? null
    return {
      ...senior,
      bestScore: best?.score ?? 0,
      bestMatchId: best?.id ?? null,
      seniorStatus: getSeniorStatus(myMatches),
    }
  })

  const unmatched = rows.filter((r) => r.seniorStatus === '미매칭')
  const pending   = rows.filter((r) => r.seniorStatus === '매칭대기')
  const assigned  = rows.filter((r) => r.seniorStatus === '배정완료')

  const summaryCards = [
    { label: '미매칭',  count: unmatched.length, border: 'border-gray-300',  bg: 'bg-gray-50',   badge: 'bg-gray-100 text-gray-600' },
    { label: '매칭 대기', count: pending.length,   border: 'border-yellow-300', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800' },
    { label: '배정 완료', count: assigned.length,  border: 'border-green-300',  bg: 'bg-green-50',  badge: 'bg-green-100 text-green-800' },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
      <p className="text-xl text-gray-500 mb-8">
        총 {seniors.length}명의 시니어 · 매칭 점수 최대 6점
      </p>

      {/* 집계 카드 3개 */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {summaryCards.map(({ label, count, border, bg, badge }) => (
          <div key={label} className={`rounded-2xl border-2 ${border} ${bg} px-6 py-5 shadow-sm`}>
            <span className={`inline-block px-3 py-1 rounded-full text-base font-bold mb-3 ${badge}`}>
              {label}
            </span>
            <p className="text-5xl font-extrabold text-gray-900">{count}</p>
            <p className="text-lg text-gray-500 mt-1">명</p>
          </div>
        ))}
      </div>

      {/* 시니어 목록 테이블 */}
      {rows.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-2xl font-medium">등록된 시니어가 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['이름', '지역', '희망 직종', '최고 점수', '상태', '액션'].map((h) => (
                  <th key={h} className="px-5 py-4 text-base font-bold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => {
                const matchActions = row.bestMatchId
                  ? (NEXT_MATCH_STATUS[
                      matches.find((m) => m.id === row.bestMatchId)?.status ?? ''
                    ] ?? [])
                  : []

                return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-lg font-semibold text-gray-900">{row.name}</td>
                    <td className="px-5 py-4 text-base text-gray-600">{row.region}</td>
                    <td className="px-5 py-4 text-base text-gray-600">{row.desired_job}</td>
                    <td className="px-5 py-4">
                      {row.bestScore > 0 ? (
                        <span className={`text-sm px-3 py-1 rounded-full font-bold ${scoreBadgeColor(row.bestScore)}`}>
                          {row.bestScore}점 — {scoreLabel(row.bestScore)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${STATUS_BADGE[row.seniorStatus]}`}>
                        {row.seniorStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/recommendations?senior_id=${row.id}&name=${encodeURIComponent(row.name)}`}
                        className="text-sm px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
                      >
                        상세 보기
                      </Link>
                      {matchActions.map((action) => (
                        <form key={action.to} action={updateMatchStatus}>
                          <input type="hidden" name="matchId" value={row.bestMatchId!} />
                          <input type="hidden" name="status" value={action.to} />
                          <button
                            type="submit"
                            className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${action.color}`}
                          >
                            {action.label}
                          </button>
                        </form>
                      ))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
