import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '~/services/supabaseClient'
import { Linking } from 'react-native'
import { NavigationContainerRef } from '@react-navigation/native'

interface AuthContextProps {
  user: any
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export const AuthProvider: React.FC<{ children: React.ReactNode, navigationRef?: React.RefObject<NavigationContainerRef<any>> }> = ({ children, navigationRef }) => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      // Se vier de um fluxo de recuperação (recovery), navegar para a tela de redefinição
      if (event === 'PASSWORD_RECOVERY' && navigationRef?.current) {
        navigationRef.current.navigate('RedefinirSenha' as never)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => { await supabase.auth.signOut() }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
