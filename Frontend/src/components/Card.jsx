export default function Card({ title, actions, children, className = "" }){
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-800">
          {title && <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</h3>}
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
