import React from 'react'
import { motion } from 'framer-motion'
import { Lock, LogOut } from 'lucide-react'
import Button from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function RegistrationOverlay() {
  const { logout, loginWithRedirect, initiateRegistrationPayment, isPaymentLoading, showPaymentModal, isAuthenticated, isLoading, dismissPaymentModal } = useAuth()
  const navigate = useNavigate()

  if (!showPaymentModal || isLoading) {
    return null
  }

  if (!isAuthenticated) {
     return (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
         >
           <div className="bg-pink-600 p-6 text-center">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Lock className="w-8 h-8 text-white" />
             </div>
             <h2 className="text-2xl font-bold text-white">Login Required</h2>
           </div>
 
           <div className="p-8">
             <p className="text-slate-600 text-center mb-6">
               Please log in to join or create a team.
             </p>
 
             <div className="space-y-3">
               <Button 
                 onClick={loginWithRedirect}
                 className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 text-lg rounded-xl"
               >
                 Log In
               </Button>
 
               <button 
                 onClick={dismissPaymentModal}    
                 className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center gap-2 transition-colors"  
                 >
                 Cancel
               </button>        
             </div>
           </div>
         </motion.div>
       </div>
     )
   }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-pink-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Registration Required</h2>
        </div>

        <div className="p-8">
          <p className="text-slate-600 text-center mb-6">
            To join or create a team, you must complete the registration fee payment.
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 flex justify-between items-center">
            <span className="font-medium text-slate-700">Registration Fee</span>
            <span className="text-xl font-bold text-slate-900">$25.00 CAD</span>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={initiateRegistrationPayment}
              disabled={isPaymentLoading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg rounded-xl"
            >
              {isPaymentLoading ? 'Processing...' : 'Pay Registration Fee'}
            </Button>

            <button 
              onClick={dismissPaymentModal}    
              className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center gap-2 transition-colors"  
              >I'll pay later</button>        
            
            <button 
              onClick={logout}
              className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />  
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}