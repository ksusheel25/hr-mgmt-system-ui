import { cn } from '../../lib/cn'

export default function FormField({ label, hint, error, required, className, children }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-3">
          <label className="text-sm font-medium text-slate-900">
            {label} {required ? <span className="text-rose-600">*</span> : null}
          </label>
          {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
        </div>
      )}
      {children}
      {error ? <div className="text-xs text-rose-600">{error}</div> : null}
    </div>
  )
}

