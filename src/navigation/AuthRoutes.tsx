import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '~/screens/Auth/LoginScreen'
import RegisterScreen from '~/screens/Auth/RegisterScreen'

const Stack = createNativeStackNavigator()

export default function AuthRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={RegisterScreen} />
    </Stack.Navigator>
  )
}
