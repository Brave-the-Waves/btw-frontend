import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import DonateButton from '../users/DonateButton'
import { API_BASE_URL } from '@/config'

export default function DisplayMembers({ team, members, setMembers, onMemberChange, isEditing }) {
    const { user, getAccessTokenSilently } = useAuth()
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
                    </div>
                </div>
                )
                })}
            </div>
        </div>
    )
}