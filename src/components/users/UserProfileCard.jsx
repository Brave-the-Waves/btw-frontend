import React from 'react'
import { Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UserProfileCard({ 
  userData, 
  showEmail = false, 
  showDonationId = true,
  pictureUrl
}) {
  const [copySuccess, setCopySuccess] = React.useState(false)

  const handleCopyDonationId = async () => {
    const id = userData.donationId
    if (!id) return
    try {
      await navigator.clipboard.writeText(id)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 1500)
    } catch (err) {
      console.error('Failed to copy donation ID', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{userData.name}</h2>
        {showEmail && <p className="text-slate-500">{userData.email}</p>}
        {userData.team && (
          <p className="text-pink-600 font-medium mt-1">Team: {userData.team.name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="font-medium text-slate-900 mb-2">Amount Raised</h3>
          <p className="text-3xl font-bold text-pink-600">
            ${userData.amountRaised?.toLocaleString() || '0'}
          </p>
        </div>
        {showDonationId && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-medium text-slate-900 mb-2">Donation ID</h3>
            <div className="flex items-center gap-3">
              <p className="text-lg font-mono text-slate-600 bg-white px-3 py-1 rounded border border-slate-200 inline-block">
                {userData.donationId || 'N/A'}
              </p>
              {userData.donationId && (
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
            <p className="text-xs text-slate-500 mt-2">Share this ID to get credit for donations!</p>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 className="font-medium text-slate-900 mb-2">About</h3>
        <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
          {userData.bio || "No bio yet."}
        </p>
      </div>
    </motion.div>
  )
}
