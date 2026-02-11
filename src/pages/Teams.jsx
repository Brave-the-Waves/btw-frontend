import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import Button from '@/components/ui/button'
import { Search, Users, Trophy, ArrowRight, Lock, Plus, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CreateTeamOverlay from '@/components/teams/CreateTeamOverlay'
import JoinTeamOverlay from '@/components/teams/JoinTeamOverlay'
import { API_BASE_URL } from '@/config'

const handleFetchTeams = async () => {
  try{ 
    const response = await fetch(`${API_BASE_URL}/api/public/teams`, {
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
  const { isAuthenticated, getAccessTokenSilently, user, refreshUser, isLoading } = useAuth()
  const [showRegisterWarning, setShowRegisterWarning] = useState(false)
  const [teams, setTeams] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [itemsToShow, setItemsToShow] = useState(20)
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
      const response = await fetch(`${API_BASE_URL}/api/registrations/team`, {
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

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
    } else if (!user?.isRegistered) {
      setShowRegisterWarning(true)
    } else {
      setShowCreateModal(true)
    }
  }

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
    } else if (!user?.isRegistered) {
      setShowRegisterWarning(true)
    } else {
      setShowJoinModal(true)
    }
  }

  const handleJoinSuccess = async () => {
    await refreshUser()
    // refresh members list
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

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const displayedTeams = filteredTeams.slice(0, itemsToShow)
  const hasMore = filteredTeams.length > itemsToShow

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
                onClick={handleCreateClick} 
                disabled={isLoading || !isAuthenticated || user?.team}
                className="bg-[#fa6090] text-white hover:bg-pink-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-lg"
                title={
                  !isAuthenticated ? "Log in first to create a team" :
                  user?.team ? "You are already in a team" :
                  !user?.isRegistered ? "Complete registration first to create a team" :
                  "Create a new team"
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
              <Button 
                onClick={handleJoinClick} 
                disabled={isLoading || !isAuthenticated || user?.team}
                className="bg-white text-black hover:bg-slate-100 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer border-2"
                title={
                  !isAuthenticated ? "Log in first to join a team" :
                  user?.team ? "You are already in a team" :
                  !user?.isRegistered ? "Complete registration first to join a team" :
                  "Join a team"
                }
              >
                Join a Team
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTeams.map((team) => (
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
                  className="flex-1 border-2 rounded-md text-slate-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/teams/${team.name}`)}
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setItemsToShow(prev => prev + 20)}
              className="px-6 py-3 bg-[#fc87a7]/10 text-pink-700 hover:bg-pink-100 border-2 rounded-lg cursor-pointer"
            >
              Load More ({filteredTeams.length - itemsToShow} remaining)
            </Button>
          </div>
        )}

        {filteredTeams.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No teams found matching "{searchTerm}"
          </div>
        )}
      </div>

      <AnimatePresence>
        {showJoinModal && (
          <JoinTeamOverlay 
            onClose={() => setShowJoinModal(false)}
            onSuccess={handleJoinSuccess}
          />
        )}
      </AnimatePresence>

      {showCreateModal && (
        <CreateTeamOverlay 
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTeam}
          isLoading={isCreating}
        />
      )}

      <AnimatePresence>
        {showRegisterWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">Complete Event Registration</h3>
              <p className="text-slate-600 mb-6">You need to complete your event registration before creating or joining a team.</p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate('/register')}
                  className="w-full bg-[#fa6090] text-white hover:bg-pink-700"
                >
                  Complete Registration
                </Button>
                <button 
                  onClick={() => setShowRegisterWarning(false)}
                  className="text-slate-500 hover:text-pink-600 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

