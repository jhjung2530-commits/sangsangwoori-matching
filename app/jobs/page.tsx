import { supabase } from '@/lib/supabase'
import JobForm from './JobForm'
import DeleteJobButton from './DeleteJobButton'
import type { Job } from '@/lib/supabase'

const JOB_TYPE_COLOR: Record<string, string> = {
  '사무직':    'bg-blue-100 text-blue-700',
  '경비·보안': 'bg-slate-100 text-slate-700',
  '청소·환경': 'bg-teal-100 text-teal-700',
  '요양·돌봄': 'bg-pink-100 text-pink-700',
  '조리·음식': 'bg-orange-100 text-orange-700',
  '판매·영업': 'bg-yellow-100 text-yellow-700',
  '교육·강사': 'bg-purple-100 text-purple-700',
  '농업·임업': 'bg-green-100 text-green-700',
  '기술·생산': 'bg-indigo-100 text-indigo-700',
  '기타':      'bg-gray-100 text-gray-600',
}

export default async function JobsPage() {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  const allJobs = (jobs ?? []) as Job[]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">일자리 관리</h1>
        <p className="text-xl text-gray-600">
          일자리를 등록하면 기존 시니어와 즉시 자동 매칭됩니다.
        </p>
      </div>

      {/* 등록 폼 */}
      <JobForm />

      {/* 일자리 목록 */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            등록된 일자리
          </h2>
          <span className="bg-blue-100 text-blue-800 text-lg font-bold px-4 py-1 rounded-full">
            총 {allJobs.length}건
          </span>
        </div>

        {allJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-xl">등록된 일자리가 없습니다.</p>
            <p className="text-lg mt-1">위 폼에서 첫 일자리를 등록해 보세요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {allJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 flex items-center gap-4"
              >
                {/* 직종 배지 */}
                <span
                  className={`shrink-0 text-base font-semibold px-3 py-1 rounded-full ${JOB_TYPE_COLOR[job.job_type] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {job.job_type}
                </span>

                {/* 공고 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold text-gray-900 truncate">{job.title}</p>
                  <p className="text-base text-gray-500 mt-0.5">
                    📍 {job.region} &nbsp;·&nbsp;
                    경력 {job.required_career}년 이상 &nbsp;·&nbsp;
                    {new Date(job.created_at).toLocaleDateString('ko-KR')} 등록
                  </p>
                </div>

                {/* 삭제 버튼 */}
                <DeleteJobButton jobId={job.id} title={job.title} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
