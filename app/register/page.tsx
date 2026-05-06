export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">시니어 프로필 등록</h1>
      <p className="text-xl text-gray-600 mb-10">
        정보를 입력하시면 맞춤 일자리를 추천해 드립니다.
      </p>

      <form className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-7">
        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xl font-semibold text-gray-800">
            이름
          </label>
          <input
            id="name"
            type="text"
            placeholder="홍길동"
            className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 지역 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="region" className="text-xl font-semibold text-gray-800">
            거주 지역
          </label>
          <select
            id="region"
            className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="">지역 선택</option>
            {["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* 희망 직종 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="desired_job" className="text-xl font-semibold text-gray-800">
            희망 직종
          </label>
          <select
            id="desired_job"
            className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="">직종 선택</option>
            {["사무직", "경비·보안", "청소·환경", "요양·돌봄", "조리·음식", "판매·영업", "교육·강사", "농업·임업", "기술·생산", "기타"].map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        {/* 경력 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="career_years" className="text-xl font-semibold text-gray-800">
            총 경력 (년)
          </label>
          <input
            id="career_years"
            type="number"
            min={0}
            max={50}
            placeholder="예: 10"
            className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-2xl font-bold rounded-xl py-5 transition-colors"
        >
          프로필 등록하기
        </button>
      </form>
    </div>
  );
}
