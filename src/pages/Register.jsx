import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Users, Check, AlertCircle, Loader2, Mail, Plus, Trash2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '@/config'

export default function Register() {
  const { isAuthenticated, isLoading, initiateRegistrationPayment, isPaymentLoading, getAccessTokenSilently } = useAuth()
  const navigate = useNavigate()
  
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
    initiateRegistrationPayment()
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

        if (!res.ok) {
            const data = await res.json()
             if (data.invalidEmails && data.invalidEmails.length > 0) {
                setInvalidEmails(data.invalidEmails)
                setValidationError('The following emails are not registered users yet. Please ensure they have accounts first.')
                setIsValidating(false)
                return
            }
             // Fallback for other errors
             throw new Error(data.message || 'Validation failed')
        } else {
            // Check if response body has invalidEmails even on 200 OK (depending on API design)
             const data = await res.json()
             if (data.invalidEmails && data.invalidEmails.length > 0) {
                setInvalidEmails(data.invalidEmails)
                setValidationError('The following emails are not registered users yet. Please ensure they have accounts first.')
                setIsValidating(false)
                return
             }
        }

        // 3. Initiate Logic
        initiateRegistrationPayment({
            emails: filledEmails,
            registrationType: 'bundle'
        })

    } catch (error) {
        console.error('Group validation error:', error)
        setValidationError(error.message || 'An error occurred during validation.')
    } finally {
        setIsValidating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Event Registration</h1>
                <p className="text-slate-600 text-center mb-4 max-w-lg mx-auto">
                    Choose how you would like to register. You can register just for yourself or bundle register for your whole team.
                </p>
                <p className="text-sm text-slate-500 text-center mb-8">
                    Early registration is open — Early registration deadline: <strong>MM/DD/YYYY</strong>.
                </p>

        {/* Loading Overlay */}
        {(isPaymentLoading || isValidating) && (
             <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center flex-col">
                <Loader2 className="w-12 h-12 text-pink-600 animate-spin mb-4" />
                <p className="text-pink-600 font-medium text-lg">
                    {isValidating ? 'Validating emails...' : 'Processing payment...'}
                </p>
             </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Individual Card */}
            <div 
                onClick={() => setSelectedMode('individual')}
                className={`cursor-pointer rounded-2xl p-8 border-2 transition-all relative overflow-hidden group ${
                    selectedMode === 'individual' 
                    ? 'border-pink-500 bg-white shadow-xl scale-[1.02]' 
                    : 'border-slate-200 bg-white hover:border-pink-200 hover:shadow-lg'
                }`}
            >
                {selectedMode === 'individual' && (
                    <div className="absolute top-4 right-4 bg-pink-500 text-white p-1 rounded-full">
                        <Check className="w-4 h-4" />
                    </div>
                )}
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-pink-200 transition-colors">
                    <User className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Individual Registration<br/>(Early)</h3>
                <p className="text-slate-500 text-sm mb-6">
                    Register just for yourself. You will be able to join a team or create one after payment.
                </p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-slate-900">$25</span>
                    <span className="text-slate-500 mb-1">CAD</span>
                </div>
            </div>

            {/* Individual - Regular (disabled) */}
            <div
                className={`rounded-2xl p-8 border-2 transition-all relative overflow-hidden bg-slate-100 border-slate-200 text-slate-400 pointer-events-none opacity-80`}
            >
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                    <User className="w-8 h-8 text-pink-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Individual Registration (Regular)</h3>
                <p className="text-slate-500 text-sm mb-6">Regular registration is not open yet. Opens: <strong>MM/DD/YYYY</strong>.</p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-slate-700">$30</span>
                    <span className="text-slate-500 mb-1">CAD</span>
                </div>
            </div>

            {/* Individual - Late (disabled) */}
            <div
                className={`rounded-2xl p-8 border-2 transition-all relative overflow-hidden bg-slate-100 border-slate-200 text-slate-400 pointer-events-none opacity-80`}
            >
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                    <User className="w-8 h-8 text-pink-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Individual Registration<br/>(Late)</h3>
                <p className="text-slate-500 text-sm mb-6">Late registration is not open yet. Opens: <strong>MM/DD/YYYY</strong>.</p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-slate-700">$35</span>
                    <span className="text-slate-500 mb-1">CAD</span>
                </div>
            </div>

            {/* Group Card */}
            <div 
                onClick={() => setSelectedMode('group')}
                className={`cursor-pointer rounded-2xl p-8 border-2 transition-all relative overflow-hidden group ${
                    selectedMode === 'group' 
                    ? 'border-blue-500 bg-white shadow-xl scale-[1.02]' 
                    : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg'
                }`}
            >
                 {selectedMode === 'group' && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white p-1 rounded-full">
                        <Check className="w-4 h-4" />
                    </div>
                )}
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                    <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Group Registration (Early)</h3>
                <p className="text-slate-500 text-sm mb-6">
                    Pay for multiple participants at once. Perfect to get your friends onboard at a reduced cost.
                </p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-slate-900">$20</span>
                    <span className="text-slate-500 mb-1">CAD / person</span>
                </div>
            </div>

            {/* Group - Regular (disabled) */}
            <div
                className={`rounded-2xl p-8 border-2 transition-all relative overflow-hidden bg-slate-100 border-slate-200 text-slate-400 pointer-events-none opacity-80`}
            >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Group Registration (Regular)</h3>
                <p className="text-slate-500 text-sm mb-6">Regular registration is not open yet. Opens: <strong>MM/DD/YYYY</strong>.</p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-slate-700">$25</span>
                    <span className="text-slate-500 mb-1">CAD / person</span>
                </div>
            </div>

            {/* Group - Late (disabled) */}
            <div
                className={`rounded-2xl p-8 border-2 transition-all relative overflow-hidden bg-slate-100 border-slate-200 text-slate-400 pointer-events-none opacity-80`}
            >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Group Registration (Late)</h3>
                <p className="text-slate-500 text-sm mb-6">Late registration is not open yet. Opens: <strong>MM/DD/YYYY</strong>.</p>
                <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-slate-700">$30</span>
                    <span className="text-slate-500 mb-1">CAD / person</span>
                </div>
            </div>
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
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-pink-200"
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
                        className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Bundle Details</h3>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Number of Participants (including you)
                            </label>
                            <select 
                                value={groupSize + 1} 
                                onChange={(e) => handleGroupSizeChange(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                            >
                                <option value={5}>5 Participants</option>
                                <option value={10}>10 Participants</option>
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
                                        className={`pl-9 ${invalidEmails.includes(email) ? 'border-red-300 bg-red-50' : ''}`}
                                    />
                                </div>
                            ))}
                        </div>

                        {validationError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
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
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                <span className="text-slate-600 font-medium">Total Amount</span>
                                <span className="text-xl font-bold text-slate-900">
                                    ${20 * (groupSize + 1)} CAD
                                </span>
                            </div>
                            <Button 
                                onClick={handleGroupPayment}
                                disabled={isPaymentLoading || isValidating}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-blue-200"
                            >
                                Submit & Pay Bundle
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
