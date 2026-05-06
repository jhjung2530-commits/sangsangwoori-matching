import type { Senior, Job } from './supabase'

/**
 * 매칭 점수 계산 (최대 100점)
 * - 지역 일치:       +50점
 * - 직종 일치:       +30점
 * - 경력 요건 충족:  +20점
 */
export function calculateScore(senior: Senior, job: Job): number {
  let score = 0
  if (senior.region === job.region) score += 50
  if (senior.desired_job === job.job_type) score += 30
  if (senior.career_years >= job.required_career) score += 20
  return score
}

export function scoreLabel(score: number): string {
  if (score >= 90) return '매우 적합'
  if (score >= 60) return '적합'
  if (score >= 30) return '보통'
  return '낮음'
}

export function scoreBadgeColor(score: number): string {
  if (score >= 90) return 'bg-green-100 text-green-800'
  if (score >= 60) return 'bg-blue-100 text-blue-800'
  if (score >= 30) return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-600'
}
