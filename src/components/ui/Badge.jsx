import { cn } from '../../lib/cn'

const stylesByVariant = {
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  brand: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
}

export default function Badge({ className, variant = 'slate', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        stylesByVariant[variant],
        className,
      )}
      {...props}
    />
  )
}

