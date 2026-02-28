import React, { useState, useEffect } from 'react'
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
        const [participantRes, teamsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/participants/leaderboard`),
          fetch(`${API_BASE_URL}/api/public/teams/leaderboard`)
        ])

        if (!participantRes.ok || !teamsRes.ok) {
          console.error('Failed to fetch leaderboards', participantRes.status, teamsRes.status)
          return
        }

        const participantJson = await participantRes.json()
        const teamsJson = await teamsRes.json()

        const individuals = participantJson.map(u => ({
          name: u.name,
          team: u.team?.name ?? '',
          raised: Number(u.amountRaised) || 0,
          picture: u.picture || null
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5">
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-[#fc87a7]" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Fundraising Leaderboard</h1>
            <Trophy className="w-8 h-8 text-[#fc87a7]" />
          </div>
          <p className="text-slate-600 text-lg">Celebrating our top contributors and teams</p>
        </motion.div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-xl shadow-md border border-slate-200 inline-flex backdrop-blur">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-8 py-2.5 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'teams' 
                  ? 'bg-[#fc87a7] text-white shadow-lg shadow-[#fc87a7]/30' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Top Teams
            </button>
            <button
              onClick={() => setActiveTab('individuals')}
              className={`px-8 py-2.5 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'individuals' 
                  ? 'bg-[#fc87a7] text-white shadow-lg shadow-[#fc87a7]/30' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-[#fc87a7]/30 shadow-sm hover:shadow-lg hover:shadow-[#fc87a7]/10 transition-all duration-300 flex items-center gap-6"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#fc87a7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className={`text-3xl font-bold w-16 text-center ${getMedalColor(index)} drop-shadow-sm`}>
                  {index === 0 && <Trophy className="w-8 h-8 inline" />}
                  {index === 1 && <Medal className="w-8 h-8 inline" />}
                  {index === 2 && <Medal className="w-8 h-8 inline" />}
                  {index > 2 && (index + 1)}
                </div>
              </div>

              {index < 5 && (
                <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-[#fc87a7] to-[#c14a75] flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0">
                  {item.picture
                    ? <img src={item.picture} alt={item.name} className="w-full h-full object-cover" />
                    : (item.name || '?').charAt(0).toUpperCase()
                  }
                </div>
              )}
              
              <div className="flex-1 relative z-10">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#fc87a7] transition-colors">{item.name}</h3>
                {activeTab === 'individuals' && (
                  <p className="text-sm text-slate-500 group-hover:text-slate-600">{item.team || '—'}</p>
                )}
                {activeTab === 'teams' && (
                  <p className="text-sm text-slate-500 group-hover:text-slate-600">{item.members} member{item.members !== 1 ? 's' : ''}</p>
                )}
              </div>

              <div className="text-right relative z-10">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#fc87a7] to-[#c14a75] bg-clip-text text-transparent">
                  ${item.raised.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Raised</div>
              </div>
            </motion.div>
          ))}
        </div>

        {data.teams.length === 0 && data.individuals.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg">Loading leaderboard data...</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

