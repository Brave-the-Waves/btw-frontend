import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const oobCode = searchParams.get('oobCode') || ''
  const { resetPassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validatePassword = (p) => p.length >= 8

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!oobCode) {
      setError('Missing reset code.')
      return
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      // Use AuthContext wrapper to verify and confirm the password reset
      await resetPassword(oobCode, password)
      setSuccess('Password has been reset. You can now sign in.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 px-4 max-w-md mx-auto">
        <div className="bg-white p-8 rounded-xl shadow border border-slate-100">
          <h2 className="text-2xl font-bold mb-2">Choose a new password</h2>
          <p className="text-sm text-slate-600 mb-6">Enter a new secure password for your account.</p>

          {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
          {success && <div className="text-sm text-green-600 mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1">New password</label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Confirm password</label>
              <Input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
            </div>
            <Button type="submit" className="w-full bg-pink-600 text-white" disabled={loading}>{loading ? 'Saving...' : 'Save new password'}</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
