'use client'

import { deleteJob } from '@/app/actions'

export default function DeleteJobButton({ jobId, title }: { jobId: string; title: string }) {
  return (
    <form action={deleteJob}>
      <input type="hidden" name="jobId" value={jobId} />
      <button
        type="submit"
        className="shrink-0 text-base font-medium text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-lg px-4 py-2 transition-colors"
        onClick={(e) => {
          if (!confirm(`"${title}" 일자리를 삭제할까요?\n연결된 매칭 데이터도 함께 삭제됩니다.`)) {
            e.preventDefault()
          }
        }}
      >
        삭제
      </button>
    </form>
  )
}
