import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'

export default function Modal({ open, onClose, title, description, children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onMouseDown={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-inset ring-slate-200',
          )}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {(title || description) && (
            <div className="px-5 pt-5">
              {title && <div className="text-base font-semibold text-slate-900">{title}</div>}
              {description && <div className="mt-1 text-sm text-slate-600">{description}</div>}
            </div>
          )}
          <div className="px-5 pb-5 pt-4">{children}</div>
          {footer && <div className="border-t border-slate-100 px-5 py-4">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body,
  )
}

