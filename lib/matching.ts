import type { Senior, Job } from './supabase'

// 최대 6점: 지역(+3) + 직종(+2) + 경력(+1)
export function calculateScore(senior: Senior, job: Job): number {
  let score = 0
  if (senior.region === job.region) score += 3
  if (senior.desired_job === job.job_type) score += 2
  if (senior.career_years >= job.required_career) score += 1
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
