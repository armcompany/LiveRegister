import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AppRoutes from '~/navigation/AppRoutes'
import AuthRoutes from '~/navigation/AuthRoutes'
import { useAuth, AuthProvider } from '~/context/AuthContext'
import { Provider as PaperProvider } from 'react-native-paper'

function Routes() {
  const { user } = useAuth()
  return <NavigationContainer>{user ? <AppRoutes /> : <AuthRoutes />}</NavigationContainer>
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PaperProvider>
  )
}
