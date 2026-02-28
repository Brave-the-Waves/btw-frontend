import React from 'react'
import { Outlet, useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { Trophy, Users, UserCheck, Heart, ClipboardList, Home } from 'lucide-react'

export default function EventLayout() {
  const { eventName } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const basePath = `/event/${eventName}`
  const currentPath = location.pathname

  const sidebarItems = [
    { label: 'Overview', href: basePath, icon: Home, exact: true },
    { label: 'Donate', href: '#donate', icon: Heart, isScroll: true },
    { label: 'Teams', href: `${basePath}/teams`, icon: Users },
    { label: 'Participants', href: `${basePath}/participants`, icon: UserCheck },
    { label: 'Leaderboard', href: `${basePath}/leaderboard`, icon: Trophy },
  ]

  const isActive = (item) => {
    if (item.exact) return currentPath === item.href
    if (item.isScroll) return false
    return currentPath.startsWith(item.href)
  }

  const handleSidebarClick = (item) => {
    if (item.isScroll) {
      // If we're on the event overview, scroll directly
      if (currentPath === basePath) {
        document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })
      } else {
        // Navigate to event overview, then scroll
        navigate(basePath, { state: { scrollTo: 'donate' } })
      }
    } else {
      navigate(item.href)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 pt-28 pb-6 px-4 bg-white border-r border-slate-200 z-30 overflow-y-auto">
          <div className="mb-6 px-3">
            <p className="mt-5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Event</p>
            <h2 className="text-lg font-bold text-slate-900 leading-tight truncate">
              {eventName?.replace(/([A-Z])/g, ' $1').replace(/(\D)(\d)/g, '$1 $2').trim() || 'Event'}
            </h2>
          </div>

          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => {
              const active = isActive(item)
              return (
                <button
                  key={item.label}
                  onClick={() => handleSidebarClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-[#fc87a7]/10 text-[#fc87a7] shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-[#fc87a7]' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Register CTA */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/register')
                } else {
                  navigate('/login', { state: { from: '/register' } })
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#fc87a7] hover:bg-[#c14a75] text-white font-medium text-sm transition-all cursor-pointer shadow-md shadow-[#fc87a7]/20"
            >
              <ClipboardList className="w-4 h-4" />
              {isAuthenticated ? 'Register Now' : 'Sign Up & Register'}
            </button>
          </div>
        </aside>

        {/* ── Mobile sidebar (horizontal tabs) ── */}
        <div className="lg:hidden fixed top-[110px] left-0 right-0 z-30 bg-white border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center gap-1 px-4 py-2 min-w-max">
            {sidebarItems.map((item) => {
              const active = isActive(item)
              return (
                <button
                  key={item.label}
                  onClick={() => handleSidebarClick(item)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#fc87a7]/10 text-[#fc87a7]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              )
            })}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/register')
                } else {
                  navigate('/login', { state: { from: '/register' } })
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap bg-[#fc87a7] text-white cursor-pointer"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Register
            </button>
          </div>
        </div>

        {/* ── Main content ── */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          {/* Extra top padding on mobile for the tab bar */}
          <div className="pt-10 lg:pt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
