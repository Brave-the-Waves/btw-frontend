import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/button'
import { Input } from '../components/ui/input'

const NAME_REGEX = /^[A-Za-z0-9 .'-]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  })
  const { signup } = useAuth()
  const navigate = useNavigate()

  const normalizedName = name.replace(/\s+/g, ' ').trim()
  const normalizedEmail = email.trim().toLowerCase()

  const getNameError = () => {
    if (!normalizedName) return 'Name is required'
    if (normalizedName.length < 2 || normalizedName.length > 30) return 'Name must be 2–30 characters'
    if (!NAME_REGEX.test(normalizedName)) return "Use letters, numbers, spaces, hyphen, apostrophe, or period only"
    return ''
  }

  const getEmailError = () => {
    if (!normalizedEmail) return 'Email is required'
    if (!EMAIL_REGEX.test(normalizedEmail)) return 'Enter a valid email address'
    return ''
  }

  const getPasswordError = () => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number'
    if (!/[a-z]/.test(password)) return 'Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number'
    if (!/\d/.test(password)) return 'Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number'
    return ''
  }

  const getConfirmPasswordError = () => {
    if (!confirmPassword) return 'Please confirm your password'
    if (password !== confirmPassword) return 'Passwords do not match'
    return ''
  }

  const nameError = getNameError()
  const emailError = getEmailError()
  const passwordError = getPasswordError()
  const confirmPasswordError = getConfirmPasswordError()

  const isFormValid = !nameError && !emailError && !passwordError && !confirmPasswordError

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setTouched({ name: true, email: true, password: true, confirmPassword: true })

    if (!isFormValid) {
      return setError('Please fix the highlighted fields')
    }

    try {
      setError('')
      setLoading(true)
      await signup(normalizedEmail, password, normalizedName)
      navigate('/')
    } catch (err) {
      setError('Failed to create an account: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-20">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">Join us today</p>
        </div>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm mb-4">{error}</div>}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                 <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => markTouched('name')}
                    placeholder="Your name"
                    maxLength={30}
                    aria-invalid={touched.name && !!nameError}
                 />
                 {touched.name && nameError && (
                   <p className="mt-1 text-xs text-red-600">{nameError}</p>
                 )}
               </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                   <Input 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => markTouched('email')}
                        placeholder="you@example.com"
                        aria-invalid={touched.email && !!emailError}
                   />
                   {touched.email && emailError && (
                     <p className="mt-1 text-xs text-red-600">{emailError}</p>
                   )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <Input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => markTouched('password')}
                        placeholder="••••••••"
                        minLength={8}
                        aria-invalid={touched.password && !!passwordError}
                    />
                    {touched.password && passwordError && (
                      <p className="mt-1 text-xs text-red-600">{passwordError}</p>
                    )}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <Input 
                        type="password" 
                        required 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => markTouched('confirmPassword')}
                        placeholder="••••••••"
                        minLength={8}
                        aria-invalid={touched.confirmPassword && !!confirmPasswordError}
                    />
                    {touched.confirmPassword && confirmPasswordError && (
                      <p className="mt-1 text-xs text-red-600">{confirmPasswordError}</p>
                    )}
                </div>
            </div>

            <Button type="submit" className="w-full bg-[#fc87a7] hover:bg-[#c14a75] text-white rounded-lg" disabled={loading || !isFormValid}>
                {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
        </form>

        <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="font-medium text-[#fc87a7] hover:text-[#c14a75]">
                Sign in here
            </Link>
        </div>
      </div>
    </div>
  )
}
