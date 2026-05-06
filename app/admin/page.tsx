import { supabase } from '@/lib/supabase'
import { updateMatchStatus } from '@/app/actions'
import { scoreBadgeColor } from '@/lib/matching'
import type { Senior, Job } from '@/lib/supabase'

type MatchRow = {
  id: string
  score: number
  status: 'unmatched' | 'pending' | 'assigned'
  seniors: Senior
  jobs: Job
}

const STATUS_META = {
  unmatched: { label: '미매칭', color: 'bg-red-100 text-red-800', border: 'border-red-300' },
  pending:   { label: '매칭 대기', color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-300' },
  assigned:  { label: '배정 완료', color: 'bg-green-100 text-green-800', border: 'border-green-300' },
} as const

const NEXT_STATUS: Record<MatchRow['status'], { to: MatchRow['status']; label: string; color: string }[]> = {
  unmatched: [{ to: 'pending', label: '검토 시작 →', color: 'bg-yellow-500 hover:bg-yellow-600 text-white' }],
  pending:   [
    { to: 'assigned', label: '배정 완료 ✓', color: 'bg-green-600 hover:bg-green-700 text-white' },
    { to: 'unmatched', label: '← 되돌리기', color: 'bg-gray-200 hover:bg-gray-300 text-gray-700' },
  ],
  assigned:  [{ to: 'unmatched', label: '배정 취소', color: 'bg-gray-200 hover:bg-gray-300 text-gray-700' }],
}

function MatchCard({ match }: { match: MatchRow }) {
  const meta = STATUS_META[match.status]
  const actions = NEXT_STATUS[match.status]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
      {/* 시니어 정보 */}
      <div>
        <p className="text-lg font-bold text-gray-900">
          👤 {match.seniors.name}
          <span className="ml-2 text-base font-normal text-gray-500">
            ({match.seniors.region} · {match.seniors.desired_job} · 경력 {match.seniors.career_years}년)
          </span>
        </p>
        <p className="text-base text-gray-600 mt-1">
          💼 {match.jobs.title}
          <span className="ml-2 text-gray-400">
            ({match.jobs.region} · {match.jobs.job_type} · 경력 {match.jobs.required_career}년 이상)
          </span>
        </p>
      </div>

      {/* 점수 + 상태 */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`text-base font-bold px-3 py-1 rounded-full ${scoreBadgeColor(match.score)}`}>
          {match.score}점
        </span>
        <span className={`text-base font-medium px-3 py-1 rounded-full ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      {/* 상태 변경 버튼 */}
      <div className="flex gap-2 flex-wrap">
        {actions.map((action) => (
          <form key={action.to} action={updateMatchStatus}>
            <input type="hidden" name="matchId" value={match.id} />
            <input type="hidden" name="status" value={action.to} />
            <button
              type="submit"
              className={`text-base font-semibold px-4 py-2 rounded-lg transition-colors ${action.color}`}
            >
              {action.label}
            </button>
          </form>
        ))}
      </div>
    </div>
  )
}

export default async function AdminPage() {
  const { data: matches } = await supabase
    .from('matches')
    .select('*, seniors(*), jobs(*)')
    .order('score', { ascending: false })

  const all = (matches ?? []) as MatchRow[]
  const unmatched = all.filter((m) => m.status === 'unmatched')
  const pending   = all.filter((m) => m.status === 'pending')
  const assigned  = all.filter((m) => m.status === 'assigned')

  const groups = [
    { key: 'unmatched' as const, items: unmatched },
    { key: 'pending'   as const, items: pending   },
    { key: 'assigned'  as const, items: assigned  },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
      <p className="text-xl text-gray-600 mb-8">
        매칭 현황을 확인하고 배정 상태를 관리하세요.
      </p>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {groups.map(({ key, items }) => {
          const meta = STATUS_META[key]
          return (
            <div key={key} className={`rounded-2xl border-2 ${meta.border} bg-white px-6 py-5 shadow-sm`}>
              <span className={`inline-block px-3 py-1 rounded-full text-base font-bold mb-3 ${meta.color}`}>
                {meta.label}
              </span>
              <p className="text-5xl font-extrabold text-gray-900">{items.length}</p>
              <p className="text-lg text-gray-500 mt-1">건</p>
            </div>
          )
        })}
      </div>

      {/* 전체 비어 있을 때 */}
      {all.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-2xl font-medium">아직 매칭 데이터가 없습니다.</p>
          <p className="text-xl mt-2">시니어 프로필이 등록되면 자동으로 매칭이 생성됩니다.</p>
        </div>
      )}

      {/* 상태별 컬럼 */}
      {all.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {groups.map(({ key, items }) => {
            const meta = STATUS_META[key]
            return (
              <div key={key} className="flex flex-col gap-3">
                <h2 className={`text-xl font-bold px-4 py-2 rounded-xl ${meta.color}`}>
                  {meta.label} ({items.length})
                </h2>
                {items.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 px-5 py-8 text-center text-gray-400 text-lg">
                    없음
                  </div>
                ) : (
                  items.map((match) => <MatchCard key={match.id} match={match} />)
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
