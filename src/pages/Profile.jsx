import React, { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import Button from '@/components/ui/button'
import { AlertCircle, Camera, Plus, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import RecentDonations from '@/components/users/RecentDonations'
import DonateButton from '@/components/users/DonateButton'
import { API_BASE_URL } from '@/config'
import { storage } from '@/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Profile() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, isPaymentLoading, logout, refreshUser } = useAuth()
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
  const fileInputRef = useRef(null)

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
      const token = await getAccessTokenSilently()
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editFormData)
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Please log in to view your profile.</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="pt-28 px-6 max-w-6xl mx-auto pb-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* ── LEFT: Profile Card (1/4) ── */}
            <div className="w-full md:w-1/3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4">

              {/* Avatar */}
              <div className="relative">
                <div
                  onClick={() => isAuthenticated && setShowImageMenu(!showImageMenu)}
                  className={`w-28 h-28 rounded-full border-4 border-pink-100 bg-slate-100 flex items-center justify-center overflow-hidden relative ${isAuthenticated ? 'cursor-pointer group' : 'cursor-default'}`}
                >
                  {isUploading ? (
                    <div className="w-7 h-7 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
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
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Registered ✓
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  Not Registered
                </span>
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
                    <button
                      onClick={() => navigate(`/event/${formData.team.event}/teams/${formData.team.name}`)}
                      className="text-pink-600 font-medium hover:text-pink-700 transition-colors text-sm"
                    >
                      Team: {formData.team.name}
                    </button>
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
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Bio</label>
                    <textarea
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 outline-none h-24 resize-none text-sm"
                      placeholder="Tell us why you paddle..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 text-sm cursor-pointer">
                    Save Changes
                  </Button>
                </form>
              )}

              {/* Action buttons */}
              <div className="w-full flex flex-col gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="w-full text-sm cursor-pointer border border-slate-200 rounded-xl">
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
                <Button variant="outline" onClick={() => logout()} className="w-full text-sm text-slate-500 hover:text-slate-800">
                  Log Out
                </Button>
              </div>
            </div>

            {/* ── RIGHT: Stats + Activity (3/4) ── */}
            <div className="flex-1 flex flex-col gap-6">

              {!formData.isRegistered ? (
                /* Unregistered prompt */
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      To become an event participant and join a team, you must register by paying the registration fee.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/register')}
                    disabled={isPaymentLoading}
                    className="bg-pink-600 text-white hover:bg-pink-700 rounded-full w-full sm:w-auto"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {isPaymentLoading ? 'Processing...' : 'Pay Registration Fee'}
                  </Button>
                </div>
              ) : (
                <>
                  {/* Top 1/4 — Stats boxes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                      <p className="text-3xl font-bold text-[#f94f85]">
                        {formData.amountRaised?.toLocaleString() || '0'}
                      </p>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Amount Raised</p>
                      {formData.donationId && (
                        <div className="mt-3">
                          <DonateButton donationId={formData.donationId} userName={formData.name} size="sm" className="rounded-full" />
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Donation ID</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-mono text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
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
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col flex-1">
                    {/* Tab bar */}
                    <div className="flex border-b border-slate-100 px-6 pt-4">
                      {['donations', 'contributions'].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className="relative mr-8 pb-3 text-sm font-medium capitalize transition-colors"
                          style={{ color: activeTab === tab ? '#f94f85' : '#94a3b8' }}
                        >
                          {tab === 'donations' ? 'Donations Received' : 'My Contributions'}
                          {activeTab === tab && (
                            <motion.div
                              layoutId="tab-underline"
                              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#f94f85]"
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
    </div>
  )
}

