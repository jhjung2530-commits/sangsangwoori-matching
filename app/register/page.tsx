import RegisterForm from './RegisterForm'

export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">시니어 프로필 등록</h1>
      <p className="text-xl text-gray-600 mb-10">
        정보를 입력하시면 맞춤 일자리를 자동으로 추천해 드립니다.
      </p>
      <RegisterForm />
    </div>
  )
}
