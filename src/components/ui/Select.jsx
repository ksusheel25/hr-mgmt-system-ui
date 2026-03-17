import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

const Select = forwardRef(function Select({ className, error, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full rounded-xl bg-white px-3 text-sm text-slate-900',
        'ring-1 ring-inset ring-slate-200',
        'focus:outline-none focus:ring-2 focus:ring-brand-600/30 focus:ring-inset',
        error && 'ring-rose-300 focus:ring-rose-600/25',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
})

export default Select

