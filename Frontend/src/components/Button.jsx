export default function Button({ children, className = "", ...props }){
  return (
    <button {...props} className={`inline-flex items-center justify-center rounded-md border border-brand-600/40 bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 hover:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600 cursor-pointer ${className}`}>
      {children}
    </button>
  )
}
