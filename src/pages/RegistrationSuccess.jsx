import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Users } from 'lucide-react'
import Button from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function RegistrationSuccess() {
  const navigate = useNavigate()
  const { dismissPaymentModal } = useAuth()

  useEffect(() => {
    const isInitiated = sessionStorage.getItem('registration_payment_initiated')
    if (!isInitiated) {
      navigate('/')
      return
    }
    // sessionStorage.removeItem('registration_payment_initiated')
    dismissPaymentModal()
  }, [navigate, dismissPaymentModal])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-lg w-full text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Registration Complete!</h1>
        <p className="text-slate-600 mb-8 text-lg">
          Welcome aboard! Your registration fee has been processed successfully. You can now join an existing team or create your own.
        </p>

        <Button 
          onClick={() => navigate('/teams')}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 py-6 text-lg rounded-xl"
        >
          <Users className="w-5 h-5 mr-2" />
          Find a Team
        </Button>
      </motion.div>
    </div>
  )
}