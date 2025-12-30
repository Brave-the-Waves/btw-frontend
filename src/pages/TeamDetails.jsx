import React from 'react'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Users, Trophy, Calendar } from 'lucide-react'

export default function TeamDetails() {

  const [team, setTeam] = useState(null)
  const { name } = useParams()
  const teamName = decodeURIComponent(name)
  
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/public/teams/${teamName}`)
        if (!response.ok) {
          throw new Error('Failed to fetch team details')
        }
        const teamData = await response.json()

        // Fetch details for each member
        const memberPromises = (teamData.members || []).map(async (memberId) => {
          try {
            // Assuming endpoint for fetching public user details
            const userResponse = await fetch(`http://localhost:8000/api/users/${memberId}`)
            if (!userResponse.ok) return null
            const userData = await userResponse.json()
            
            return {
              id: memberId,
              name: userData.name || 'Unknown Member',
              role: memberId === teamData.captain ? 'Captain' : 'Paddler',
              amountRaised: Number(userData.amountraised) || 0
            }
          } catch (err) {
            console.error(`Failed to fetch member ${memberId}`, err)
            return null
          }
        })

        const membersData = (await Promise.all(memberPromises)).filter(m => m !== null)

        setTeam({
          name: teamData.name,
          division: teamData.division,
          description: teamData.description,
          raised: Number(teamData.totalRaised) || 0,
          goal: Number(teamData.donationGoal) || 10000,
          members: membersData,
        })
      } catch (error) {
        console.error('Error fetching team details:', error)
      }
    }
    
    fetchTeamDetails()
  }, [teamName])

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
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
                  {team.division} Division
                </span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">{team.name}</h1>
              <p className="text-slate-600 max-w-2xl text-lg">{team.description}</p>
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

          <div className="border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-pink-500" />
              Team Members
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.members.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
