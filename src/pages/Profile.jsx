import React, { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import Button from '@/components/ui/button'
import { AlertCircle, Camera, Plus, Copy, Check, FileText, ShieldCheck, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import RecentDonations from '@/components/users/RecentDonations'
import DonateButton from '@/components/users/DonateButton'
import { API_BASE_URL } from '@/config'
import { storage } from '@/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import WaiverOverlay from '@/components/users/WaiverOverlay'
import { Toaster } from 'sonner'

export default function Profile() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, isPaymentLoading, logout, refreshUser, sendPasswordReset } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    isRegistered: false,
    amountRaised: 0,
    donationId: '',
    team: null
  })
  const [userId, setUserId] = useState(null)
  const [editFormData, setEditFormData] = useState({ name: '', bio: '' })
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('donations')
  const [copySuccess, setCopySuccess] = useState(false)
  const [showWaiverOverlay, setShowWaiverOverlay] = useState(false)
  const [waiverStatus, setWaiverStatus] = useState(null)
  const fileInputRef = useRef(null)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMsg, setResetMsg] = useState('')
  const [resetError, setResetError] = useState('')
  const MAX_NAME_LENGTH = 30
  const MAX_BIO_LENGTH = 300

  useEffect(() => {
    if (user) {
      setUserId(user._id)
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        isRegistered: user.isRegistered || false,
        amountRaised: user.amountRaised || 0,
        donationId: user.donationId || '',
        team: user.team || null
      })
      setEditFormData({ name: user.name || '', bio: user.bio || '' })
      setIsProfileLoading(false)
    }
  }, [user])

  // Fetch waiver status when registration is confirmed
  useEffect(() => {
    if (!user?.isRegistered || !user?._id) return
    let cancelled = false
    const fetchWaiverStatus = async () => {
      try {
        const token = await getAccessTokenSilently()
        const res = await fetch(`${API_BASE_URL}/api/waivers/${user._id}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok && !cancelled) {
          const data = await res.json()
          setWaiverStatus(data)
        }
      } catch (err) {
        console.error('Failed to fetch waiver status:', err)
      }
    }
    fetchWaiverStatus()
    return () => { cancelled = true }
  }, [user?._id, user?.isRegistered])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!isAuthenticated) return
    setShowImageMenu(false)
    setIsUploading(true)
    try {
      const storageRef = ref(storage, `profiles/${user._id}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      const token = await getAccessTokenSilently()
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ picture: downloadURL })
      })
      if (!res.ok) throw new Error('Failed to save profile picture')
      await refreshUser()
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Sanitize name and bio before sending
      const safeName = (editFormData.name || '').trim().replace(/[^\w\s\-'.]/g, '').slice(0, MAX_NAME_LENGTH)
      const safeBio = (editFormData.bio || '').slice(0, MAX_BIO_LENGTH).replace(/<[^>]*>/g, '')

      const token = await getAccessTokenSilently()
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: safeName, bio: safeBio })
      })
      if (!res.ok) throw new Error('Failed to update profile')
      await refreshUser()
      setIsEditing(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCopyDonationId = async () => {
    if (!formData.donationId) return
    try {
      await navigator.clipboard.writeText(formData.donationId)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 1500)
    } catch (err) {
      console.error('Failed to copy donation ID', err)
    }
  }

  if (isLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5">
        <div className="flex flex-col items-center gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-slate-200 border-t-[#fc87a7] rounded-full"></motion.div>
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5 flex items-center justify-center">
        <Navbar />
        <p className="text-slate-600">Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5">
      <Toaster position="top-center" richColors />
      <Navbar />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="pt-36 px-6 max-w-6xl mx-auto pb-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* ── LEFT: Profile Card (1/4) ── */}
            <div className="w-full md:w-1/3 bg-gradient-to-br from-white to-slate-50 rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">

              {/* Avatar */}
              <div className="relative">
                <div
                  onClick={() => isAuthenticated && setShowImageMenu(!showImageMenu)}
                  className={`w-28 h-28 rounded-full border-4 border-[#fc87a7]/20 bg-gradient-to-br from-[#fc87a7]/10 to-[#fc87a7]/5 flex items-center justify-center overflow-hidden relative ${isAuthenticated ? 'cursor-pointer group' : 'cursor-default'}`}
                >
                  {isUploading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-7 h-7 border-4 border-slate-200 border-t-[#fc87a7] rounded-full"></motion.div>
                  ) : user.picture ? (
                    <>
                      <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-7 h-7 text-white" />
                      </div>
                    </>
                  ) : (
                    <Plus className="w-9 h-9 text-pink-500" />
                  )}
                </div>

                {showImageMenu && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10">
                    <button
                      type="button"
                      onClick={() => { setShowImageMenu(false); fileInputRef.current?.click() }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {user.picture ? 'Edit Image' : 'Add Image'}
                    </button>
                  </div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              {/* Registration status */}
              {formData.isRegistered ? (
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  ✓ Registered
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                  Not Registered
                </span>
              )}

              {/* Waiver status badge */}
              {formData.isRegistered && waiverStatus?.exists && (
                waiverStatus.completed ? (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1.5 border border-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Waiver Signed
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 flex items-center gap-1.5 border border-orange-200">
                    <FileText className="w-3.5 h-3.5" />
                    Waiver Pending
                  </span>
                )
              )}

              {/* Info: view mode */}
              {!isEditing ? (
                <div className="w-full space-y-2 text-sm">
                  <small>Name</small>
                  <p className="font-semibold text-slate-900 text-base border-b border-slate-200 pb-1">{formData.name || '—'}</p>
                  <small>Email</small>
                  <p className="text-slate-500 border-b border-slate-200 pb-1">{formData.email || '—'}</p>
                  <small>Bio</small>
                  <p className="text-slate-500 border-b border-slate-200 pb-1 italic min-h-[1.5rem]">
                    {formData.bio || 'No bio yet'}
                  </p>
                  {formData.team && (
                    <div className="mt-3 w-full bg-gradient-to-br from-[#fc87a7]/10 to-[#fc87a7]/5 border border-[#fc87a7]/20 rounded-2xl p-4 hover:border-[#fc87a7]/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Team</p>
                          <button
                            onClick={() => navigate(`/event/${formData.team.event}/teams/${formData.team.name}`)}
                            className="mt-1 text-lg font-bold text-[#fc87a7] hover:text-[#c14a75] transition-colors"
                          >
                            {formData.team.name}
                          </button>
                          {formData.team.event && (
                            <p className="text-sm text-slate-500 mt-1">Event: {formData.team.event}</p>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => navigate(`/event/${formData.team.event}/teams/${formData.team.name}`)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-[#fc87a7] text-white rounded-lg hover:bg-[#c14a75] font-semibold transition-all hover:shadow-lg hover:shadow-[#fc87a7]/30"
                          >
                            View Team
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Edit form */
                <form onSubmit={handleSubmit} className="w-full space-y-3 text-left">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => {
                        // Allow letters, numbers, spaces, hyphen, apostrophe, and periods
                        const cleaned = e.target.value.replace(/[^\w\s\-'.]/g, '').slice(0, MAX_NAME_LENGTH)
                        setEditFormData({ ...editFormData, name: cleaned })
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-1">{editFormData.name.length}/{MAX_NAME_LENGTH} characters</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Bio</label>
                    <textarea
                      value={editFormData.bio}
                      onChange={(e) => {
                        // Strip HTML tags and limit length
                        const cleaned = e.target.value.replace(/<[^>]*>/g, '').slice(0, MAX_BIO_LENGTH)
                        setEditFormData({ ...editFormData, bio: cleaned })
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 outline-none h-24 resize-none text-sm"
                      placeholder="Tell us why you paddle..."
                    />
                    <p className="text-xs text-slate-400 mt-1">{editFormData.bio.length}/{MAX_BIO_LENGTH} characters</p>
                  </div>
                  <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 text-sm cursor-pointer">
                    Save Changes
                  </Button>

                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/change-password')}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm hover:bg-slate-50"
                    >
                      Change password
                    </button>
                  </div>
                </form>
              )}

              {/* Action buttons */}
              <div className="w-full flex flex-col gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="w-full text-sm cursor-pointer border-2 border-slate-200 bg-white text-slate-600 hover:border-[#fc87a7]/30 hover:bg-slate-50 rounded-lg font-medium transition-all">
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
                {formData.isRegistered && waiverStatus?.exists && !waiverStatus?.completed && (
                  <Button
                    onClick={() => setShowWaiverOverlay(true)}
                    className="w-full text-sm bg-[#fc87a7] text-white hover:bg-[#c14a75] rounded-lg flex items-center justify-center gap-1.5 font-semibold transition-all hover:shadow-lg hover:shadow-[#fc87a7]/30"
                  >
                    <FileText className="w-4 h-4" />
                    Sign Waiver
                  </Button>
                )}
                <button
                  onClick={() => logout()}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#fc87a7] hover:bg-[#c14a75] text-white rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow-lg hover:shadow-[#fc87a7]/30 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>

            {/* ── RIGHT: Stats + Activity (3/4) ── */}
            <div className="flex-1 flex flex-col gap-6">

              {!formData.isRegistered ? (
                /* Unregistered prompt */
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      To become an event participant and join a team, you must register by paying the registration fee.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/register')}
                    disabled={isPaymentLoading}
                    className="bg-[#fc87a7] text-white hover:bg-[#c14a75] rounded-lg w-full sm:w-auto font-semibold transition-all hover:shadow-lg hover:shadow-[#fc87a7]/30 cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {isPaymentLoading ? 'Processing...' : 'Pay Registration Fee'}
                  </Button>
                </div>
              ) : (
                <>
                  {/* Top 1/4 — Stats boxes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <p className="text-3xl font-bold bg-gradient-to-r from-[#fc87a7] to-[#c14a75] bg-clip-text text-transparent">
                        {formData.amountRaised?.toLocaleString() || '0'}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 mt-1">Amount Raised</p>
                      {formData.donationId && (
                        <div className="mt-3">
                          <DonateButton donationId={formData.donationId} userName={formData.name} size="sm" className="rounded-full" />
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Donation ID</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-mono text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 font-bold">
                          {formData.donationId || 'N/A'}
                        </p>
                        {formData.donationId && (
                          <button
                            type="button"
                            onClick={handleCopyDonationId}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom 3/4 — Tabbed activity */}
                  <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-sm border border-slate-100 flex flex-col flex-1 hover:shadow-md transition-shadow">
                    {/* Tab bar */}
                    <div className="flex border-b border-slate-100 px-6 pt-4">
                      {['donations', 'contributions'].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className="relative mr-8 pb-3 text-sm font-semibold capitalize transition-colors"
                          style={{ color: activeTab === tab ? '#fc87a7' : '#94a3b8' }}
                        >
                          {tab === 'donations' ? 'Donations Received' : 'My Contributions'}
                          {activeTab === tab && (
                            <motion.div
                              layoutId="tab-underline"
                              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#fc87a7]"
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Tab content */}
                    <div className="p-4">
                      {activeTab === 'donations' && userId && (
                        <RecentDonations context="user" targetId={userId} itemsPerPage={5} title="" />
                      )}
                      {activeTab === 'contributions' && userId && (
                        <RecentDonations context="made" targetId={userId} itemsPerPage={5} title="" />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {showWaiverOverlay && userId && (
        <WaiverOverlay
          userId={userId}
          getToken={getAccessTokenSilently}
          userEmail={formData.email}
          onClose={() => setShowWaiverOverlay(false)}
          onSigned={() => {
            setWaiverStatus((prev) => ({
              ...prev,
              completed: true,
              signedAt: new Date().toISOString(),
            }))
            setShowWaiverOverlay(false)
          }}
        />
      )}
    </div>
  )
}

