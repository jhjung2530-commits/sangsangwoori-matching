import { createClient } from '@supabase/supabase-js'

// NEXT_PUBLIC anon key — 공개 키이므로 테스트 헬퍼에서 직접 사용
const SUPABASE_URL = 'https://zzlcxywnxzgsoltxidah.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bGN4eXdueHpnc29sdHhpZGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTEwMjIsImV4cCI6MjA5MzU2NzAyMn0.9eIPmPYmfEbRez4Nq_Ax8Yyvsn0xqSiTKhy-wIShv_Q'

export const testDb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export type SeedJob = {
  title: string
  region: string
  job_type: string
  required_career: number
}

/**
 * 테스트 전 DB를 초기화한다.
 * FK 순서: matches → seniors/jobs 순으로 삭제한 뒤 seedJob을 삽입.
 */
export async function resetDb(seedJob?: SeedJob) {
  await testDb.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await testDb.from('seniors').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await testDb.from('jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (seedJob) {
    const { error } = await testDb.from('jobs').insert(seedJob)
    if (error) throw new Error(`DB seed 실패: ${error.message}`)
  }
}
