import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { API_BASE_URL } from '@/config'

export default function RegisterSelect() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Register: Choose a Category</h1>
        <p className="text-slate-600 text-center mb-8 max-w-lg mx-auto">
          Select the category that best fits you. Pricing and requirements may differ per category.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Community Card */}
          <div className="rounded-2xl p-8 border-2 bg-white shadow-sm">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path><path d="M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Community</h3>
            <p className="text-slate-500 text-sm mb-6">
            The Community Division is open to everyone and brings together friends, students, families and community groups who want to paddle for a meaningful cause. No experience required!<br/><br/>
            Students pay a discounted price!<br/><br/>
            Groups are limited to a maximum of 10 members. Teams of 20 to 30 paddlers will be formed by the Executive Rostering Committee to ensure balanced teams and fairness throughout the competition.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/register/details?student=true')}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl"
              >
                I am a student
              </button>

              <button
                onClick={() => navigate('/register/details?student=false')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl border"
              >
                I am not a student
              </button>

              <p className="text-xs text-slate-500 mt-2">
                Proof of student status will be required during the event.
              </p>
            </div>
          </div>

          {/* Corporate Card */}
          <div className="rounded-2xl p-8 border-2 bg-white shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18"></path><path d="M3 12h18"></path><path d="M3 17h18"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Corporate</h3>
            <p className="text-slate-500 text-sm mb-6">
              This division highlights organizations that give back to their community through an ardent commitment to an important cause.<br/> <br/> This entails a 600$ registration fee and a 1900$ mandatory donation with tax receipt. This includes the allocation of a full boat composed of 20 to 30 paddlers.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/register/corporate')}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl"
              >
                Corporate Registration
              </button>

              <p className="text-xs text-slate-500 mt-2">
                A minimum of 16 paddlers is required to take part in this category.
              </p>
            </div>
          </div>

          {/* Sports Card */}
          <SportsCard />
        </div>
      </div>
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

      navigate('/registration=success')
    } catch (err) {
      console.error('Selection verify error', err)
      setError(err.message || 'Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="rounded-2xl p-8 border-2 bg-white shadow-sm">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20l9-12H3z"></path></svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Sports</h3>
      <p className="text-slate-500 text-sm mb-6">Registration by Invitation. For those who train with DBZ, DOD, CDBC or CsBUM, your captains will contact you if you have been selected to partake in this competitive roster.</p>

      {!showInput ? (
        <div className="flex flex-col gap-3">
          <button onClick={() => setShowInput(true)} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl">I have been selected!</button>
          <p className="text-xs text-slate-500 mt-2">You'll be asked to provide a selection code issued by your captain.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter selection code" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex gap-3">
            <button onClick={handleVerify} disabled={isVerifying} className="px-4 py-3 bg-green-600 text-white rounded-xl">{isVerifying ? 'Verifying...' : 'Confirm'}</button>
            <button onClick={() => { setShowInput(false); setCode(''); setError(null) }} className="px-4 py-3 bg-slate-100 rounded-xl">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
