import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import Button from '@/components/ui/button'
import { Search, Users, Trophy, ArrowRight, Lock, Plus, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CreateTeamOverlay from '@/components/teams/CreateTeamOverlay'

const handleFetchTeams = async () => {
  try{ 
    const response = await fetch('http://localhost:8000/api/public/teams', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (!response.ok) {
      throw new Error('Error fetching teams')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch teams', error)
    return []
  } 
}


export default function Teams() {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently, user, refreshUser } = useAuth()
  const [teams, setTeams] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadTeams = async () => {
      const data = await handleFetchTeams()
      setTeams(data.map((team) => ({
        id: team._id,
        name: team.name,
        division: team.division,
        members: team.memberCount,
        raised: team.totalRaised,
        description: team.description,
      })))
    }
    loadTeams()
  }, [])

  const handleCreateTeam = async (teamData) => {
    setIsCreating(true)
    const token = await getAccessTokenSilently()
    try {
      const response = await fetch('http://localhost:8000/api/registrations/team', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(teamData)
      })
      if (!response.ok) {
        throw new Error('Error creating team')
      }
      const newTeam = await response.json()
      
      // Refresh teams list
      const data = await handleFetchTeams()
      setTeams(data.map((team) => ({
        id: team._id,
        name: team.name,
        division: team.division,
        members: team.memberCount,
        raised: team.totalRaised,
        description: team.description,
      })))
      
      // Refresh user data to update "Create Team" button state
      await refreshUser()

      setShowCreateModal(false)
      // Optionally navigate to the new team page
      // navigate(`/teams/${newTeam.name}`)
    } catch (error) {
      console.error('Failed to create team', error)
      alert('Failed to create team. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: '/teams' }
      })
    } else {
      setShowJoinModal(true)
    }
  }

  const handleJoinSubmit = async (e) => {
    e.preventDefault()
    setJoinError('')
    setIsShaking(false)

    try {
      const token = await getAccessTokenSilently()
      const response = await fetch('http://localhost:8000/api/registrations/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ inviteCode: inviteCode.trim() })
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Invalid invite code')
      }
      // Refresh user data to update "Join Team" button state
      await refreshUser()
      
      setIsSuccess(true)
      setTimeout(() => {
        setShowJoinModal(false)
        setInviteCode('')
        setIsSuccess(false)
      }, 1500)
    } catch (error) {
      console.error(error)
      setJoinError(error.message)
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">All Teams</h1>
            <p className="text-slate-600 max-w-2xl">Find a team to join or support. Together we are making waves for women's health.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search teams..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowCreateModal(true)} 
                disabled={!isAuthenticated || !user?.hasPaid || user?.team}
                className="bg-pink-600 text-white hover:bg-pink-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !isAuthenticated ? "Log in to create a team" :
                  !user?.hasPaid ? "Pay registration fee to create a team" :
                  user?.team ? "You are already in a team" : "Create a new team"
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
              <Button 
                onClick={handleJoinClick} 
                disabled={!isAuthenticated || user?.team || !user?.hasPaid}
                className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !isAuthenticated ? "Log in to join a team" :
                  !user?.hasPaid ? "Pay registration fee to join a team" :
                  user?.team ? "You are already in a team" : "Join a team"
                }
              >
                Join a Team
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <motion.div 
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  team.division === 'Corporate' ? 'bg-blue-100 text-blue-600' :
                  team.division === 'Survivor' ? 'bg-pink-100 text-pink-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {team.division}
                </span>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{team.name}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{team.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{team.members} Members</span>
                </div>
                <div className="font-medium text-slate-900">
                  ${team.raised.toLocaleString()} Raised
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(`/teams/${team.name}`)} // Assuming name is unique or use ID
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Join Team Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowJoinModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl z-10"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Join a Team</h2>
              <p className="text-slate-600 mb-6">Enter the invite code provided by your team captain.</p>
              
              <form onSubmit={handleJoinSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Invite Code</label>
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {isSuccess ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                        >
                          <Check className="w-5 h-5 text-green-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="lock"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                        >
                          <Lock className="w-5 h-5 text-slate-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.input 
                      animate={
                        isShaking ? { x: [-10, 10, -10, 10, 0] } : 
                        isSuccess ? { 
                          borderColor: '#22c55e', 
                          backgroundColor: '#f0fdf4',
                          boxShadow: '0 0 0 2px #bbf7d0'
                        } : {}
                      }
                      transition={{ duration: 0.33 }}
                      type="text" 
                      value={inviteCode}
                      onChange={(e) => {
                        setInviteCode(e.target.value)
                        setJoinError('')
                      }}
                      disabled={isSuccess}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 outline-none uppercase tracking-widest transition-colors duration-300 ${
                        joinError 
                          ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                          : 'border-slate-200 focus:ring-pink-500'
                      }`}
                      placeholder="ABC123"
                      required
                    />
                  </div>
                  {joinError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 ml-1"
                    >
                      {joinError}
                    </motion.p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowJoinModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-pink-500 text-white hover:bg-pink-600">
                    Join Team
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showCreateModal && (
        <CreateTeamOverlay 
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTeam}
          isLoading={isCreating}
        />
      )}
    </div>
  )
}

