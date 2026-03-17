import { Users, UserCheck, Plane, UserPlus } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PageHeader from '../../components/layout/PageHeader'
import StatCard from '../../components/layout/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const employeeGrowth = [
  { month: 'Oct', employees: 78 },
  { month: 'Nov', employees: 86 },
  { month: 'Dec', employees: 92 },
  { month: 'Jan', employees: 105 },
  { month: 'Feb', employees: 118 },
  { month: 'Mar', employees: 128 },
]

const deptDistribution = [
  { dept: 'Engineering', count: 52 },
  { dept: 'Sales', count: 24 },
  { dept: 'HR', count: 8 },
  { dept: 'Finance', count: 10 },
  { dept: 'Operations', count: 18 },
  { dept: 'Design', count: 6 },
]

const activity = [
  { id: 'a1', title: 'New employee onboarded', meta: 'Aisha Khan • Engineering • 2h ago' },
  { id: 'a2', title: 'Leave approved', meta: 'Rahul Mehta • Casual Leave • 6h ago' },
  { id: 'a3', title: 'Department updated', meta: 'Priya Singh moved to Operations • Yesterday' },
  { id: 'a4', title: 'New joinee starting Monday', meta: 'Karthik R • Sales • 2 days ago' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Key HR metrics, trends, and recent activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Employees" value="128" delta="+10 this quarter" tone="brand" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Active" value="121" delta="94.5% active rate" tone="green" icon={<UserCheck className="h-5 w-5" />} />
        <StatCard label="On Leave" value="7" delta="3 pending approvals" tone="amber" icon={<Plane className="h-5 w-5" />} />
        <StatCard label="New Joinees" value="5" delta="Next 30 days" tone="rose" icon={<UserPlus className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Employee growth</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={employeeGrowth} margin={{ top: 12, right: 16, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }}
                    labelStyle={{ color: '#0f172a' }}
                  />
                  <Area type="monotone" dataKey="employees" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptDistribution} margin={{ top: 12, right: 10, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="dept" stroke="#64748b" tickLine={false} axisLine={false} hide />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }}
                    labelStyle={{ color: '#0f172a' }}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
              {deptDistribution.slice(0, 6).map((d) => (
                <div key={d.dept} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200/60">
                  <span className="truncate">{d.dept}</span>
                  <span className="font-semibold text-slate-900">{d.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-slate-100">
            {activity.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-900">{item.title}</div>
                  <div className="mt-0.5 truncate text-xs text-slate-500">{item.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

