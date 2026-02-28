import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { API_BASE_URL } from '@/config'
import { motion } from 'framer-motion'
import { Sailboat, Building2, Users } from 'lucide-react'

export default function RegisterSelect() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5">
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Register: Choose a Category</h1>
          <p className="text-slate-600 text-center mb-8 max-w-lg mx-auto">
            Select the category that best fits you. Pricing and requirements may differ per category.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Community Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-8 border border-slate-200 bg-white shadow-sm flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Sailboat className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Community</p>
                <h3 className="text-lg font-bold text-slate-900">Community Division</h3>
              </div>
            <p className="text-slate-500 text-sm mb-6">
            The Community Division is open to everyone and brings together friends, students, families and community groups who want to paddle for a meaningful cause. No experience required!<br/><br/>
            </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/register/details?student=true')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/30 cursor-pointer"
                >
                  I am a student
                </button>

                <button
                  onClick={() => navigate('/register/details?student=false')}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-lg border border-emerald-200 font-medium transition-all hover:shadow-sm cursor-pointer"
                >
                  I am not a student
                </button>

                <p className="text-xs text-slate-500 mt-2">
                  Proof of student status will be required during the event.
                </p>
              </div>
            </motion.div>

            {/* Corporate Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-8 border border-slate-200 bg-white shadow-sm flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Corporate</p>
                <h3 className="text-lg font-bold text-slate-900">Corporate Division</h3>
              </div>
            <p className="text-slate-500 text-sm mb-6">
              The Corporate Division highlights organizations that give back to their community through an ardent commitment to an important cause.<br/> <br/> 
            </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/register/corporate')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer"
                >
                  Corporate Registration
                </button>
              </div>
            </motion.div>

            {/* Sports Card */}
            <SportsCard />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function SportsCard() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth()
  const [showInput, setShowInput] = useState(false)
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState(null)

  const handleVerify = async () => {
    setError(null)
    if (!code.trim()) {
      setError('Please enter your selection code.')
      return
    }
    if (isLoading) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setIsVerifying(true)
    try {
      const token = await getAccessTokenSilently()
      const res = await fetch(`${API_BASE_URL}/api/registrations/confirm-selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code: code.trim() })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Code verification failed')
      }

      // Parse successful response which should include teamName
      const data = await res.json().catch(() => ({}))
      const teamName = data?.teamName || null

      // Mark that a registration flow completed so the success page will render.
      // The payment flow already sets this flag; selection-code flow needs to set it too.
      try {
        sessionStorage.setItem('registration_payment_initiated', 'true')
        // Mark that this success came from a selection-code (no payment) flow
        sessionStorage.setItem('registration_via_selection', 'true')
        if (teamName) {
          sessionStorage.setItem('registration_team_name', teamName)
        }
      } catch (e) {
        console.warn('Unable to set sessionStorage flag for registration success', e)
      }

      navigate('/registration=success')
    } catch (err) {
      console.error('Selection verify error', err)
      setError(err.message || 'Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl p-8 border border-slate-200 bg-white shadow-sm flex flex-col gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
        <Users className="w-5 h-5 text-purple-600" />
      </div>
      <div>
        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Sports</p>
        <h3 className="text-lg font-bold text-slate-900">Sports Division</h3>
      </div>
      <p className="text-slate-500 text-sm mb-6">The sports division is for those who want to particpate competitely while supporting a good cause. For those who train with DBZ, DOD, CDBC or CsBUM, your captains will contact you if you have been selected to partake in this competitive roster.</p>

      {!showInput ? (
        <div className="flex flex-col gap-3">
          <button onClick={() => setShowInput(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/30 cursor-pointer">I have been selected!</button>
          <p className="text-xs text-slate-500 mt-2">You will be asked to provide a selection code issued by your captain.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter selection code" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
          {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</div>}
          <div className="flex gap-3">
            <button onClick={handleVerify} disabled={isVerifying} className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/30 cursor-pointer disabled:opacity-50">{isVerifying ? 'Verifying...' : 'Confirm'}</button>
            <button onClick={() => { setShowInput(false); setCode(''); setError(null) }} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-all cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
