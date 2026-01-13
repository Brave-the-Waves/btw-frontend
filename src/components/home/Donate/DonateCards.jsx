import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Shield, Trophy, Users, Waves, DollarSign, Check, User, MessageSquare } from 'lucide-react'
import Button from '@/components/ui/button'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Checkbox from './CheckBox'

export default function DonateCards({ preFillDonationId, preFillName }) {
  const [amount, setAmount] = useState(25)
  const [isCustom, setIsCustom] = useState(false)
  const [donationID, setDonationID] = useState(preFillDonationId || '')
  const [isLoading, setIsLoading] = useState(false)
  const [donationError, setDonationError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const { loginWithRedirect, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const textareaRef = useRef(null)
  const maxMessageChars = 100

  // Update donationID when preFillDonationId changes
  React.useEffect(() => {
    if (preFillDonationId) {
      setDonationID(preFillDonationId)
    }
  }, [preFillDonationId])

  const handleMessageChange = (e) => {
    const val = e.target.value.slice(0, maxMessageChars)
    setMessage(val)
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${ta.scrollHeight}px`
    }
  }
  const handleDonate = async () => {
    setIsLoading(true)
    setDonationError('')
    setIsShaking(false)

    try {
      if (donationID) {
        const resUser = await fetch('http://localhost:8000/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (!resUser.ok) {
            throw new Error('Unable to verify Paddler ID')
        }

        const userData = await resUser.json()
        console.log('Fetched user data for donation ID verification:', userData)
        // Check if any user has this donationId (case-insensitive and trimmed)
        const isValid = userData.some(user => 
            user.donationId && user.donationId.trim() === donationID.trim() 
        )

        console.log('Paddler ID valid:', isValid)
        
        if (!isValid) {
            throw new Error('Invalid Paddler ID')
        }
      }

      // Call backend to create checkout session
      const response = await fetch('http://localhost:8000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: amount,
          currency: 'CAD',
          donationId: donationID,
          message: message,
          isAnonymous: isAnonymous
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const session = await response.json()

      // Redirect to Stripe Checkout URL provided by backend
      if (session.url) {
        if (donationID) {
            setIsSuccess(true)
            setTimeout(() => {
                window.location.href = session.url
            }, 1500)
        } else {
            window.location.href = session.url
        }
      } else {
        console.error('No checkout URL provided in session')
      }
    } catch (error) {
      console.error('Error:', error)
      if (donationID) {
          setDonationError(error.message)
          setIsShaking(true)
          setTimeout(() => setIsShaking(false), 500)
      }
    } finally {
      if (!donationID || !isSuccess) {
          setIsLoading(false)
      }
    }
  }

  const presetAmounts = [5, 10, 25, 50, 100]

  return (
    <div className="grid md:grid-cols-5 gap-8 max-w-8xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative group md:col-span-3">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-pink-100/50 border border-pink-100 h-full flex flex-col">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Support the Cause</h3>
          <p className="text-slate-600 mb-6 leading-relaxed">Your donation directly supports women's health programs, survivor resources, and community education initiatives. Every dollar makes a difference.</p>

          {/* Donation Amount Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">Select Amount</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => { setAmount(preset); setIsCustom(false); }}
                  className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${
                    amount === preset && !isCustom
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-slate-400" />
              </div>
              <input
                min="1"
                value={amount}
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                  setIsCustom(true);
                }}
                onFocus={() => setIsCustom(true)}
                className={`block w-full pl-9 pr-12 py-3 sm:text-sm rounded-xl border-slate-200 focus:ring-pink-500 focus:border-pink-500 ${isCustom ? 'border-pink-500 ring-1 ring-pink-500' : 'border'}`}
                placeholder="Custom amount"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">CAD</span>
              </div>
            </div>

            {/* Paddler ID Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Paddler ID (Optional)</label>
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
                          <Check className="w-5 h-5 text-green-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="user"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                        >
                          <User className="w-5 h-5 text-slate-400" />
                        </motion.div>
                      )}
                  </AnimatePresence>
                  <motion.input
                    animate={
                        isShaking ? { x: [-10, 10, -10, 10, 0] } : 
                        isSuccess ? { 
                          borderColor: '#22c55e', 
                          backgroundColor: '#f0fdf4',
                          boxShadow: '0 0 0 2px #bbf7d0'
                        } : {}
                    }
                    transition={{ duration: 0.4 }}
                    type="text"
                    value={donationID}
                    onChange={(e) => {
                        setDonationID(e.target.value)
                        setDonationError('')
                    }}
                    disabled={isSuccess}
                    className={`block w-full pl-10 pr-4 py-3 sm:text-sm rounded-xl border focus:ring-2 outline-none transition-colors duration-300 ${
                        donationError 
                          ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                          : 'border-slate-200 focus:ring-pink-500 focus:border-pink-500'
                    }`}
                    placeholder="Enter Paddler ID"
                  />
              </div>
              {donationError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 ml-1"
                    >
                      {donationError}
                    </motion.p>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Message (Optional)</label>
              <div className="relative">
                  <div className="absolute top-3 left-3">
                      <MessageSquare className="w-5 h-5 text-slate-400" /> 
                  </div>
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    maxLength={maxMessageChars}
                    className="block w-full pl-10 pr-4 py-3 sm:text-sm rounded-xl border border-slate-200 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none overflow-hidden"
                    placeholder="Leave a message..."
                    value={message}
                    onChange={handleMessageChange}
                  />
              </div>
            </div>
            <div className="text-sm text-slate-500 mt-1 text-right">
                {message.length}/{maxMessageChars} characters
            </div>
            <Checkbox label="Make my donation anonymous" isChecked={isAnonymous} setIsChecked={setIsAnonymous}/>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-slate-600"><Shield className="w-5 h-5 text-pink-500" /><span>100% secure payment</span></li>
            <li className="flex items-center gap-3 text-slate-600"><Trophy className="w-5 h-5 text-pink-500" /><span>Tax-deductible contributions</span></li>
            <li className="flex items-center gap-3 text-slate-600"><Heart className="w-5 h-5 text-pink-500" /><span>Support survivor programs</span></li>
          </ul>

          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl py-3 text-lg shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] text-center mt-auto disabled:opacity-70 disabled:cursor-not-allowed" 
            onClick={handleDonate}
            disabled={isLoading || amount <= 0}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" />
                Donate ${amount}
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative group md:col-span-2">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 shadow-xl h-full text-white flex flex-col">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Register Your Team</h3>
          <p className="text-slate-300 mb-6 leading-relaxed">Assemble your crew and join the race! Whether corporate teams, community groups, or survivor squads – there's a division for everyone.</p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-slate-300"><Waves className="w-5 h-5 text-pink-400" /><span>Multiple team divisions available</span></li>
            <li className="flex items-center gap-3 text-slate-300"><Trophy className="w-5 h-5 text-pink-400" /><span>Prizes for top fundraising teams</span></li>
            <li className="flex items-center gap-3 text-slate-300"><Users className="w-5 h-5 text-pink-400" /><span>Training sessions provided</span></li>
          </ul>

          <Button 
            size="lg" 
            variant="outline" 
            className="w-full border-2 border-white/30 bg-white/10 backdrop-blur text-white hover:bg-white/20 rounded-xl py-3 text-lg transition-all hover:scale-[1.02] mt-auto" 
            onClick={() => {
              if (isAuthenticated) {
                navigate('/teams')
              } else {
                loginWithRedirect({
                  appState: { returnTo: '/teams' }
                })
              }
            }}
          >
            <Users className="w-5 h-5 mr-2" />
            {isAuthenticated ? 'Join or Create a Team' : 'Get Started'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}