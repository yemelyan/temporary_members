import Link from 'next/link'

export const runtime = 'edge'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-slate-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-50">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-slate-700 dark:text-slate-300">
          Page Not Found
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
