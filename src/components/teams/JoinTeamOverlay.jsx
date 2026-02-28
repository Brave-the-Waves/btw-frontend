import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Check } from 'lucide-react'
import Button from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { API_BASE_URL } from '@/config'

export default function JoinTeamOverlay({ onClose, onSuccess, teamName }) {
  const { getAccessTokenSilently } = useAuth()
  const [inviteCode, setInviteCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setJoinError('')
    setIsShaking(false)
    setIsLoading(true)

    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${API_BASE_URL}/api/registrations/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ inviteCode: inviteCode.trim() })
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Invalid invite code')
      }
      const joinedData = await response.json().catch(() => ({}))
      
      setIsSuccess(true)
      setTimeout(async () => {
        if (onSuccess) await onSuccess(joinedData)
        onClose()
        setInviteCode('')
        setIsSuccess(false)
      }, 1500)
    } catch (error) {
      console.error(error)
      setJoinError(error.message)
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    } finally {
      setIsLoading(false)
    }
  }

  const displayTitle = teamName ? `Join ${teamName}` : 'Join a Team'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 max-w-md w-full shadow-2xl z-10 border border-slate-100"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{displayTitle}</h2>
        <p className="text-slate-600 text-base mb-8">Enter the invite code provided by your team captain.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Invite Code</label>
            <div className="relative">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                  >
                    <Check className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="lock"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                  >
                    <Lock className="w-5 h-5 text-[#fc87a7]" />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.input 
                animate={
                  isShaking ? { x: [-10, 10, -10, 10, 0] } : 
                  isSuccess ? { 
                    borderColor: '#10b981', 
                    backgroundColor: '#f0fdf4',
                    boxShadow: '0 0 0 2px #d1fae5'
                  } : {}
                }
                transition={{ duration: 0.33 }}
                type="text" 
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value)
                  setJoinError('')
                }}
                disabled={isSuccess || isLoading}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:ring-2 outline-none uppercase tracking-widest transition-all duration-300 font-semibold ${
                  joinError 
                    ? 'border-red-400 focus:ring-red-200 bg-red-50 focus:border-red-400' 
                    : 'border-slate-200 focus:ring-[#fc87a7] focus:border-[#fc87a7]'
                }`}
                placeholder="ABC123"
                required
              />
            </div>
            {joinError && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 ml-1 font-medium"
              >
                {joinError}
              </motion.p>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="button" 
              className="flex-1 border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 rounded-lg font-semibold transition-all cursor-pointer" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-[#fc87a7] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#fc87a7]/30 transition-all cursor-pointer"
              disabled={isLoading || isSuccess}
            >
              {isLoading ? 'Joining...' : 'Join Team'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
