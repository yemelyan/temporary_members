'use client'

interface AdminTabsProps {
  activeTab: 'pending' | 'all'
  onTabChange: (tab: 'pending' | 'all') => void
  pendingCount: number
}

export default function AdminTabs({
  activeTab,
  onTabChange,
  pendingCount,
}: AdminTabsProps) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          onClick={() => onTabChange('pending')}
          className={`group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
            activeTab === 'pending'
              ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Pending Approval
          {pendingCount > 0 && (
            <span
              className={`ml-2 rounded-full py-0.5 px-2 text-xs font-semibold ${
                activeTab === 'pending'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onTabChange('all')}
          className={`group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
          }`}
        >
          All Users
        </button>
      </nav>
    </div>
  )
}
