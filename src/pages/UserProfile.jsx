import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useParams, useNavigate } from 'react-router-dom'
import UserProfileCard from '@/components/users/UserProfileCard'
import RecentDonations from '@/components/users/RecentDonations'
import Button from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { API_BASE_URL } from '@/config'

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`)
        if (!response.ok) {
          throw new Error('Failed to load user profile')
        }
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        console.error('Error fetching user profile:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchUserProfile()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 px-6 max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">User Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'This user does not exist.'}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 px-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => navigate(-1)} variant="outline" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-full border-4 border-pink-100 bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-4xl">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 w-full">
              <UserProfileCard 
                userData={userData}
                showEmail={false}
                showDonationId={true}
              />
            </div>
          </div>
        </div>
        {
          console.log("Attempting to render RecentDonations for user:", id)
        }
        <div className="mt-6">
          <RecentDonations context="user" targetId={id} itemsPerPage={10} />
        </div>
      </div>
    </div>
  )
}
