'use client'

import { useActionState } from 'react'
import { registerSenior } from '@/app/actions'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
const JOB_TYPES = ['사무직', '경비·보안', '청소·환경', '요양·돌봄', '조리·음식', '판매·영업', '교육·강사', '농업·임업', '기술·생산', '기타']

export default function RegisterForm() {
  const [state, action, isPending] = useActionState(registerSenior, null)

  return (
    <form action={action} className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-7">
      {state?.error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-800 rounded-xl px-5 py-4 text-xl font-medium">
          ⚠️ {state.error}
        </div>
      )}

      {/* 이름 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-xl font-semibold text-gray-800">
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="홍길동"
          required
          className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* 지역 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="region" className="text-xl font-semibold text-gray-800">
          거주 지역 <span className="text-red-500">*</span>
        </label>
        <select
          id="region"
          name="region"
          required
          className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500 bg-white"
        >
          <option value="">지역 선택</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* 희망 직종 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="desired_job" className="text-xl font-semibold text-gray-800">
          희망 직종 <span className="text-red-500">*</span>
        </label>
        <select
          id="desired_job"
          name="desired_job"
          required
          className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500 bg-white"
        >
          <option value="">직종 선택</option>
          {JOB_TYPES.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
      </div>

      {/* 경력 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="career_years" className="text-xl font-semibold text-gray-800">
          총 경력 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            id="career_years"
            name="career_years"
            type="number"
            min={0}
            max={60}
            placeholder="0"
            required
            className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500 w-40"
          />
          <span className="text-xl text-gray-600">년</span>
        </div>
        <p className="text-lg text-gray-400">경력이 없으면 0을 입력하세요.</p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:bg-blue-400 text-white text-2xl font-bold rounded-xl py-5 transition-colors"
      >
        {isPending ? '⏳ 매칭 중...' : '프로필 등록하기'}
      </button>
    </form>
  )
}
