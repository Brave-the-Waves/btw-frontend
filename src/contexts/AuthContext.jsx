import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext()


// // User clicks "Log In" button in Navbar
// loginWithRedirect()
//   ↓
// // Firebase popup opens, user signs in
// signInWithPopup(auth, provider)
//   ↓
// // Firebase triggers the listener
// onAuthStateChanged(auth, (firebaseUser) => {
//   setUser({ uid: ..., email: ... })  // ← STATE UPDATE!
//   setIsAuthenticated(true)            // ← STATE UPDATE!
// })
//   ↓
// // React re-renders AuthProvider
// const value = {
//   user: { uid: "123", email: "user@example.com" },  // New value!
//   isAuthenticated: true,                             // New value!
//   ...
// }
//   ↓
// // AuthContext.Provider gets the new value
// <AuthContext.Provider value={value}>
//   ↓
// // All components calling useAuth() re-render
// Navbar gets new user data → updates UI
// Profile gets new user data → shows user info


export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)

  const fetchBackendUser = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken()
      const res = await fetch('http://localhost:8000/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      if (res.ok) {
        const backendUser = await res.json()
        if (!backendUser.hasPaid) {
            setShowPaymentModal(true)
        } else {
            setShowPaymentModal(false)
        }
        return backendUser
      }
    } catch (error) {
        console.error('Failed to fetch backend user:', error)
        }
        return {}
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          picture: firebaseUser.photoURL
        })
        setIsAuthenticated(true)
        const backendData = await fetchBackendUser(firebaseUser)
        setUser(prev => ({ ...prev, ...backendData }))
      } else {
        setUser(null)
        setIsAuthenticated(false)
        setShowPaymentModal(false)
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const loginWithRedirect = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      console.log(result)
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('http://localhost:8000/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Sync error details:', res.status, errorText)
        throw new Error('Failed to sync user with backend: ' + errorText)
      }
      const backendData = await fetchBackendUser(result.user)
      setUser(prev => ({ ...prev, ...backendData }))
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const initiateRegistrationPayment = async () => {
    setIsPaymentLoading(true)
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('http://localhost:8000/api/create-registration-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: 25, currency: 'CAD' })
      })

      if (!res.ok) throw new Error('Failed to create checkout session')

      const data = await res.json()
      if (data.url) {
        sessionStorage.setItem('registration_payment_initiated', 'true')
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      alert('Failed to start payment. Please try again.')
    } finally {
      setIsPaymentLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setShowPaymentModal(false)
      console.log('User signed out')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const dismissPaymentModal = () => {
    setShowPaymentModal(false)
  }

  const getAccessTokenSilently = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken()
    }
    throw new Error('No user logged in')
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    initiateRegistrationPayment,
    isPaymentLoading,
    showPaymentModal,
    dismissPaymentModal
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
