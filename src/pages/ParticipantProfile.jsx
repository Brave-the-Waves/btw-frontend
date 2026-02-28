import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useParams, useNavigate } from 'react-router-dom'
import UserProfileCard from '@/components/users/UserProfileCard'
import RecentDonations from '@/components/users/RecentDonations'
import Button from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { API_BASE_URL } from '@/config'

export default function ParticipantProfile() {
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
        const response = await fetch(`${API_BASE_URL}/api/participants/${id}`)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5">
        <motion.div className="flex flex-col items-center gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-slate-200 border-t-[#fc87a7] rounded-full"></motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 font-medium">Loading profile...</motion.p>
        </motion.div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5">
        <Navbar />
        <div className="pt-32 px-6 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 mx-auto">
            <ArrowLeft className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">User Not Found</h1>
          <p className="text-slate-600 mb-8">{error || 'This user does not exist.'}</p>
          <Button onClick={() => navigate(-1)} className="bg-[#fc87a7] text-white hover:shadow-lg hover:shadow-[#fc87a7]/30 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5">
      <Navbar />
      <div className="pt-32 px-6 max-w-3xl mx-auto pb-20">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white text-slate-600 hover:text-[#fc87a7] border-2 border-slate-200 hover:border-[#fc87a7]/30 rounded-lg font-medium transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-slate-900">User Profile</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-40 h-40 rounded-full border-4 border-[#fc87a7]/20 bg-gradient-to-br from-[#fc87a7]/10 to-[#fc87a7]/5 flex items-center justify-center text-[#fc87a7] font-bold text-5xl flex-shrink-0 overflow-hidden">
              {userData.picture
                ? <img src={userData.picture} alt={userData.name || 'User'} className="w-full h-full object-cover" />
                : (userData.name || '?').charAt(0).toUpperCase()
              }
            </div>
            
            <div className="flex-1 w-full">
              <UserProfileCard 
                userData={userData}
                showEmail={false}
                showDonationId={true}
              />
            </div>
          </div>
        </motion.div>
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
