/**
 * 실패 시나리오
 * 조작: /register → 이름 비움 / 지역 "서울" / 희망 직종 "경비·보안" / 경력 "3" → 제출
 * 기대:
 *   - 이름 필드 위 빨간 안내 박스 표시
 *   - seniors 테이블에 새 레코드가 들어가지 않음
 */
import { test, expect } from '@playwright/test'
import { testDb, resetDb } from './helpers/db'

test.describe('실패 시나리오: 이름 미입력 → 에러 + DB 미삽입', () => {
  test.beforeEach(async () => {
    // 시니어·잡·매칭 전부 초기화 (잡은 없어도 됨)
    await resetDb()
  })

  test('이름 없이 제출하면 빨간 에러 박스가 표시되고 seniors 레코드가 생성되지 않는다', async ({ page }) => {
    await page.goto('/register')

    // HTML5 required 속성을 제거해 서버 액션까지 전달되도록 함
    await page.evaluate(() => {
      const nameInput = document.getElementById('name') as HTMLInputElement
      nameInput.removeAttribute('required')
    })

    // 이름은 비운 채 나머지만 입력
    await page.getByLabel('거주 지역').selectOption('서울')
    await page.getByLabel('희망 직종').selectOption('경비·보안')
    await page.getByLabel('총 경력').fill('3')

    await page.getByRole('button', { name: '프로필 등록하기' }).click()

    // 빨간 안내 박스(서버 에러 메시지) 표시
    await expect(
      page.locator('[class*="bg-red-50"]'),
    ).toBeVisible({ timeout: 10_000 })

    // URL은 /register 를 유지해야 함
    await expect(page).toHaveURL('/register')

    // seniors 테이블에 레코드가 없어야 함
    const { count } = await testDb
      .from('seniors')
      .select('*', { count: 'exact', head: true })
    expect(count).toBe(0)
  })
})
