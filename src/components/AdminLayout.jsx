import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, UserRoundCog, Wallet, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const adminLinks = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Members', to: '/admin/members', icon: Users },
  { label: 'Teams', to: '/admin/teams', icon: UserRoundCog },
  { label: 'Finance', to: '/admin/finance', icon: Wallet },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex md:w-72 lg:w-80 flex-col border-r border-slate-200 bg-white">
          <div className="px-6 py-6 border-b border-slate-100">
            <button
              onClick={() => navigate('/')}
              className="text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin</p>
              <h1 className="text-xl font-bold text-slate-900">Brave the Waves</h1>
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#fc87a7]/10 text-[#fc87a7]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="border-t border-slate-100 px-4 py-4">
            <div className="mb-3 rounded-xl bg-[#fc87a7]/10 px-3 py-2">
              <p className="text-xs text-slate-500">Signed in as</p>
              <p className="text-sm font-medium text-slate-800 truncate">{user?.name || user?.email || 'Admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#fc87a7] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Admin Panel</p>
                <p className="text-base font-semibold text-slate-900 md:text-lg">Brave the Waves</p>
              </div>

              <div className="md:hidden">
                <select
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                  onChange={(e) => navigate(e.target.value)}
                  value=""
                >
                  <option value="" disabled>Navigate</option>
                  {adminLinks.map((link) => (
                    <option key={link.to} value={link.to}>{link.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </header>

          <main className="px-4 py-5 md:px-6 md:py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
