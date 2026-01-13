import React, { useEffect,  useState } from 'react'
import Navbar from '@/components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import Button from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { motion} from 'framer-motion'
import UserProfileCard from '@/components/users/UserProfileCard'
import RecentDonations from '@/components/users/RecentDonations'

export default function Profile() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, initiateRegistrationPayment, isPaymentLoading, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    hasPaid: false,
    amountRaised: 0,
    donationId: '',
    team: null
  })
  const [userId, setUserId] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    bio: ''
  })
  const [isProfileLoading, setIsProfileLoading] = useState(true)

  // Initialize form data when user loads
  useEffect(() => {
    if (!user) return
    let mounted = true
    const loadProfile = async () => {
      setIsProfileLoading(true)
      try {
        const token = await getAccessTokenSilently()
        const res = await fetch('http://localhost:8000/api/users/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error('Failed to load profile')
        const profile = await res.json()
        if (!mounted) return
        setUserId(profile._id)
        setFormData({
          name: profile.name || user.name || '',
          email: profile.email || user.email || '',
          bio: profile.bio || '',
          hasPaid: profile.hasPaid || false,
          amountRaised: profile.amountRaised || 0,
          donationId: profile.donationId || '',
          team: profile.team || null
        })
        setEditFormData({
          name: profile.name || user.name || '',
          bio: profile.bio || ''
        })
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        if (mounted) {
          const initialData = { name: user.name || '', bio: '', email: user.email || '' }
          setFormData(prev => ({ ...prev, ...initialData }))
          setEditFormData({ name: initialData.name, bio: initialData.bio })
        }
      } finally {
        if (mounted) setIsProfileLoading(false)
      }
    }
    loadProfile()
    return () => { mounted = false }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await getAccessTokenSilently()
      const res = await fetch('http://localhost:8000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      })
      console.log('Update response:', res)
      
      // Update local display data
      setFormData(prev => ({
        ...prev,
        name: editFormData.name,
        bio: editFormData.bio
      }))
      
      setIsEditing(false)
    } catch (error) {
      console.error(error)
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
      <motion.div
        initial={{ opacity: 0 , scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="pt-32 px-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => logout()} className="text-slate-600 hover:text-slate-900">
                  Log Out
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img src={user.picture} alt={user.name} className="w-32 h-32 rounded-full border-4 border-pink-100" />
              
              <div className="flex-1 w-full">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                      <input 
                        type="text" 
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                      <textarea 
                        value={editFormData.bio}
                        onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 outline-none h-32 resize-none"
                        placeholder="Tell us why you paddle..."
                      />
                    </div>
                    <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                      Save Changes
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                      <div>
                        {formData.hasPaid ? (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            Registration Completed
                          </span>
                        ) : (
                          <Button 
                            onClick={initiateRegistrationPayment} 
                            disabled={isPaymentLoading}
                            className="bg-pink-600 text-white hover:bg-pink-700 rounded-full"
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {isPaymentLoading ? 'Processing...' : 'Pay Registration Fee'}
                          </Button>
                        )}
                      </div>

                      <UserProfileCard 
                        userData={formData}
                        showEmail={true}
                        showDonationId={true}
                      />
                    </div>
                )}
              </div>
            </div>
          </div>

          {!isEditing && userId && (
            <div className="mt-6">
              <RecentDonations context="user" targetId={userId} itemsPerPage={10} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

