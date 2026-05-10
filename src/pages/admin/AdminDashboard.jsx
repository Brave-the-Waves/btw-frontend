import React, { useEffect, useMemo, useState } from 'react'
import { Users, UserCheck, UsersRound, Heart, DollarSign } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { API_BASE_URL } from '@/config'

const initialStats = {
    totalMembers: 0,
    registeredMembers: 0,
    totalTeams: 0,
    registrationRevenue: 0,
    donationRevenue: 0,
    totalRevenue: 0
}

function StatCard({ title, value, icon: Icon, helper, accent = 'from-[#fc87a7] to-[#c14a75]' }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {helper ? <p className="mt-1 text-sm text-slate-500">{helper}</p> : null}
        </div>
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
    const { getAccessTokenSilently } = useAuth()
    const [stats, setStats] = useState(initialStats)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const currency = useMemo(
        () =>
            new Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: 'CAD',
                maximumFractionDigits: 2
            }),
        []
    )

    const fetchStats = async () => {
        setLoading(true)
        setError('')
        try {
            const token = await getAccessTokenSilently()
            const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (!res.ok) {
                const message = await res.text()
                throw new Error(message || 'Failed to load admin stats')
            }

            const data = await res.json()
            setStats({
                totalMembers: Number(data.totalMembers) || 0,
                registeredMembers: Number(data.registeredMembers) || 0,
                totalTeams: Number(data.totalTeams) || 0,
                registrationRevenue: Number(data.registrationRevenue) || 0,
                donationRevenue: Number(data.donationRevenue) || 0,
                totalRevenue:
                    Number(data.totalRevenue) ||
                    (Number(data.registrationRevenue) || 0) + (Number(data.donationRevenue) || 0)
            })
        } catch (err) {
            console.error('AdminDashboard fetch error:', err)
            setError(err.message || 'Could not load dashboard data.')
            setStats(initialStats)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])
    
    if (loading) {
        return (
            <section className="-mx-4 -my-5 min-h-screen space-y-5 bg-slate-50 p-6 md:-mx-6 md:-my-6 md:p-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <p className="text-slate-600">Loading dashboard metrics...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="-mx-4 -my-5 min-h-screen space-y-5 bg-slate-50 p-6 md:-mx-6 md:-my-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
                    <p className="text-sm text-slate-500">Overview of members, teams, and revenue.</p>
                </div>
            </div>

            {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <StatCard
                    title="Total Members"
                    value={stats.totalMembers.toLocaleString()}
                    helper={`${stats.registeredMembers.toLocaleString()} registered`}
                    icon={Users}
                    accent="from-[#fc87a7] to-[#c14a75]"
                />
                <StatCard
                    title="Registered Members"
                    value={stats.registeredMembers.toLocaleString()}
                    helper="Members with registered accounts"
                    icon={UserCheck}
                    accent="from-emerald-500 to-emerald-600"
                />
                <StatCard
                    title="Total Teams"
                    value={stats.totalTeams.toLocaleString()}
                    helper="Registered teams"
                    icon={UsersRound}
                    accent="from-sky-500 to-blue-600"
                />
                <StatCard
                    title="Registration Revenue"
                    value={currency.format(stats.registrationRevenue)}
                    helper="From registration payments"
                    icon={DollarSign}
                    accent="from-violet-500 to-indigo-600"
                />
                <StatCard
                    title="Donation Revenue"
                    value={currency.format(stats.donationRevenue)}
                    helper="From donations"
                    icon={Heart}
                    accent="from-amber-500 to-orange-600"
                />
                <StatCard
                    title="Total Revenue"
                    value={currency.format(stats.totalRevenue)}
                    icon={DollarSign}
                    accent="from-slate-700 to-slate-900"
                />
            </div>
        </section>
    )
}
