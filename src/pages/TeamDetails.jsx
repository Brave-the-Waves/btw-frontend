import React from 'react'
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
  const { name, eventName } = useParams()
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
           navigate(`/event/${eventName}/teams/${encodeURIComponent(updatedTeam.name)}`, { replace: true })
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
        setMembers(membersData.map(u => ({ ...u, name: u.name || 'Unknown' })))
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
      navigate(`/event/${eventName}/teams`)
    } 
    catch (error) {
      console.error('Error leaving team:', error)
    }
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-slate-200 border-t-[#fc87a7] rounded-full"></motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5">
      <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        <div className="grid lg:grid-cols-10 gap-6 pb-20">
          {/* Main content area - 70% on large screens */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
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
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-[#fc87a7] text-white rounded-lg hover:shadow-lg hover:shadow-[#fc87a7]/30 transition-all disabled:opacity-50 font-medium"
                        >
                          {isSaving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
                        </motion.button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-[#fc87a7]/30 transition-all font-medium"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isCaptain && !isEditing && (
                        <motion.button 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={handleEditClick}
                          className="mb-4 flex items-center gap-2 text-slate-500 hover:text-[#fc87a7] transition-colors group"
                        >
                          <div className="p-2 bg-slate-100 group-hover:bg-[#fc87a7]/10 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">Edit Details</span>
                        </motion.button>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#fc87a7]/10 to-transparent text-slate-900 text-sm font-semibold border border-[#fc87a7]/20">
                          {team.division} Division
                        </span>
                      </div>
                      <h1 className="text-5xl font-bold text-slate-900 mb-4">{team.name}</h1>
                      {
                        team.inviteCode && (
                          <motion.h2 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={copyInviteCode}
                            className="flex items-center gap-2 text-slate-700 mb-4 cursor-pointer hover:text-[#fc87a7] transition-colors font-mono text-sm bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:border-[#fc87a7]/30 w-fit group"
                            title="Click to copy invite code"
                          >
                            {team.inviteCode}
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400 group-hover:text-[#fc87a7]" />}
                          </motion.h2>
                        )
                      }
                      <p className="text-slate-600 max-w-2xl text-lg mb-6">{team.description}</p>
                      {isInTeam ? (
                        !confirmLeave ? (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setConfirmLeave(true)}
                            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            Leave Team
                          </motion.button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <motion.button
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              onClick={leaveTeam}
                              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                              Confirm Leave
                            </motion.button>
                            <button
                              onClick={() => setConfirmLeave(false)}
                              className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        )
                      ) : (
                        <>
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => {
                              if (!isAuthenticated) {
                                navigate('/login')
                              } else if (!user?.isRegistered) {
                                setShowRegisterWarning(true)
                              } else {
                                setJoinModal(true)
                              }
                            }}
                            className="px-4 py-2 text-sm bg-[#fc87a7] text-white rounded-lg hover:shadow-lg hover:shadow-[#fc87a7]/30 transition-all font-medium cursor-pointer"
                          >
                            Join Team
                          </motion.button>
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
                              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center"
                                >
                                  <h3 className="text-xl font-bold text-slate-900 mb-2">Complete Event Registration</h3>
                                  <p className="text-slate-600 mb-6">You need to complete your event registration before joining this team.</p>
                                  <div className="flex flex-col gap-3">
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      onClick={() => navigate('/register')}
                                      className="w-full px-4 py-3 bg-[#fc87a7] text-white rounded-lg hover:shadow-lg hover:shadow-[#fc87a7]/30 font-semibold transition-all"
                                    >
                                      Complete Registration
                                    </motion.button>
                                    <button
                                      onClick={() => setShowRegisterWarning(false)}
                                      className="text-slate-500 hover:text-[#fc87a7] text-sm font-medium transition-colors"
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
                
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-[#fc87a7]/10 to-[#fc87a7]/5 p-6 rounded-2xl border border-[#fc87a7]/20">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Total Raised</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#fc87a7] to-[#c14a75] bg-clip-text text-transparent mb-3">${team.raised.toLocaleString()}</p>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(team.raised / team.goal) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-[#fc87a7] to-[#c14a75] h-full rounded-full" 
                    />
                  </div>
                  <p className="text-xs text-slate-600">of ${team.goal.toLocaleString()} goal</p>
                </motion.div>
              </div>

              <DisplayMembers 
                team={team} 
                members={members}
                setMembers={setMembers}
                onMemberChange={() => setRefreshKey(prev => !prev)}
                isEditing={isEditing}
              />
            </motion.div>
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
