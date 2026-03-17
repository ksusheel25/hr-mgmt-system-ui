import { cn } from '../../lib/cn'

export function Table({ className, ...props }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-inset ring-slate-200/60', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm" {...props} />
      </div>
    </div>
  )
}

export function THead({ className, ...props }) {
  return <thead className={cn('bg-slate-50 text-slate-600', className)} {...props} />
}

export function TH({ className, ...props }) {
  return <th className={cn('whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide', className)} {...props} />
}

export function TBody({ className, ...props }) {
  return <tbody className={cn('divide-y divide-slate-100', className)} {...props} />
}

export function TR({ className, ...props }) {
  return <tr className={cn('hover:bg-slate-50/70 transition-colors', className)} {...props} />
}

export function TD({ className, ...props }) {
  return <td className={cn('px-4 py-3 align-middle text-slate-900', className)} {...props} />
}

