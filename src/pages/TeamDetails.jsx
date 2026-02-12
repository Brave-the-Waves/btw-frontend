import React from 'react'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Trophy, Calendar, Copy, Pencil, Check, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import JoinTeamOverlay from '../components/teams/JoinTeamOverlay'
import DisplayMembers from '@/components/teams/DisplayMembers'
import RecentDonations from '@/components/users/RecentDonations'
import { AnimatePresence, motion } from 'framer-motion'
import { API_BASE_URL } from '@/config'

export default function TeamDetails() {

  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [copied, setCopied] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [refreshKey, setRefreshKey] = useState(false)
  const { name } = useParams()
  const [joinModal, setJoinModal] = useState(false)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    division: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  
  const teamName = decodeURIComponent(name)

  const { getAccessTokenSilently, isAuthenticated, refreshUser, user } = useAuth()
  const navigate = useNavigate()
  const [showRegisterWarning, setShowRegisterWarning] = useState(false)
  
  // Check membership directly from authenticated user context instead of re-fetching
  const isInTeam = isAuthenticated && user?.team?.name === teamName
  const isCaptain = user && team && (user._id === team.captain || user.id === team.captain)

  const handleEditClick = () => {
    setEditForm({
      name: team.name,
      description: team.description,
      division: team.division
    })
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    if (!editForm.name || !editForm.description) return 

    setIsSaving(true)
    try {
        const token = await getAccessTokenSilently()
        // Assuming API supports PUT /api/teams/:id
        // Since original fetch was by name, using team.id is safer if name changes
        const response = await fetch(`${API_BASE_URL}/api/teams/${team.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: editForm.name,
                description: editForm.description,
                division: editForm.division
            })
        })

        if (!response.ok) {
            throw new Error('Failed to update team details')
        }

        const updatedTeam = await response.json()
        setTeam(prev => ({
            ...prev,
            name: updatedTeam.name,
            description: updatedTeam.description,
            division: updatedTeam.division
        }))
        setIsEditing(false)
        await refreshUser()
        
        // If name changed, we might need to navigate or update URL, but for now let's keep it simple
        // If name changes, URL /team/:name becomes invalid technically until reload or navigate
        if (updatedTeam.name !== teamName) {
           navigate(`/teams/${encodeURIComponent(updatedTeam.name)}`, { replace: true })
        }
    } catch (error) {
        console.error('Error updating team:', error)
        alert('Failed to update team details')
    } finally {
        setIsSaving(false)
    }
  }

  const copyInviteCode = () => {
    navigator.clipboard.writeText(team.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1300)
  }

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/teams/${teamName}/members`)
        if (!response.ok) {
          throw new Error('Failed to fetch team members')
        }
        const membersData = await response.json()
        setMembers(membersData)
      } catch (error) {
        console.error('Error fetching team members:', error)
      }
    }

    fetchMembers()
  }, [teamName, refreshKey])

  useEffect(() => {
    const fetchTeamDetails = async () => {
      console.log('Fetching team details for:', teamName)
      try {
        const headers = {
          'Content-Type': 'application/json' 
        }

        if (isAuthenticated) {
          try {
            const token = await getAccessTokenSilently()
            headers['Authorization'] = `Bearer ${token}`
          } catch (err) {
            console.warn('Failed to get token for public request:', err)
          }
        }

        const response = await fetch(`${API_BASE_URL}/api/public/teams/${teamName}`, {
            headers
          })
        if (!response.ok) {
          throw new Error('Failed to fetch team details')
        }
        const teamData = await response.json()
        
        setTeam({
          id: teamData._id,
          captain: teamData.captain,
          name: teamData.name,
          division: teamData.division,
          description: teamData.description,
          raised: Number(teamData.totalRaised) || 0,
          goal: Number(teamData.donationGoal) || 10000,
          inviteCode : teamData.inviteCode ? teamData.inviteCode : '', //backend deals with removing inviteCode for members
        })
      } catch (error) {
        console.error('Error fetching team details:', error)
      }
    }
    
    fetchTeamDetails()
  }, [teamName, refreshKey, isAuthenticated, getAccessTokenSilently])

  const leaveTeam = async () => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${API_BASE_URL}/api/teams/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to leave team')
      }
      await refreshUser()
      navigate('/teams')
    } 
    catch (error) {
      console.error('Error leaving team:', error)
    }
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-10 gap-6">
          {/* Main content area - 70% on large screens */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div className="w-full max-w-2xl">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Division</label>
                        <select
                          value={editForm.division}
                          onChange={(e) => setEditForm(prev => ({ ...prev, division: e.target.value }))}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                        >
                          {['Student', 'Corporate', 'Survivor', 'Community'].map(div => (
                            <option key={div} value={div}>{div}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Team Name</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition-all font-bold text-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition-all resize-none"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isCaptain && !isEditing && (
                        <button 
                          onClick={handleEditClick}
                          className="mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <Pencil className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">Edit Details</span>
                        </button>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-sm font-medium">
                          {team.division} Division
                        </span>
                      </div>
                      <h1 className="text-4xl font-bold text-slate-900 mb-4">{team.name}</h1>
                      {
                        team.inviteCode && (
                          <h2 
                            onClick={copyInviteCode}
                            className="flex items-center gap-2 text-slate-600 mb-4 cursor-pointer hover:text-slate-900 transition-colors"
                            title="Click to copy invite code"
                          >
                            {team.inviteCode}
                            {copied ? <span className="text-xs">✓ Copied!</span> : <Copy className="w-4 h-4" />}
                          </h2>
                        )
                      }
                      <p className="text-slate-600 max-w-2xl text-lg mb-4">{team.description}</p>
                      {isInTeam ? (
                        !confirmLeave ? (
                          <button
                            onClick={() => setConfirmLeave(true)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Leave Team
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={leaveTeam}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                              Confirm Leave
                            </button>
                            <button
                              onClick={() => setConfirmLeave(false)}
                              className="px-3 py-1 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )
                      ) : (
                        <>
                              <button
                                onClick={() => {
                                  if (!isAuthenticated) {
                                    navigate('/login')
                                  } else if (!user?.isRegistered) {
                                    setShowRegisterWarning(true)
                                  } else {
                                    setJoinModal(true)
                                  }
                                }}
                                className="px-3 py-1 text-sm bg-slate-900 text-white rounded-md hover:bg-slate-700 transition-colors cursor-pointer"
                              >
                                Join Team
                              </button>
                          <AnimatePresence>
                            {joinModal && (
                              <JoinTeamOverlay 
                                teamName={team.name}
                                onClose={() => setJoinModal(false)}
                                onSuccess={ async() => {
                                  await refreshUser()
                                  setRefreshKey(prev => !prev)
                                }}
                              />
                            )}
                          </AnimatePresence>
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
                                  <p className="text-slate-600 mb-6">You need to complete your event registration before joining this team.</p>
                                  <div className="flex flex-col gap-3">
                                    <button
                                      onClick={() => navigate('/register')}
                                      className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                                    >
                                      Complete Registration
                                    </button>
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
                        </>
                      )}
                    </>
                  )}
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl min-w-[250px]">
                  <p className="text-sm text-slate-500 mb-1">Total Raised</p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">${team.raised.toLocaleString()}</p>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-pink-600 h-full rounded-full" style={{ width: `${(team.raised / team.goal) * 100}%` }} />
                  </div>
                  <p className="text-xs text-slate-500">of ${team.goal.toLocaleString()} goal</p>
                </div>
              </div>

              <DisplayMembers 
                team={team} 
                members={members}
                setMembers={setMembers}
                onMemberChange={() => setRefreshKey(prev => !prev)}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Donations sidebar - 30% on large screens */}
          <div className="lg:col-span-3">
            <RecentDonations context="team" targetId={team.id} itemsPerPage={5} />
          </div>
        </div>
      </div>
    </div>
  )
}
