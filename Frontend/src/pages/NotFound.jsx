import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="min-h-[60vh] grid place-items-center text-center">
      <div>
        <h1 className="text-5xl font-extrabold text-brand-600 dark:text-brand-400">404</h1>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">The page you are looking for doesn’t exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center rounded-md border border-brand-600/40 bg-brand-600 px-5 py-2.5 text-white text-base shadow-sm hover:bg-brand-700 hover:border-brand-700">Go Home</Link>
        </div>
      </div>
    </div>
  )
}
