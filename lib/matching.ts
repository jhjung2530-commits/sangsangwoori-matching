import type { Senior, Job } from './supabase'

const REGION_MAP: Record<string, string> = {
  '서울특별시': '서울',
  '경기도': '경기',
  '인천광역시': '인천',
}

const JOB_MAP: Record<string, string> = {
  '경비직': '경비',
  '청소직': '청소',
  '조리직': '조리',
  '돌봄직': '돌봄',
}

function normalizeRegion(v: string): string { return REGION_MAP[v] ?? v }
function normalizeJob(v: string): string    { return JOB_MAP[v]    ?? v }

// 최대 6점: 지역(+3) + 직종(+2) + 경력(+1)
// 비교 시 정규화 적용 (원본 데이터 수정 없음)
export function calculateScore(senior: Senior, job: Job): number {
  let score = 0
  if (normalizeRegion(senior.region)      === normalizeRegion(job.region))   score += 3
  if (normalizeJob(senior.desired_job)    === normalizeJob(job.job_type))    score += 2
  if (senior.career_years >= job.required_career)                            score += 1
  return score
}

export function scoreLabel(score: number): string {
  if (score >= 6) return '완전 일치'
  if (score >= 4) return '적합'
  if (score >= 2) return '부분 일치'
  return '낮음'
}

// 6점=금색, 4-5점=녹색, 1-3점=회색
export function scoreBadgeColor(score: number): string {
  if (score >= 6) return 'bg-yellow-100 text-yellow-800 border border-yellow-400'
  if (score >= 4) return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-600'
}
