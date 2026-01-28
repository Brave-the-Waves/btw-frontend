import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../firebase'
import { API_BASE_URL } from '../config'

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
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  
  // Cache to prevent redundant backend fetches on token refreshes
  const lastSyncedUid = useRef(null)

  const fetchBackendUser = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken()
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      if (res.ok) {
        const backendUser = await res.json()

        // Fetch registration status
        try {
          const regRes = await fetch(`${API_BASE_URL}/api/registrations/${backendUser.id}/status`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
          if (regRes.ok) {
            const regData = await regRes.json()
            backendUser.isRegistered = regData.isRegistered
          }
        } catch (err) {
          console.error('Failed to fetch registration status:', err)
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
        // Update basic auth info immediately
        setUser(prev => ({
          ...prev,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          picture: firebaseUser.photoURL
        }))
        setIsAuthenticated(true)

        // Only fetch backend data if we haven't synced this user yet in this session
        if (lastSyncedUid.current !== firebaseUser.uid) {
          const backendData = await fetchBackendUser(firebaseUser)
          setUser(prev => ({ ...prev, ...backendData }))
          lastSyncedUid.current = firebaseUser.uid
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
        lastSyncedUid.current = null
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const syncUserWithBackend = async (firebaseUser) => {
    const token = await firebaseUser.getIdToken()
    const res = await fetch(`${API_BASE_URL}/api/users/sync`, {
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
    const backendData = await fetchBackendUser(firebaseUser)
    setUser(prev => ({ ...prev, ...backendData }))
  }

  const signup = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await syncUserWithBackend(result.user)
      return result
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await syncUserWithBackend(result.user)
      return result
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      await syncUserWithBackend(result.user)
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  }

  // Deprecated: use loginWithGoogle
  const loginWithRedirect = loginWithGoogle

  const initiateRegistrationPayment = async (additionalData = {}) => {
    setIsPaymentLoading(true)
    try {
      const token = await auth.currentUser.getIdToken()
      
      let url = `${API_BASE_URL}/api/create-registration-checkout`
      let body = { amount: 25, currency: 'CAD', ...additionalData }

      if (additionalData.registrationType === 'bundle') {
          url = `${API_BASE_URL}/api/create-bundle-registration-checkout`
          body = {
              bundleEmails: additionalData.emails || [],
              amount: 25 * (1 + (additionalData.emails?.length || 0)),
              currency: 'CAD'
          }
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
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
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getAccessTokenSilently = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken()
    }
    throw new Error('No user logged in')
  }

  const refreshUser = async () => {
    if (auth.currentUser) {
      const backendData = await fetchBackendUser(auth.currentUser)
      setUser(prev => ({ ...prev, ...backendData }))
    }
  }

  const isRegisteredUser = () => {
    return !!user?.isRegistered
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    loginWithGoogle,
    login,
    signup,
    logout,
    getAccessTokenSilently,
    initiateRegistrationPayment,
    isPaymentLoading,
    refreshUser,
    isRegisteredUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
