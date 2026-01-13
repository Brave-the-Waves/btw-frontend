import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Trophy, Target, User, Copy, Check } from 'lucide-react'
import DonateButton from '@/components/users/DonateButton'

export default function ParticipantOverlay({ participantId, onClose }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${participantId}`)
        if (!response.ok) {
            throw new Error('Failed to fetch participant details')
        }
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Error fetching participant details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (participantId) {
      fetchParticipantDetails() 
    }
  }, [])

  const handleCopyDonationId = async () => {
    const id = profile?.donationId
    if (!id) return
    try {
      await navigator.clipboard.writeText(id)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 1500)
    } catch (err) {
      console.error('Failed to copy donation ID', err)
    }
  }

  if (!participantId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Paddler Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading profile...</div>
        ) : profile ? (
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                 {profile.picture ? (
                    <img src={profile.picture} alt={profile.name} className="w-32 h-32 rounded-full border-4 border-pink-100 object-cover" />
                 ) : (
                    <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-300 border-4 border-slate-50">
                        {profile.name?.charAt(0)}
                    </div>
                 )}
              </div>
              
              <div className="flex-1 w-full space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                  <DonateButton 
                    donationId={profile.donationId} 
                    userName={profile.name}
                    size="sm"
                    className="rounded-full"
                  />
                  {profile.team && (
                    <p className="text-pink-600 font-medium mt-1">Team: {profile.team.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-slate-600">
                        <Trophy className="w-4 h-4" />
                        <h3 className="font-medium text-sm">Amount Raised</h3>
                    </div>
                    <p className="text-2xl font-bold text-pink-600">
                      ${profile.amountRaised?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-slate-600">
                        <Target className="w-4 h-4" />
                        <h3 className="font-medium text-sm">Donation ID</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 inline-block">
                        {profile.donationId || 'N/A'}
                      </p>
                      {profile.donationId && (
                        <button
                          type="button"
                          onClick={handleCopyDonationId}
                          aria-label="Copy donation ID"
                          className="text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          {copySuccess ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <h3 className="font-medium text-slate-900 mb-2">About Me</h3>
                  <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {profile.bio || "This paddler hasn't written a bio yet."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
            <div className="p-12 text-center text-slate-500">Failed to load profile.</div>
        )}
      </motion.div>
    </div>
  )
}
