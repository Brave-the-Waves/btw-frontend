import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Home } from 'lucide-react'
import Button from '@/components/ui/button'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Success() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      navigate('/', { replace: true })
    }
  }, [sessionId, navigate])

  if (!sessionId) return null

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
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h1>
        <p className="text-slate-600 mb-8 text-lg">
          Your donation was successful. Your support helps us make a real difference in women's health and survivor programs.
        </p>

        {sessionId && (
          <div className="bg-slate-50 rounded-xl p-4 mb-8 text-sm text-slate-500">
            <p className="font-medium mb-1">Transaction Reference:</p>
            <code className="bg-slate-100 px-2 py-1 rounded">{sessionId.slice(-10)}</code>
          </div>
        )}

        <Button 
          onClick={() => navigate('/')}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 py-6 text-lg rounded-xl"
        >
          <Home className="w-5 h-5 mr-2" />
          Return Home
        </Button>
      </motion.div>
    </div>
  )
}
