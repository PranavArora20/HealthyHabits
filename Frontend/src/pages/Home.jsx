import { Link } from 'react-router-dom'
import { useState } from 'react'
import BlurText from '../components/BlurText.jsx'

export default function Home(){
  const [showContent, setShowContent] = useState(false)

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-20 md:py-28 grid place-items-center text-center">
        <div>
          <BlurText
            text="Welcome to HealthyHabits"
            animateBy="words"
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white"
            onAnimationComplete={() => setShowContent(true)}
          />
          {showContent && (
            <>
              <p className="mt-5 text-base md:text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
                Track your activities, nutrition, sleep, goals, and more. Join challenges, build habits, and stay consistent.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Link to="/login" className="inline-flex items-center rounded-md border border-brand-600/40 bg-brand-600 px-5 py-2.5 text-white text-base shadow-sm hover:bg-brand-700 hover:border-brand-700">
                  Login
                </Link>
                <Link to="/register" className="inline-flex items-center rounded-md border px-5 py-2.5 text-base bg-white text-gray-900 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700">
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(600px_200px_at_50%_-20%,rgba(59,130,246,0.25),transparent)]" />
    </section>
  )
}
