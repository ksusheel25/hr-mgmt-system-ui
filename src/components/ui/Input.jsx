import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

const Input = forwardRef(function Input({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-xl bg-white px-3 text-sm text-slate-900',
        'ring-1 ring-inset ring-slate-200 placeholder:text-slate-400',
        'focus:outline-none focus:ring-2 focus:ring-brand-600/30 focus:ring-inset',
        error && 'ring-rose-300 focus:ring-rose-600/25',
        className,
      )}
      {...props}
    />
  )
})

export default Input

