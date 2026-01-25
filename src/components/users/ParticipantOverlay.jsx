import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Trophy, Target, Copy, Check } from 'lucide-react'
import DonateButton from '@/components/users/DonateButton'
import RecentDonations from '@/components/users/RecentDonations'
import { API_BASE_URL } from '@/config'

export default function ParticipantOverlay({ participantId, onClose }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/participants/${participantId}`)
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="flex min-h-full items-center justify-center">
        <div className="flex w-full max-w-6xl gap-6 items-start flex-col lg:flex-row">
          <div className="w-full lg:flex-1 flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-none lg:max-h-[90vh] lg:overflow-y-auto"
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
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="flex-shrink-0">
                      {profile.picture ? (
                          <img src={profile.picture} alt={profile.name} className="w-32 h-32 rounded-full border-4 border-pink-100 object-cover mx-auto md:mx-0" />
                      ) : (
                          <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-300 border-4 border-slate-50 mx-auto md:mx-0">
                              {profile.name?.charAt(0)}
                          </div>
                      )}
                    </div>
                    
                    <div className="flex-1 w-full space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                        <div className="flex justify-center md:justify-start">
                          <DonateButton 
                            donationId={profile.donationId} 
                            userName={profile.name}
                            size="sm"
                            className="rounded-full"
                          />
                        </div>
                        {profile.team && (
                          <p className="text-pink-600 font-medium mt-1">Team: {profile.team.name}</p>
                        )}
                      </div>
    
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-slate-600">
                              <Trophy className="w-4 h-4" />
                              <h3 className="font-medium text-sm">Amount Raised</h3>
                          </div>
                          <p className="text-2xl font-bold text-pink-600">
                            ${profile.amountRaised?.toLocaleString() || '0'}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-slate-600">
                              <Target className="w-4 h-4" />
                              <h3 className="font-medium text-sm">Donation ID</h3>
                          </div>
                          <div className="flex items-center justify-center md:justify-start gap-3">
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
    
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-left">
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
          <div className="w-full lg:w-[350px] flex-shrink-0 pb-8 lg:pb-0">
            <div className="w-full max-h-none lg:max-h-[90vh] lg:overflow-y-auto rounded-2xl">
              <RecentDonations context="user" targetId={participantId} itemsPerPage={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}