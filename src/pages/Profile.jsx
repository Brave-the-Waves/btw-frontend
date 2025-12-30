import React, { useEffect,  useState } from 'react'
import Navbar from '@/components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import Button from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Profile() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, initiateRegistrationPayment, isPaymentLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    hasPaid: false,
    amountRaised: 0,
    donationId: '',
    team: null
  })
  const [editFormData, setEditFormData] = useState({
    name: '',
    bio: ''
  })

  // Initialize form data when user loads
  useEffect(() => {
    if (!user) return
    let mounted = true
    const loadProfile = async () => {
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
        console.log('Fetched profile:', profile)
        if (!mounted) return
        setFormData({
          name: profile.name || user.name || '',
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
          const initialData = { name: user.name || '', bio: '' }
          setFormData(prev => ({ ...prev, ...initialData }))
          setEditFormData(initialData)
        }
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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Please log in to view your profile.</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 px-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
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
                    <h2 className="text-2xl font-bold text-slate-900">{formData.name}</h2>
                    <p className="text-slate-500">{user.email}</p>
                    {formData.team && (
                      <p className="text-pink-600 font-medium mt-1">Team: {formData.team.name}</p>
                    )}
                  </div>
                  
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h3 className="font-medium text-slate-900 mb-2">Amount Raised</h3>
                      <p className="text-3xl font-bold text-pink-600">
                        ${formData.amountRaised?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h3 className="font-medium text-slate-900 mb-2">Donation ID</h3>
                      <p className="text-lg font-mono text-slate-600 bg-white px-3 py-1 rounded border border-slate-200 inline-block">
                        {formData.donationId || 'Generating...'}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">Share this ID to get credit for donations!</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="font-medium text-slate-900 mb-2">About Me</h3>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {formData.bio || "No bio yet. Click edit to add one!"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

