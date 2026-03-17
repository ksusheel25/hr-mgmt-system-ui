import { Card, CardContent } from '../ui/Card'
import { cn } from '../../lib/cn'

export default function StatCard({ label, value, delta, icon, tone = 'slate', className }) {
  const toneStyles =
    tone === 'brand'
      ? 'bg-brand-50 text-brand-700 ring-brand-100'
      : tone === 'green'
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
        : tone === 'amber'
          ? 'bg-amber-50 text-amber-700 ring-amber-100'
          : tone === 'rose'
            ? 'bg-rose-50 text-rose-700 ring-rose-100'
            : 'bg-slate-50 text-slate-700 ring-slate-100'

  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm text-slate-600">{label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
          {delta ? <div className="mt-1 text-xs text-slate-500">{delta}</div> : null}
        </div>
        {icon ? (
          <div className={cn('grid h-11 w-11 place-items-center rounded-2xl ring-1 ring-inset', toneStyles)}>
            {icon}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

