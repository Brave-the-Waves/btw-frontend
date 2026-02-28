import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import DonateButton from '../users/DonateButton'
import { API_BASE_URL } from '@/config'

export default function DisplayMembers({ team, members, setMembers, onMemberChange, isEditing }) {
    const { user, getAccessTokenSilently } = useAuth()
    const [confirmKickId, setConfirmKickId] = useState(null)
    const navigate = useNavigate()

    const currentUserId = user?._id || user?.id

    return (
        <div className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fc87a7] to-[#c14a75] flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Team Members
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(members || []).map((member) => {
                const isCurrentUser = currentUserId === member._id
                const isCaptain = currentUserId && team.captain && currentUserId === team.captain
                const isMemberCaptain = team.captain === member._id
                return (
                <div key={member._id} className={`p-4 rounded-xl border transition-all duration-300 ${
                  isCurrentUser 
                    ? 'bg-gradient-to-br from-[#fc87a7]/10 to-[#fc87a7]/5 border-[#fc87a7]/20 hover:border-[#fc87a7]/40 hover:shadow-md hover:shadow-[#fc87a7]/10' 
                    : 'bg-gradient-to-br from-white to-slate-50 border-slate-100 hover:border-slate-300 hover:shadow-md'
                }`}>
                    <div className="flex items-center justify-between gap-4">
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer group"
                        onClick={() => navigate(`/profile/${member._id}`)}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fc87a7] to-[#c14a75] flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                            {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 group-hover:text-[#fc87a7] transition-colors">{member.name}</p>
                            <p className={`text-xs ${
                              isMemberCaptain 
                                ? 'text-[#fc87a7] font-medium' 
                                : 'text-slate-500'
                            }`}>{isMemberCaptain ? '👑 Captain' : 'Paddler'}</p>
                        </div>
                      </div>
                      {isCaptain && !isMemberCaptain && isEditing && (
                      <div className="flex items-center gap-2">
                          {confirmKickId === member._id ? (
                          <>
                            <button
                            onClick={async () => {
                                try {
                                const token = await getAccessTokenSilently()
                                const res = await fetch(`${API_BASE_URL}/api/teams/${team.id}/members/${member.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`
                                    }
                                })
                                if (!res.ok) throw new Error('Failed to remove member')
                                setMembers(prev => prev.filter(m => m.id !== member.id))
                                setConfirmKickId(null)
                                onMemberChange()
                                } catch (err) {
                                console.error(err)
                                setConfirmKickId(null)
                                }
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
                            >
                            Confirm
                            </button>
                            <button onClick={() => setConfirmKickId(null)} className="px-3 py-1 rounded-lg border-2 border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
                        </>
                        ) : (
                        <button onClick={() => setConfirmKickId(member.id)} className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-medium border border-red-200 hover:bg-red-100 hover:border-red-300 transition-colors cursor-pointer">Kick</button>
                        )}
                    </div>
                    )}
                    </div>
                </div>
                )
                })}
            </div>
        </div>
    )
}