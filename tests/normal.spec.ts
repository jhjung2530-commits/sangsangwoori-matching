/**
 * 정상 시나리오
 * 사전 조건: jobs 테이블에 "서울 / 경비·보안 / 요구 경력 3년" 공고 1건
 * 조작: /register → 이름 "테스트시니어" · 지역 "서울" · 희망 직종 "경비·보안" · 경력 "5" 입력 → 제출
 * 기대:
 *   - "등록이 완료되었습니다" 초록 배너 표시
 *   - /recommendations?senior_id=... 에서 6점 금색 배지 카드가 상단에 표시
 */
import { test, expect } from '@playwright/test'
import { resetDb } from './helpers/db'

test.describe('정상 시나리오: 서울/경비·보안/5년 등록 → 6점 완전 매칭', () => {
  test.beforeEach(async () => {
    await resetDb({
      title: '서울 아파트 경비원',
      region: '서울',
      job_type: '경비·보안',
      required_career: 3,
    })
  })

  test('등록 후 추천 페이지에 성공 배너와 6점 금색 배지 카드가 표시된다', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel('이름').fill('테스트시니어')
    await page.getByLabel('거주 지역').selectOption('서울')
    await page.getByLabel('희망 직종').selectOption('경비·보안')
    await page.getByLabel('총 경력').fill('5')

    await Promise.all([
      page.waitForURL(/\/recommendations/, { timeout: 20_000 }),
      page.getByRole('button', { name: '프로필 등록하기' }).click(),
    ])

    // 등록 완료 초록 배너
    await expect(page.getByText('등록이 완료되었습니다')).toBeVisible({ timeout: 10_000 })

    // 첫 번째 매칭 카드에 6점이 표시되어야 함
    // score=3(지역)+2(직종)+1(경력)=6
    const firstCard = page.locator('div.bg-white.rounded-2xl.shadow-md').first()
    await expect(firstCard.getByText('6점', { exact: true })).toBeVisible()

    // 금색 배지 라벨(완전 일치) 확인
    await expect(firstCard.getByText('완전 일치')).toBeVisible()

    // URL에 senior_id 포함
    expect(page.url()).toContain('senior_id=')
    expect(page.url()).toContain('registered=true')
  })
})
