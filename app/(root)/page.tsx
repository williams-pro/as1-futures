import { LoginForm, BackgroundElements } from './_components'

export default function RootPage() {
  return (
    <div className="relative w-full px-4 py-6 flex items-center justify-center">
      <BackgroundElements />
      
      <div className="relative z-10 w-full animate-scale-in flex justify-center">
        <LoginForm />
      </div>
    </div>
  )
}
