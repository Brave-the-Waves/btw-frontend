import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function DeleteAccountButton() {
  const { deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await deleteAccount(password)
      navigate('/') // Redirect to home after deletion
    } catch (err) {
      setError(err.message || 'Failed to delete account')
    } finally {
      setIsLoading(false)
    }
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow-lg hover:shadow-red-600/30 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
        Delete Account
      </button>
    )
  }

  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50 space-y-4">
      <div>
        <p className="font-semibold text-red-900 mb-2">Delete Account</p>
        <p className="text-sm text-red-700">This action cannot be undone. All your data will be permanently deleted from our servers.</p>
      </div>

      <input
        type="password"
        placeholder="Enter your password to confirm"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        className="w-full px-3 py-2 border border-red-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-red-500 outline-none"
      />

      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          {isLoading ? 'Deleting...' : 'Delete Account'}
        </button>
        <button
          onClick={() => {
            setShowConfirm(false)
            setPassword('')
            setError('')
          }}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 rounded-lg text-sm font-semibold transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
