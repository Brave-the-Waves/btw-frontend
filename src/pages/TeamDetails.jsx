import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Trophy, Calendar, Copy, Pencil, Check, X, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import JoinTeamOverlay from '../components/teams/JoinTeamOverlay'
import DisplayMembers from '@/components/teams/DisplayMembers'
import RecentDonations from '@/components/users/RecentDonations'
import { AnimatePresence, motion } from 'framer-motion'
import { API_BASE_URL } from '@/config'

const NAME_REGEX = /^[A-Za-z0-9 .'-]+$/
const MAX_DESCRIPTION_LENGTH = 300

export default function TeamDetails() {

  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [copied, setCopied] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showRemoveMembers, setShowRemoveMembers] = useState(false)
  const [removingMemberId, setRemovingMemberId] = useState(null)
  const [promotingMemberId, setPromotingMemberId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(false)
  const { name, eventName } = useParams()
  const [joinModal, setJoinModal] = useState(false)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    division: ''
  })
  const [touched, setTouched] = useState({
    name: false,
    description: false
  })
  const [isSaving, setIsSaving] = useState(false)
  
  const teamName = decodeURIComponent(name)

  const { getAccessTokenSilently, isAuthenticated, refreshUser, user } = useAuth()
  const navigate = useNavigate()
  const [showRegisterWarning, setShowRegisterWarning] = useState(false)
  
  // Check membership directly from authenticated user context instead of re-fetching
  const isInTeam = isAuthenticated && user?.team?.name === teamName
  const isCaptain = user && team && (user._id === team.captain || user.id === team.captain)

  const normalizedTeamName = editForm.name.replace(/\s+/g, ' ').trim()

  const getTeamNameError = () => {
    if (!normalizedTeamName) return 'Team name is required'
    if (normalizedTeamName.length < 2 || normalizedTeamName.length > 50) return 'Team name must be 2–50 characters'
    if (!NAME_REGEX.test(normalizedTeamName)) return "Use letters, numbers, spaces, hyphen, apostrophe, or period only"
    return ''
  }

  const getDescriptionError = () => {
    if (editForm.description.length > MAX_DESCRIPTION_LENGTH) return `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`
    return ''
  }

  const teamNameError = getTeamNameError()
  const descriptionError = getDescriptionError()
  const isFormValid = !teamNameError && !descriptionError

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

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
    markTouched('name')
    markTouched('description')
    
    if (!isFormValid) return 

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
                name: normalizedTeamName,
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

  const deleteTeam = async () => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${API_BASE_URL}/api/teams/${team.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to delete team')
      }
      await refreshUser()
      navigate(`/event/${eventName}/teams`)
    }
    catch (error) {
      console.error('Error deleting team:', error)
    }
  }

  const removeMember = async (memberId) => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${API_BASE_URL}/api/teams/${team.id}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to remove member')
      }
      setRemovingMemberId(null)
      setRefreshKey(prev => !prev)
    }
    catch (error) {
      console.error('Error removing member:', error)
    }
  }

  const transferCaptaincy = async (newCaptainId) => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${API_BASE_URL}/api/teams/${team.id}/transfer-captain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newCaptainId })
      })
      if (!response.ok) {
        throw new Error('Failed to transfer captaincy')
      }
      const data = await response.json()
      setPromotingMemberId(null)
      setShowRemoveMembers(false)
      await refreshUser()
      setRefreshKey(prev => !prev)
    }
    catch (error) {
      console.error('Error transferring captaincy:', error)
    }
  }

  // Reset confirmation states when modal closes
  useEffect(() => {
    if (!showRemoveMembers) {
      setRemovingMemberId(null)
      setPromotingMemberId(null)
    }
  }, [showRemoveMembers])

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
        <button
          type="button"
          onClick={() => navigate(`/event/${eventName}/teams`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

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
                          disabled
                          className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none transition-all cursor-not-allowed opacity-60"
                        >
                          {['Sports', 'Corporate', 'Community'].map(div => (
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
                          onBlur={() => markTouched('name')}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition-all font-bold text-lg"
                          aria-invalid={touched.name && !!teamNameError}
                        />
                        {touched.name && teamNameError && (
                          <p className="text-xs text-red-600 mt-1">{teamNameError}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/<[^>]*>/g, '').slice(0, MAX_DESCRIPTION_LENGTH)
                            setEditForm(prev => ({ ...prev, description: cleaned }))
                          }}
                          onBlur={() => markTouched('description')}
                          rows={4}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition-all resize-none"
                          aria-invalid={touched.description && !!descriptionError}
                        />
                        {descriptionError && (
                          <p className="text-xs text-red-600 mt-1">{descriptionError}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">{editForm.description.length}/{MAX_DESCRIPTION_LENGTH} characters</p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={handleSaveEdit}
                          disabled={isSaving || !isFormValid}
                          className="flex items-center gap-2 px-4 py-2 bg-[#fc87a7] text-white rounded-lg hover:shadow-lg hover:shadow-[#fc87a7]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={copyInviteCode}
                            className="flex items-center gap-2 text-slate-700 mb-4 cursor-pointer hover:text-[#fc87a7] transition-colors text-sm bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:border-[#fc87a7]/30 w-fit group"
                            title="Click to copy invite code"
                          >
                            <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">Invite Code:</span>
                            <span className="font-mono">{team.inviteCode}</span>
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400 group-hover:text-[#fc87a7]" />}
                          </motion.div>
                        )
                      }
                      <p className="text-slate-600 max-w-2xl text-lg mb-6">{team.description}</p>
                      {isInTeam ? (
                        isCaptain ? (
                          !confirmDelete ? (
                            <div className="flex items-center gap-2">
                              <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setShowRemoveMembers(true)}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                              >
                                <Users className="w-4 h-4" />
                                Manage Members
                              </motion.button>
                              <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setConfirmDelete(true)}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                              >
                                Delete Team
                              </motion.button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={deleteTeam}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                              >
                                Confirm Delete
                              </motion.button>
                              <button
                                onClick={() => setConfirmDelete(false)}
                                className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          )
                        ) : (
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

      {/* Remove Members Modal */}
      <AnimatePresence>
        {showRemoveMembers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRemoveMembers(false)}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                setRemovingMemberId(null)
                setPromotingMemberId(null)
              }}
              className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-slate-100/50">
                <h2 className="text-2xl font-bold text-slate-900">Manage Members</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowRemoveMembers(false)
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="p-6 space-y-3">
                {members.length === 1 ? (
                  <p className="text-slate-600 text-center py-8">No other members to manage</p>
                ) : (
                  members
                    .filter(member => member._id !== team.captain && member.id !== team.captain)
                    .map((member) => (
                      <motion.div
                        key={member._id || member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {member.picture && (
                            <img
                              src={member.picture}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-slate-900">{member.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              promotingMemberId === (member._id || member.id)
                                ? transferCaptaincy(member._id || member.id)
                                : setPromotingMemberId(member._id || member.id)
                            }}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                              promotingMemberId === (member._id || member.id)
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {promotingMemberId === (member._id || member.id) ? 'Confirm' : 'Make Captain'}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              removingMemberId === (member._id || member.id)
                                ? removeMember(member._id || member.id)
                                : setRemovingMemberId(member._id || member.id)
                            }}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                              removingMemberId === (member._id || member.id)
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {removingMemberId === (member._id || member.id) ? 'Confirm' : 'Remove'}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
