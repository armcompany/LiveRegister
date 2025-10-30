import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientsListScreen from '~/screens/Clients/ClientsListScreen';
import AddClientScreen from '~/screens/Clients/AddClientScreen';
import ClientDetailsScreen from '~/screens/Clients/ClientDetailsScreen';

const Stack = createNativeStackNavigator();

export default function ClientsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ClientsList" component={ClientsListScreen} options={{ title: 'Clientes' }} />
      <Stack.Screen name="AddClient" component={AddClientScreen} options={{ title: 'Novo cliente' }} />
      <Stack.Screen name="ClientDetails" component={ClientDetailsScreen} options={{ title: 'Detalhes do cliente' }} />
    </Stack.Navigator>
  );
}

