import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import { Trophy, Medal, TrendingUp } from 'lucide-react'
import { API_BASE_URL } from '@/config'

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('teams') // 'teams' or 'individuals'
  const [data, setData] = useState({ teams: [], individuals: [] })

  useEffect(() => {
    let mounted = true
    const fetchAll = async () => {
      try {
        const [usersRes, teamsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users/leaderboard`),
          fetch(`${API_BASE_URL}/api/public/teams/leaderboard`)
        ])

        if (!usersRes.ok || !teamsRes.ok) {
          console.error('Failed to fetch leaderboards', usersRes.status, teamsRes.status)
          return
        }

        const usersJson = await usersRes.json()
        const teamsJson = await teamsRes.json()

        const individuals = usersJson.map(u => ({
          name: u.name,
          team: u.team?.name ?? '',
          raised: Number(u.amountRaised) || 0
        }))

        const teams = teamsJson.map(t => ({
          name: t.name,
          raised: Number(t.totalRaised) || 0,
          members: t.memberCount || 0
        }))

        if (mounted) setData({ teams, individuals })
      } catch (err) {
        console.error('Failed to load leaderboards', err)
      }
    }

    fetchAll()
    return () => { mounted = false }
  }, [])

  const getMedalColor = (index) => {
    switch(index) {
      case 0: return "text-yellow-500"
      case 1: return "text-slate-400"
      case 2: return "text-amber-700"
      default: return "text-slate-300"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Fundraising Leaderboard</h1>
          <p className="text-slate-600 text-lg">Celebrating our top contributors and teams</p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'teams' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Top Teams
            </button>
            <button
              onClick={() => setActiveTab('individuals')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'individuals' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Top Individuals
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {(activeTab === 'teams' ? data.teams : data.individuals).map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md transition-shadow"
            >
              <div className={`text-2xl font-bold w-12 text-center ${getMedalColor(index)}`}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                {activeTab === 'individuals' && (
                  <p className="text-sm text-slate-500">{item.team}</p>
                )}
                {activeTab === 'teams' && (
                  <p className="text-sm text-slate-500">{item.members} members</p>
                )}
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-pink-600">
                  ${item.raised.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Raised</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

