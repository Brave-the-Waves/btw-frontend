import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { sendPasswordReset } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const emailTrim = (email || '').trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailTrim)) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    try {
      // Use AuthContext to send the password reset email.
      await sendPasswordReset(emailTrim)
      setSuccess('If an account with that email exists, a reset link has been sent. Check your spam folder if you don\'t see it soon.')
      // optionally navigate or keep on page
    } catch (err) {
      setError(err.message || 'Failed to request password reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 px-4 max-w-md mx-auto">
        <div className="bg-white p-8 rounded-xl shadow border border-slate-100">
          <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
          <p className="text-sm text-slate-600 mb-6">Enter your email and we’ll send a link to reset your password.</p>

          {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
          {success && <div className="text-sm text-green-600 mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Email</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <Button type="submit" className="w-full bg-[#fc87a7] hover:bg-[#c14a75] text-white rounded-lg" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
            <div className="text-center text-sm text-slate-500">
              <button type="button" onClick={() => navigate('/login')} className="hover:underline">Back to sign in</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
