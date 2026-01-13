import React from 'react'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Trophy, Calendar, Copy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import JoinTeamOverlay from '../components/teams/JoinTeamOverlay'
import DisplayMembers from '@/components/teams/DisplayMembers'
import RecentDonations from '@/components/users/RecentDonations'
import { AnimatePresence } from 'framer-motion'

export default function TeamDetails() {

  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [copied, setCopied] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [refreshKey, setRefreshKey] = useState(false)
  const { name } = useParams()
  const [joinModal, setJoinModal] = useState(false)
  const teamName = decodeURIComponent(name)

  const { getAccessTokenSilently, isAuthenticated, refreshUser, user } = useAuth()
  const navigate = useNavigate()
  
  // Check membership directly from authenticated user context instead of re-fetching
  const isInTeam = isAuthenticated && user?.team?.name === teamName

  const copyInviteCode = () => {
    navigator.clipboard.writeText(team.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1300)
  }

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/public/teams/${teamName}/members`)
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

        const response = await fetch(`http://localhost:8000/api/public/teams/${teamName}`, {
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
      const response = await fetch(`http://localhost:8000/api/teams/leave`, {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
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
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
                      {team.division} Division
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">{team.name}</h1>
                  {
                    team.inviteCode && (
                      <h2 
                        onClick={copyInviteCode}
                        className="flex items-center gap-2 text-slate-600 mb-4 cursor-pointer hover:text-pink-600 transition-colors"
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
                        onClick={() => setJoinModal(true)}
                        className="px-3 py-1 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
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
                    </>
                  )}
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl min-w-[250px]">
                  <p className="text-sm text-slate-500 mb-1">Total Raised</p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">${team.raised.toLocaleString()}</p>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: `${(team.raised / team.goal) * 100}%` }} />
                  </div>
                  <p className="text-xs text-slate-500">of ${team.goal.toLocaleString()} goal</p>
                </div>
              </div>

              <DisplayMembers 
                team={team} 
                members={members}
                setMembers={setMembers}
                onMemberChange={() => setRefreshKey(prev => !prev)}
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
