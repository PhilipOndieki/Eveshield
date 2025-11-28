import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../utils/firebase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sign up new user
  const signup = async (email, password, userData) => {
    try {
      setError(null)
      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      // Update display name
      await updateProfile(user, {
        displayName: userData.fullName,
      })

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: userData.fullName,
        email: email,
        phoneNumber: userData.phoneNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Sign in existing user
  const login = async (email, password) => {
    try {
      setError(null)
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      return user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Sign out user
  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setUserProfile(docSnap.data())
        return docSnap.data()
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    resetPassword,
    error,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
