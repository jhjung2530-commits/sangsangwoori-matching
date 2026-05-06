'use client'

import { useActionState, useEffect, useState } from 'react'
import { addJob } from '@/app/actions'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
const JOB_TYPES = ['사무직', '경비·보안', '청소·환경', '요양·돌봄', '조리·음식', '판매·영업', '교육·강사', '농업·임업', '기술·생산', '기타']

export default function JobForm() {
  const [state, action, isPending] = useActionState(addJob, null)
  const [formKey, setFormKey] = useState(0)

  // 등록 성공 시 폼 초기화
  useEffect(() => {
    if (state && 'success' in state) {
      setFormKey((k) => k + 1)
    }
  }, [state])

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">새 일자리 등록</h2>

      {state && 'error' in state && (
        <div className="bg-red-50 border-2 border-red-300 text-red-800 rounded-xl px-5 py-4 text-lg font-medium mb-6">
          ⚠️ {state.error}
        </div>
      )}
      {state && 'success' in state && (
        <div className="bg-green-50 border-2 border-green-300 text-green-800 rounded-xl px-5 py-4 text-lg font-medium mb-6">
          ✅ {state.success}
        </div>
      )}

      <form key={formKey} action={action} className="flex flex-col gap-5">
        {/* 공고명 */}
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-lg font-semibold text-gray-700">
            공고명 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="예: 아파트 경비원 (야간)"
            required
            className="border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 지역 + 직종 (2열) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="job-region" className="text-lg font-semibold text-gray-700">
              지역 <span className="text-red-500">*</span>
            </label>
            <select
              id="job-region"
              name="region"
              required
              className="border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">지역 선택</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="job_type" className="text-lg font-semibold text-gray-700">
              직종 <span className="text-red-500">*</span>
            </label>
            <select
              id="job_type"
              name="job_type"
              required
              className="border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">직종 선택</option>
              {JOB_TYPES.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 필요 경력 */}
        <div className="flex flex-col gap-1">
          <label htmlFor="required_career" className="text-lg font-semibold text-gray-700">
            필요 경력 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="required_career"
              name="required_career"
              type="number"
              min={0}
              max={50}
              defaultValue={0}
              required
              className="border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 w-36"
            />
            <span className="text-lg text-gray-600">년 이상</span>
          </div>
          <p className="text-base text-gray-400">경력 무관이면 0을 입력하세요.</p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white text-xl font-bold rounded-xl py-4 transition-colors"
        >
          {isPending ? '⏳ 등록 중...' : '일자리 등록하기'}
        </button>
      </form>
    </div>
  )
}
