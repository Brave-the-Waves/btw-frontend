import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import DonateButton from '../users/DonateButton'
import { LOCAL_PORT } from '@/config'

export default function DisplayMembers({ team, members, setMembers, onMemberChange, isEditing }) {
    const { user, getAccessTokenSilently } = useAuth()
    const [confirmKickId, setConfirmKickId] = useState(null)
    const navigate = useNavigate()

    const currentUserId = user?._id || user?.id

    return (
        <div className="border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-pink-500" />
                Team Members
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(members || []).map((member) => {
                const isCurrentUser = currentUserId === member._id
                const isCaptain = currentUserId && team.captain && currentUserId === team.captain
                const isMemberCaptain = team.captain === member._id
                return (
                <div key={member._id} className={`p-4 rounded-xl transition-colors ${isCurrentUser ? 'bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div 
                        className="flex items-center gap-4 flex-1 cursor-pointer"
                        onClick={() => navigate(`/profile/${member._id}`)}
                      >
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                            {member.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{member.name}</p>
                            <p className="text-xs text-slate-500">{isMemberCaptain ? 'Captain' : 'Paddler'}</p>
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
                                const res = await fetch(`${LOCAL_PORT}/api/teams/${team.id}/members/${member.id}`, {
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
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
                            >
                            Confirm
                            </button>
                            <button onClick={() => setConfirmKickId(null)} className="px-3 py-1 rounded-md border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                        </>
                        ) : (
                        <button onClick={() => setConfirmKickId(member.id)} className="bg-red-50 text-red-600 px-2 py-0.5 rounded-lg text-sm border border-red-200 hover:bg-red-100 transition-colors">Kick</button>
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