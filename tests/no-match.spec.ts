/**
 * 엣지 시나리오 (매칭 없음)
 * 사전 조건: jobs 테이블에 서울/경비·보안 시니어와 절대 매칭되지 않는 공고 1건
 *   - 지역·직종 불일치 + 경력 초과 → score=0 → matches에 미저장
 * 조작: /register 에서 "서울 / 경비·보안 / 3" 시니어 등록 → /recommendations 접속
 * 기대: "현재 매칭되는 일자리가 없습니다" 안내 박스 표시
 */
import { test, expect } from '@playwright/test'
import { resetDb } from './helpers/db'

test.describe('엣지 시나리오: 매칭되는 일자리 없음', () => {
  test.beforeEach(async () => {
    // score=0이 되도록 3개 조건 전부 불일치시킨 공고
    //   지역: 부산(≠서울)  →  지역 점수 0
    //   직종: 사무직(≠경비·보안)  →  직종 점수 0
    //   필요 경력 10년 > 시니어 3년  →  경력 점수 0
    // 합계 0점 → RPC가 match 레코드 미생성
    await resetDb({
      title: '매칭불가_테스트공고',
      region: '부산',
      job_type: '사무직',
      required_career: 10,
    })
  })

  test('score=0인 공고만 있을 때 추천 페이지에 "현재 매칭되는 일자리가 없습니다"가 표시된다', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel('이름').fill('매칭없는시니어')
    await page.getByLabel('거주 지역').selectOption('서울')
    await page.getByLabel('희망 직종').selectOption('경비·보안')
    await page.getByLabel('총 경력').fill('3')

    await Promise.all([
      page.waitForURL(/\/recommendations/, { timeout: 20_000 }),
      page.getByRole('button', { name: '프로필 등록하기' }).click(),
    ])

    // 매칭 결과가 없을 때의 안내 문구 확인
    await expect(
      page.getByText('현재 매칭되는 일자리가 없습니다'),
    ).toBeVisible({ timeout: 10_000 })
  })
})
