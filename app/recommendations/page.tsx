export default function RecommendationsPage() {
  const placeholderCards = [
    { rank: 1, score: 95, title: "경비원 (야간)", region: "서울", job_type: "경비·보안", required_career: 0 },
    { rank: 2, score: 82, title: "요양보호사 보조", region: "경기", job_type: "요양·돌봄", required_career: 1 },
    { rank: 3, score: 74, title: "학교 급식 보조", region: "서울", job_type: "조리·음식", required_career: 2 },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">추천 일자리</h1>
      <p className="text-xl text-gray-600 mb-10">
        내 프로필과 가장 잘 맞는 일자리를 점수 순으로 보여드립니다.
      </p>

      {/* 안내 배너 */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-6 py-5 mb-8 text-xl text-yellow-800 font-medium">
        ℹ️ 아직 프로필이 등록되지 않았습니다. 먼저{" "}
        <a href="/register" className="underline font-bold text-blue-700">프로필을 등록</a>
        해 주세요.
      </div>

      {/* 추천 카드 목록 (샘플 뼈대) */}
      <div className="flex flex-col gap-5">
        {placeholderCards.map((card) => (
          <div
            key={card.rank}
            className="bg-white rounded-2xl shadow-md border border-gray-100 px-7 py-6 flex items-center gap-6 opacity-40 pointer-events-none"
          >
            {/* 순위 배지 */}
            <div className="w-14 h-14 rounded-full bg-blue-700 text-white flex items-center justify-center text-2xl font-extrabold shrink-0">
              {card.rank}
            </div>

            {/* 내용 */}
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-900">{card.title}</p>
              <p className="text-lg text-gray-500 mt-1">
                {card.region} · {card.job_type} · 경력 {card.required_career}년 이상
              </p>
            </div>

            {/* 매칭 점수 */}
            <div className="text-right shrink-0">
              <p className="text-3xl font-extrabold text-blue-700">{card.score}점</p>
              <p className="text-base text-gray-400">매칭 점수</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-lg text-gray-400">
        프로필 등록 후 실제 매칭 결과가 표시됩니다.
      </p>
    </div>
  );
}
