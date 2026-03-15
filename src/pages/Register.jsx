import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Users, Check, AlertCircle, Loader2, Mail, Plus, Trash2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { API_BASE_URL } from '@/config'

export default function Register() {
    const [searchParams] = useSearchParams()
    const isStudent = searchParams.get('student') === 'true'
  const { isAuthenticated, isLoading, initiateRegistrationPayment, isPaymentLoading, getAccessTokenSilently } = useAuth()
  const navigate = useNavigate()
        const earlyIndividualPrice = isStudent ? 25 : 45
        const discountRate = 0.20
    const regularIndividualPrice = isStudent ? 30 : 50
        const individualPrice = regularIndividualPrice
        const discountedPerPerson = Math.round(individualPrice * (1 - discountRate))
    const regularDiscountedPerPerson = Math.round(regularIndividualPrice * (1 - discountRate))
    const lateIndividualPrice = isStudent ? 35 : 55
    const lateDiscountedPerPerson = Math.round(lateIndividualPrice * (1 - discountRate))
  
  const [selectedMode, setSelectedMode] = useState(null) // 'individual' | 'group'
  const [groupSize, setGroupSize] = useState(4)
  const [emails, setEmails] = useState(Array(4).fill(''))
  
  // Validation State
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const [invalidEmails, setInvalidEmails] = useState([])

  if (isLoading) return null

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleGroupSizeChange = (totalParticipants) => {
    const additionalEmails = totalParticipants - 1
    setGroupSize(additionalEmails)
    // Adjust emails array size while preserving existing inputs
    const newEmails = [...emails]
    if (additionalEmails > newEmails.length) {
      for (let i = newEmails.length; i < additionalEmails; i++) {
        newEmails.push('')
      }
    } else {
      newEmails.length = additionalEmails
    }
    setEmails(newEmails)
  }

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
    // Clear error for this field if it was invalid
    if (invalidEmails.includes(value) || invalidEmails.length > 0) {
        setInvalidEmails(prev => prev.filter(e => e !== value))
    }
  }

  const handleIndividualPayment = () => {
      initiateRegistrationPayment({ registrationType: 'individual', isStudent, amount: individualPrice })
  }

  const handleGroupPayment = async () => {
    // 1. input validation
    const filledEmails = emails.filter(e => e.trim() !== '')
    if (filledEmails.length !== groupSize) {
        setValidationError(`Please fill in all ${groupSize} email addresses.`)
        return
    }

    // Check for duplicates
    const uniqueEmails = new Set(filledEmails.map(e => e.toLowerCase()))
    if (uniqueEmails.size !== filledEmails.length) {
        setValidationError('Duplicate email addresses detected. Please ensure all emails are unique.')
        return
    }

    // Basic email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const malformedEmails = filledEmails.filter(e => !emailRegex.test(e))
    if (malformedEmails.length > 0) {
        setValidationError('Some email addresses are invalid formats.')
        return
    }

    setIsValidating(true)
    setValidationError(null)
    setInvalidEmails([])

    try {
        const token = await getAccessTokenSilently()
        // 2. Backend validation checking if users exist
        const res = await fetch(`${API_BASE_URL}/api/users/validate-emails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ emails: filledEmails })
        })

        const contentType = res.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
            throw new Error(`Server error (${res.status}). Please try again.`)
        }

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || `Server error (${res.status}). Please try again.`)
        }

        if (data.invalidEmails && data.invalidEmails.length > 0) {
            setInvalidEmails(data.invalidEmails)
            setValidationError('The following emails are not registered users yet. Please ensure they have accounts first.')
            setIsValidating(false)
            return
        }

        // 3. Initiate Logic
        const totalAmount = discountedPerPerson * (groupSize + 1)
        initiateRegistrationPayment({
            emails: filledEmails,
            registrationType: 'bundle',
            isStudent,
            amount: totalAmount,
            groupPricePer: discountedPerPerson
        })

    } catch (error) {
        console.error('Group validation error:', error)
        setValidationError(error.message || 'An error occurred during validation.')
    } finally {
        setIsValidating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#fc87a7]/5">
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="pt-24 xl:pt-32 pb-20 px-6 max-w-4xl mx-auto">
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Event Registration</h1>
                <p className="text-slate-600 text-center mb-4 max-w-lg mx-auto">
                    Choose how you would like to register. You can register just for yourself or bundle register for your whole team.
                </p>
                <p className="text-sm text-slate-500 text-center mb-8">
                    Regular registration is now open — Late registration opens <strong>April 1</strong>.
                </p>

        {/* Loading Overlay */}
        {(isPaymentLoading || isValidating) && (
             <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center flex-col">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-slate-200 border-t-[#fc87a7] rounded-full mb-4"></motion.div>
                <p className="text-white font-semibold text-lg">
                    {isValidating ? 'Validating emails...' : 'Processing payment...'}
                </p>
             </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Individual - Early (disabled) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl p-8 border transition-all relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200 text-slate-400 pointer-events-none opacity-80`}
            >
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <User className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Individual Registration<br/>(Early)</h3>
                <p className="text-slate-500 text-sm mb-6">
                    Early registration closed on <strong>March 15</strong>.
                </p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-slate-700">{'$'}{earlyIndividualPrice}</span>
                    <span className="text-slate-500 mb-1 font-medium">CAD</span>
                </div>
            </motion.div>

            {/* Individual - Regular */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setSelectedMode('individual')}
                className={`cursor-pointer rounded-2xl p-8 border transition-all relative overflow-hidden group ${
                    selectedMode === 'individual' 
                    ? 'border-[#fc87a7] bg-gradient-to-br from-white to-slate-50 shadow-xl scale-[1.02]' 
                    : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-[#fc87a7]/30 hover:shadow-lg'
                }`}
            >
                {selectedMode === 'individual' && (
                    <div className="absolute top-4 right-4 bg-[#fc87a7] text-white p-1.5 rounded-full shadow-lg">
                        <Check className="w-4 h-4" />
                    </div>
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-[#fc87a7] to-[#c14a75] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-[#fc87a7]/30">
                    <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Individual Registration (Regular)</h3>
                <p className="text-slate-500 text-sm mb-6">Regular registration is now open.</p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold bg-gradient-to-r from-[#fc87a7] to-[#c14a75] bg-clip-text text-transparent">{'$'}{regularIndividualPrice}</span>
                    <span className="text-slate-500 mb-1">CAD</span>
                </div>
            </motion.div>

            {/* Individual - Late (disabled) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-2xl p-8 border transition-all relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200 text-slate-400 pointer-events-none opacity-80`}
            >
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <User className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Individual Registration<br/>(Late)</h3>
                <p className="text-slate-500 text-sm mb-6">Late registration is not open yet. Opens: <strong>April 1</strong>.</p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-slate-700">{'$'}{lateIndividualPrice}</span>
                    <span className="text-slate-500 mb-1">CAD</span>
                </div>
            </motion.div>

            {/* Group - Early (disabled) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`rounded-2xl p-8 border transition-all relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200 text-slate-400 pointer-events-none opacity-80`}
            >
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Group Registration (Early)</h3>
                <p className="text-slate-500 text-sm mb-6">
                    Early registration closed on <strong>March 15</strong>.
                </p>
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-slate-400 line-through">{'$'}{earlyIndividualPrice} CAD</div>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold text-slate-700">{'$'}{Math.round(earlyIndividualPrice * (1 - discountRate))}</span>
                        <span className="text-slate-500 mb-1 font-medium">CAD / person</span>
                    </div>
                    <div className="text-xs text-slate-500">20% off</div>
                </div>
            </motion.div>

            {/* Group - Regular */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setSelectedMode('group')}
                className={`cursor-pointer rounded-2xl p-8 border transition-all relative overflow-hidden group ${
                    selectedMode === 'group' 
                    ? 'border-blue-500 bg-gradient-to-br from-white to-slate-50 shadow-xl scale-[1.02]' 
                    : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 hover:shadow-lg'
                }`}
            >
                 {selectedMode === 'group' && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
                        <Check className="w-4 h-4" />
                    </div>
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Group Registration (Regular)</h3>
                <p className="text-slate-500 text-sm mb-6">Regular registration is now open.</p>
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-slate-400 line-through">{'$'}{regularIndividualPrice} CAD</div>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{'$'}{regularDiscountedPerPerson}</span>
                        <span className="text-slate-500 mb-1">CAD / person</span>
                    </div>
                    <div className="text-xs text-blue-600 font-semibold">20% off</div>
                </div>
            </motion.div>

            {/* Group - Late (disabled) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`rounded-2xl p-8 border transition-all relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200 text-slate-400 pointer-events-none opacity-80`}
            >
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Group Registration (Late)</h3>
                <p className="text-slate-500 text-sm mb-6">Late registration is not open yet. Opens: <strong>April 1</strong>.</p>
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-slate-400 line-through">{'$'}{lateIndividualPrice} CAD</div>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold text-slate-700">{'$'}{lateDiscountedPerPerson}</span>
                        <span className="text-slate-500 mb-1">CAD / person</span>
                    </div>
                    <div className="text-xs text-slate-500">20% off</div>
                </div>
            </motion.div>
        </div>

        {/* Section Content */}
        <div className="max-w-xl mx-auto">
            <AnimatePresence mode="wait">
                {selectedMode === 'individual' && (
                    <motion.div
                        key="individual"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center"
                    >
                        <Button 
                            onClick={handleIndividualPayment}
                            disabled={isPaymentLoading}
                            className="w-full bg-[#fc87a7] hover:bg-[#c14a75] text-white py-6 text-lg rounded-lg shadow-lg shadow-[#fc87a7]/30 font-semibold transition-all hover:shadow-xl cursor-pointer"
                        >
                            Pay Registration Fee
                        </Button>
                    </motion.div>
                )}

                {selectedMode === 'group' && (
                    <motion.div
                        key="group"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Bundle Details</h3>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Number of Participants (including you)
                            </label>
                            <select 
                                value={groupSize + 1} 
                                onChange={(e) => handleGroupSizeChange(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                            >
                                {[5,6,7,8,9,10].map(n => (
                                    <option key={n} value={n}>{n} Participants</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4 mb-8">
                            <label className="block text-sm font-medium text-slate-700">
                                Participant Emails
                            </label>
                            {emails.map((email, index) => (
                                <div key={index} className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input 
                                        type="email" 
                                        placeholder={`Paddler ${index + 1} Email`}
                                        value={email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        className={`pl-9 focus:ring-2 focus:ring-blue-500 ${invalidEmails.includes(email) ? 'border-red-300 bg-red-50' : ''}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mb-6 p-3 rounded-lg border border-blue-100 bg-blue-50/50 text-sm text-blue-700">
                            All participants must have a Brave the Waves account before payment.
                        </div>

                        {validationError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-red-700">
                                    <p className="font-medium">Validation Error</p>
                                    <p>{validationError}</p>
                                    {invalidEmails.length > 0 && (
                                        <ul className="list-disc list-inside mt-2 text-red-600">
                                            {invalidEmails.map(e => <li key={e}>{e || 'Empty/Invalid Email'}</li>)}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl border border-slate-200">
                                <span className="text-slate-600 font-semibold">Total Amount</span>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                                    {'$'}{discountedPerPerson * (groupSize + 1)} CAD
                                </span>
                            </div>
                            <Button 
                                onClick={handleGroupPayment}
                                disabled={isPaymentLoading || isValidating}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-lg shadow-lg shadow-blue-500/30 font-semibold transition-all hover:shadow-xl cursor-pointer"
                            >
                                Submit & Pay Bundle
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
      </motion.div>
    </div>
  )
}
