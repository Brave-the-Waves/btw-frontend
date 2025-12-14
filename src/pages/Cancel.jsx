import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/button'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Cancel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Only allow access if the URL has ?ref=checkout
    if (searchParams.get('ref') !== 'checkout') {
      navigate('/', { replace: true })
    }
  }, [searchParams, navigate])

  if (searchParams.get('ref') !== 'checkout') return null

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-lg w-full text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Donation Cancelled</h1>
        <p className="text-slate-600 mb-8 text-lg">
          Your donation process was cancelled. No charges were made to your card.
        </p>

        <Button 
          onClick={() => navigate('/')}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 py-6 text-lg rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Return Home
        </Button>
      </motion.div>
    </div>
  )
}
