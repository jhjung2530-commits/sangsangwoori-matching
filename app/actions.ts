'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export type ActionState = { error: string } | { success: string } | null

// ──────────────────────────────────────────
// 시니어 등록 + 자동 매칭 (RPC)
// ──────────────────────────────────────────
export async function registerSenior(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = (formData.get('name') as string).trim()
  const region = formData.get('region') as string
  const desired_job = formData.get('desired_job') as string
  const career_years = parseInt(formData.get('career_years') as string)
  const phone = (formData.get('phone') as string | null)?.trim() ?? ''

  if (!name || !region || !desired_job || isNaN(career_years) || !phone) {
    return { error: '모든 항목을 빠짐없이 입력해 주세요.' }
  }
  if (career_years < 0 || career_years > 60) {
    return { error: '경력 연수를 올바르게 입력해 주세요. (0~60년)' }
  }

  const { data: senior, error: seniorError } = await supabase
    .from('seniors')
    .insert({ name, region, desired_job, career_years, phone })
    .select()
    .single()

  if (seniorError || !senior) {
    return { error: '등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }

  await supabase.rpc('recalculate_matches_for_senior', { p_senior_id: senior.id })

  redirect(`/recommendations?senior_id=${senior.id}&name=${encodeURIComponent(name)}&registered=true`)
}

// ──────────────────────────────────────────
// 일자리 등록 + 자동 매칭 (RPC)
// ──────────────────────────────────────────
export async function addJob(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get('title') as string).trim()
  const region = formData.get('region') as string
  const job_type = formData.get('job_type') as string
  const required_career = parseInt(formData.get('required_career') as string)

  if (!title || !region || !job_type || isNaN(required_career)) {
    return { error: '모든 항목을 빠짐없이 입력해 주세요.' }
  }
  if (required_career < 0 || required_career > 50) {
    return { error: '필요 경력을 올바르게 입력해 주세요. (0~50년)' }
  }

  const { data: newJob, error } = await supabase
    .from('jobs')
    .insert({ title, region, job_type, required_career })
    .select()
    .single()

  if (error || !newJob) {
    return { error: '일자리 등록 중 오류가 발생했습니다.' }
  }

  await supabase.rpc('recalculate_matches_for_job', { p_job_id: newJob.id })

  revalidatePath('/jobs')
  revalidatePath('/admin')
  return { success: `"${title}" 일자리가 등록됐습니다.` }
}

// ──────────────────────────────────────────
// 일자리 삭제 (연결된 매칭도 CASCADE 삭제)
// ──────────────────────────────────────────
export async function deleteJob(formData: FormData) {
  const jobId = formData.get('jobId') as string
  await supabase.from('jobs').delete().eq('id', jobId)
  revalidatePath('/jobs')
  revalidatePath('/admin')
}

// ──────────────────────────────────────────
// 매칭 상태 변경
// ──────────────────────────────────────────
export async function updateMatchStatus(formData: FormData) {
  const matchId = formData.get('matchId') as string
  const status = formData.get('status') as string
  await supabase.from('matches').update({ status }).eq('id', matchId)
  revalidatePath('/admin')
}
