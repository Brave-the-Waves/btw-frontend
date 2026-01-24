import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_BASE_URL } from '@/config'

export default function RecentDonations({ context, targetId, itemsPerPage = 5 }) {
  const [donations, setDonations] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [totalDonations, setTotalDonations] = useState(0)

  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true)
      try {
        let endpoint = ''
        if (context === 'user') {
          endpoint = `${API_BASE_URL}/api/donations/user/${targetId}`
        } else if (context === 'team') {
          endpoint = `${API_BASE_URL}/api/donations/teams/${targetId}`
        } else if (context === 'home') {
          endpoint = `${API_BASE_URL}/api/donations/recent`
        }

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        console.log('Fetch donations response:', response)
        if (!response.ok) throw new Error('Failed to fetch donations')
        
        const data = await response.json()
        
        // Backend returns { success: true, donations: [...] }
        const donationsArray = data.donations || []
        
        // Fetch user names for target users
        const donationsWithNames = await Promise.all(
          donationsArray.map(async (donation) => {
            try {
              const userResponse = await fetch(`${API_BASE_URL}/api/users/${donation.targetUser}`)
              if (userResponse.ok) {
                const userData = await userResponse.json()
                return { ...donation, targetUserName: userData.name }
              }
            } catch (err) {
              console.error('Failed to fetch user name:', err)
            }
            return { ...donation, targetUserName: 'Unknown User' }
          })
        )
        
        setDonations(donationsWithNames)
        setTotalDonations(donationsWithNames.length)
      } catch (error) {
        console.error('Error fetching donations:', error)
        setDonations([])
      } finally {
        setIsLoading(false)
      }
    }

    if (targetId || context === 'home') {
      fetchDonations()
    }
  }, [context, targetId])

  const totalPages = Math.ceil(totalDonations / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDonations = donations.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (donations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          Recent Donations
        </h3>
        <p className="text-slate-500 text-center py-8">No donations yet. Be the first to contribute!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          Recent Donations
        </h3>
        <span className="text-sm text-slate-500">
          {totalDonations} total donation{totalDonations !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {currentDonations.map((donation, index) => (
              <div
                key={`${donation._id || index}-${currentPage}`}
                className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-100 hover:border-pink-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900">
                        {donation.isAnonymous ? 'Anonymous' : donation.donorName || 'Anonymous'}
                      </p>
                      <span className="text-pink-600 font-bold">
                        ${donation.amount?.toLocaleString() || '0'}
                      </span>
                    </div>
                    {context !== 'user' && donation.targetUserName && (
                      <p className="text-xs text-slate-500 mb-1">
                        Supporting: {donation.targetUserName}
                      </p>
                    )}
                    {donation.message && (
                      <div className="flex items-start gap-2 mt-2">
                        <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600 italic">"{donation.message}"</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <span className="text-sm text-slate-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
