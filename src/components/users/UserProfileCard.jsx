import React from 'react'
import { Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import DonateButton from './DonateButton'

export default function UserProfileCard({ 
  userData, 
  showEmail = false, 
  showDonationId = true,
  showDonateButton = true
}) {
  const [copySuccess, setCopySuccess] = React.useState(false)
  const navigate = useNavigate()

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
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{userData.name}</h2>
        {showEmail && <p className="text-slate-500">{userData.email}</p>}
        {userData.team && (
          <button
            onClick={() => navigate(`/teams/${userData.team.name}`)}
            className="text-[#fc87a7] font-semibold mt-1 hover:text-[#c14a75] transition-colors cursor-pointer text-sm"
          >
            Team: {userData.team.name}
          </button>
        )}
        {showDonateButton && userData.donationId && (
          <div className="mt-3">
            <DonateButton 
              donationId={userData.donationId} 
              userName={userData.name}
              size="sm"
              className="rounded-full"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#fc87a7]/5 to-white p-6 rounded-2xl border border-[#fc87a7]/20 shadow-sm">
          <h3 className="font-semibold text-[#fc87a7] mb-3 text-sm uppercase tracking-wide">Amount Raised</h3>
          <p className="text-3xl font-bold text-[#fc87a7]">
            ${userData.amountRaised?.toLocaleString() || '0'}
          </p>
        </div>
        {showDonationId && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Donation ID</h3>
            <div className="flex items-center gap-3">
              <p className="text-base font-mono text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-300 inline-block">
                {userData.donationId || 'N/A'}
              </p>
              {userData.donationId && (
                <button
                  type="button"
                  onClick={handleCopyDonationId}
                  aria-label="Copy donation ID"
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#fc87a7] transition-colors cursor-pointer"
                >
                  {copySuccess ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-3">Share this ID to get credit for donations!</p>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">About</h3>
        <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
          {userData.bio || "No bio yet."}
        </p>
      </div>
    </motion.div>
  )
}
