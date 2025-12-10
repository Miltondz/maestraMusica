import React, { createContext, useEffect, useState } from 'react'
import { pb } from '../services/pocketbase'
import type { RecordModel } from 'pocketbase'

export interface AuthContextType {
  user: RecordModel | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<RecordModel | null>(pb.authStore.model)
  const [loading, setLoading] = useState(false) // PB auth is sync on init

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      await pb.collection('users').authWithPassword(email, password)
    } catch (error) {
      throw error // Let the component handle the error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    pb.authStore.clear()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}