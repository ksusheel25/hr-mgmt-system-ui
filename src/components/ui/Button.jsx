import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

const stylesByVariant = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 shadow-sm focus-visible:outline-brand-600',
  secondary:
    'bg-white text-slate-900 hover:bg-slate-50 ring-1 ring-inset ring-slate-200 focus-visible:outline-brand-600',
  ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:outline-brand-600',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus-visible:outline-rose-600',
}

const stylesBySize = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
}

const Button = forwardRef(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        stylesByVariant[variant],
        stylesBySize[size],
        className,
      )}
      {...props}
    />
  )
})

export default Button

