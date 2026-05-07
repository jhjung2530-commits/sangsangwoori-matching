export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { scoreLabel, scoreBadgeColor } from '@/lib/matching'
import Link from 'next/link'
import type { Senior, Job } from '@/lib/supabase'

type MatchRow = {
  id: string
  score: number
  status: string
  seniors: Senior
  jobs: Job
}

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ senior_id?: string; name?: string }>
}) {
  const { senior_id, name } = await searchParams

  if (!senior_id) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-5xl mb-6">🔍</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">프로필이 필요합니다</h1>
        <p className="text-xl text-gray-500 mb-8">먼저 프로필을 등록하시면 맞춤 일자리를 추천해 드립니다.</p>
        <Link
          href="/register"
          className="inline-block bg-blue-700 text-white text-2xl font-bold px-10 py-4 rounded-xl hover:bg-blue-800 transition-colors"
        >
          프로필 등록하러 가기
        </Link>
      </div>
    )
  }

  const { data: matches } = await supabase
    .from('matches')
    .select('*, seniors(*), jobs(*)')
    .eq('senior_id', senior_id)
    .order('score', { ascending: false })

  const typedMatches = (matches ?? []) as MatchRow[]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {name ? `${name}님의 ` : ''}추천 일자리
        </h1>
        <p className="text-xl text-gray-600">
          매칭 점수가 높은 순서로 보여드립니다.
        </p>
      </div>

      {typedMatches.length === 0 ? (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-8 py-12 text-center">
          <p className="text-4xl mb-4">😔</p>
          <p className="text-2xl font-bold text-yellow-800 mb-2">아직 매칭된 일자리가 없습니다</p>
          <p className="text-xl text-yellow-700">
            등록하신 지역·직종과 맞는 일자리가 생기면 바로 안내해 드립니다.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {typedMatches.map((match, idx) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 px-7 py-6 flex items-center gap-6"
            >
              {/* 순위 */}
              <div className="w-14 h-14 rounded-full bg-blue-700 text-white flex items-center justify-center text-2xl font-extrabold shrink-0">
                {idx + 1}
              </div>

              {/* 일자리 정보 */}
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-gray-900 truncate">{match.jobs.title}</p>
                <p className="text-lg text-gray-500 mt-1">
                  📍 {match.jobs.region} &nbsp;·&nbsp; 🏷 {match.jobs.job_type}
                  &nbsp;·&nbsp; 경력 {match.jobs.required_career}년 이상
                </p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {match.seniors.region === match.jobs.region && (
                    <span className="bg-blue-100 text-blue-700 text-base px-3 py-1 rounded-full font-medium">✓ 지역 일치</span>
                  )}
                  {match.seniors.desired_job === match.jobs.job_type && (
                    <span className="bg-green-100 text-green-700 text-base px-3 py-1 rounded-full font-medium">✓ 직종 일치</span>
                  )}
                  {match.seniors.career_years >= match.jobs.required_career && (
                    <span className="bg-purple-100 text-purple-700 text-base px-3 py-1 rounded-full font-medium">✓ 경력 충족</span>
                  )}
                </div>
              </div>

              {/* 점수 */}
              <div className="text-right shrink-0">
                <p className="text-4xl font-extrabold text-blue-700">{match.score}<span className="text-2xl">점</span></p>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${scoreBadgeColor(match.score)}`}>
                  {scoreLabel(match.score)}
                </span>
                <p className="text-xs text-gray-400 mt-1">최대 6점</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/register"
          className="text-xl text-blue-600 underline hover:text-blue-800"
        >
          다른 프로필로 다시 검색하기
        </Link>
      </div>
    </div>
  )
}
