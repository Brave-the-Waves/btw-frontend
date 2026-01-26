import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/button'
import { Input } from '../components/ui/input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Failed to log in: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setError('')
      setLoading(true)
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError('Failed to log in with Google: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-20">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Please sign in to your account</p>
        </div>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm mb-4">{error}</div>}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                   <Input 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                   />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <Input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <Button type="submit" className="w-full bg-[#fc87a7] hover:bg-[#c14a75] text-white rounded-lg" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
            </Button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
        </div>

        <Button 
            onClick={handleGoogleLogin} 
            type="button" 
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2"
            disabled={loading}
        >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Sign in with Google
        </Button>

        <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
            </Link>
        </div>
      </div>
    </div>
  )
}
