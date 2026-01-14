import React, { createContext } from 'react'
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export interface AuthContextType {
  user: any | null // Convex user data or token metadata
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();

  // For compatibility with existing components, we mock the user object
  // In a full implementation, you'd fetch the user profile from Convex
  const user = isAuthenticated ? { id: "convex-user" } : null;

  const signIn = async (email: string, password: string) => {
    try {
      await convexSignIn("password", { email, password, flow: "signIn" });
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    await convexSignOut();
  }

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
