import React from 'react'
import Navbar from '@/components/Navbar'
import { useNavigate } from 'react-router-dom'

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
              Community registration is for participants associated with our community partners.
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
                Note: Proof of student status will be required during the event.
              </p>
            </div>
          </div>

          {/* Placeholder Card 2 */}
          <div className="rounded-2xl p-8 border-2 bg-slate-50 border-slate-200 text-slate-400 pointer-events-none opacity-80">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6"></div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Coming Soon</h3>
            <p className="text-slate-500 text-sm mb-6">Details will be added here.</p>
          </div>

          {/* Placeholder Card 3 */}
          <div className="rounded-2xl p-8 border-2 bg-slate-50 border-slate-200 text-slate-400 pointer-events-none opacity-80">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6"></div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Coming Soon</h3>
            <p className="text-slate-500 text-sm mb-6">Details will be added here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
