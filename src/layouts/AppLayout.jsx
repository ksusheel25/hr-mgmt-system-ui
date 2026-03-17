import { useMemo, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/auth-context'
import { navItems } from '../routes/nav'
import { cn } from '../lib/cn'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

function RoleBadge({ role }) {
  const variant = role === 'ADMIN' ? 'brand' : role === 'MANAGER' ? 'amber' : 'green'
  return <Badge variant={variant}>{role}</Badge>
}

export default function AppLayout() {
  const { role, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = useMemo(() => navItems.filter((i) => i.roles.includes(role)), [role])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        {/* Sidebar */}
        <aside
          className={cn(
            'w-72 shrink-0 border-r border-slate-200/70 bg-white',
            'hidden lg:flex lg:flex-col',
          )}
        >
          <div className="px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">Acme HRMS</div>
                <div className="mt-0.5 text-xs text-slate-500">HR Management System</div>
              </div>
              <RoleBadge role={role} />
            </div>
          </div>
          <nav className="flex-1 px-3 pb-4">
            <div className="space-y-1">
              {items.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100',
                    )
                  }
                  end
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-900">{user?.name}</div>
                <div className="truncate text-xs text-slate-500">{user?.email}</div>
              </div>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <div className="space-y-1">
                    <div className="h-0.5 w-5 rounded bg-slate-700" />
                    <div className="h-0.5 w-5 rounded bg-slate-700" />
                    <div className="h-0.5 w-5 rounded bg-slate-700" />
                  </div>
                </button>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">Acme HRMS</div>
                  <div className="hidden text-xs text-slate-500 sm:block">
                    Welcome back{user?.name ? `, ${user.name}` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RoleBadge role={role} />
                <Button variant="secondary" size="sm" onClick={logout} className="lg:hidden">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onMouseDown={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs bg-white shadow-soft">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Acme HRMS</div>
                <div className="mt-0.5 text-xs text-slate-500">Menu</div>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-900">{user?.name}</div>
                  <div className="truncate text-xs text-slate-500">{user?.email}</div>
                </div>
                <RoleBadge role={role} />
              </div>
            </div>
            <nav className="px-2 pb-4">
              <div className="space-y-1">
                {items.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                        isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100',
                      )
                    }
                    end
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  )
}

