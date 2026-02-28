import React, { useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ChangePassword() {
  const { changePassword } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirm: false
  })
  const navigate = useNavigate()

  const getPasswordError = () => {
    if (!newPassword) return 'New password is required'
    if (newPassword.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(newPassword)) return 'Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number'
    if (!/[a-z]/.test(newPassword)) return 'Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number'
    if (!/\d/.test(newPassword)) return 'Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number'
    return ''
  }

  const getConfirmError = () => {
    if (!confirm) return 'Please confirm your password'
    if (newPassword !== confirm) return 'Passwords do not match'
    return ''
  }

  const passwordError = getPasswordError()
  const confirmError = getConfirmError()
  const currentPasswordError = !currentPassword ? 'Current password is required' : ''
  const isFormValid = !currentPasswordError && !passwordError && !confirmError

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    markTouched('currentPassword')
    markTouched('newPassword')
    markTouched('confirm')
    
    if (!isFormValid) {
      setError('Please fix the highlighted fields')
      return
    }
    setLoading(true)
    try {
      await changePassword(currentPassword, newPassword)
      setSuccess('Password changed. You can now sign in with your new password.')
      setTimeout(() => navigate('/profile'), 1400)
    } catch (err) {
      setError(err.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-20">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Change Password</h2>
          <p className="mt-2 text-gray-600">Update your password for this account</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm mb-4">{error}</div>}
        {success && <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded relative text-sm mb-4">{success}</div>}

        <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
              <Input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} onBlur={() => markTouched('currentPassword')} placeholder="Current password" aria-invalid={touched.currentPassword && !!currentPasswordError} />
              {touched.currentPassword && currentPasswordError && (
                <p className="mt-1 text-xs text-red-600">{currentPasswordError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <Input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} onBlur={() => markTouched('newPassword')} placeholder="••••••" minLength={8} aria-invalid={touched.newPassword && !!passwordError} />
              {touched.newPassword && passwordError && (
                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
              <Input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} onBlur={() => markTouched('confirm')} placeholder="••••••" minLength={8} aria-invalid={touched.confirm && !!confirmError} />
              {touched.confirm && confirmError && (
                <p className="mt-1 text-xs text-red-600">{confirmError}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#fc87a7] hover:bg-[#c14a75] text-white rounded-lg" disabled={loading || !isFormValid}>
            {loading ? 'Saving...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
