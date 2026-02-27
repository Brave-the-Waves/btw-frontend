import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Users } from 'lucide-react'
import Button from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function RegistrationSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const isInitiated = sessionStorage.getItem('registration_payment_initiated')
    const viaSelection = sessionStorage.getItem('registration_via_selection') === 'true'
    const teamName = sessionStorage.getItem('registration_team_name')
    if (!isInitiated) {
      navigate('/')
      return
    }
    // keep flags for now; page will read and can navigate accordingly
  }, [navigate])

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
        
        {sessionStorage.getItem('registration_via_selection') === 'true' ? (
          (() => {
            const teamName = sessionStorage.getItem('registration_team_name')
            const teamPath = teamName ? `/event/BraveTheWaves2026/teams/${encodeURIComponent(teamName)}` : '/profile'
            return (
              <>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Registration Complete — You're On A Team!</h1>
                <p className="text-slate-600 mb-8 text-lg">
                  You've been added to <strong>{teamName || 'your team'}</strong> via the selection code. View your team details below.
                </p>

                <Button 
                  onClick={() => navigate(teamPath)}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 py-6 text-lg rounded-xl"
                >
                  <Users className="w-5 h-5 mr-2" />
                  View My Team
                </Button>
              </>
            )
          })()
        ) : (
          <>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Registration Complete!</h1>
            <p className="text-slate-600 mb-8 text-lg">
              Welcome aboard! Your registration fee has been processed successfully. You can now join an existing team or create your own.
            </p>

            <Button 
              onClick={() => navigate('/event/BraveTheWaves2026/teams')}
              className="w-full bg-slate-900 text-white hover:bg-slate-800 py-6 text-lg rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              Find a Team
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}