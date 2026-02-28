import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FileSignature, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function WaiverReminderBanner() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  const handleDismiss = () => setDismissed(true)

  const handleSignNow = () => {
    setDismissed(true)
    navigate('/profile')
  }

  const shouldShow =
    !isLoading &&
    isAuthenticated &&
    user?.isRegistered === true &&
    user?.hasSignedWaiver === false &&
    !dismissed

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between gap-4 px-5 py-3 bg-gradient-to-r from-[#fc87a7] to-[#c14a75] text-white shadow-lg"
        >
          <div className="flex items-center gap-3 min-w-0">
            <FileSignature className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium truncate">
              You're registered — don't forget to sign your waiver before race day!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSignNow}
              className="text-sm font-semibold px-4 py-1.5 bg-white text-[#c14a75] rounded-full hover:bg-white/90 transition-colors"
            >
              Sign Now
            </motion.button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss waiver reminder"
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
