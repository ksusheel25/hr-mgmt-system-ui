import { cn } from '../../lib/cn'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-2xl bg-white shadow-soft ring-1 ring-inset ring-slate-200/60', className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('px-5 pt-5', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <div className={cn('text-sm font-semibold text-slate-900', className)} {...props} />
}

export function CardDescription({ className, ...props }) {
  return <div className={cn('mt-1 text-sm text-slate-600', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('px-5 pb-5 pt-4', className)} {...props} />
}

