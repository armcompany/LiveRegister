import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ClientsListScreen from '~/screens/Clients/ClientsListScreen'
import AddClientScreen from '~/screens/Clients/AddClientScreen'
import ClientDetailsScreen from '~/screens/Clients/ClientDetailsScreen'
import ServicesListScreen from '~/screens/Services/ServicesListScreen'
import AddServiceScreen from '~/screens/Services/AddServiceScreen'
import ServiceDetailsScreen from '~/screens/Services/ServiceDetailsScreen'
import ProfileScreen from '~/screens/Profile/ProfileScreen'

const Stack = createNativeStackNavigator()

export default function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Clientes" component={ClientsListScreen} />
      <Stack.Screen name="NovoCliente" component={AddClientScreen} />
      <Stack.Screen name="DetalhesCliente" component={ClientDetailsScreen} />
      <Stack.Screen name="Atendimentos" component={ServicesListScreen} />
      <Stack.Screen name="NovoAtendimento" component={AddServiceScreen} />
      <Stack.Screen name="DetalhesAtendimento" component={ServiceDetailsScreen} />
      <Stack.Screen name="Perfil" component={ProfileScreen} />
    </Stack.Navigator>
  )
}
