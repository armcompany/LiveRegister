import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ServicesListScreen from '~/screens/Services/ServicesListScreen';
import AddServiceScreen from '~/screens/Services/AddServiceScreen';
import ServiceDetailsScreen from '~/screens/Services/ServiceDetailsScreen';

const Stack = createNativeStackNavigator();

export default function ServicesStack() {
  return (
    <Stack.Navigator initialRouteName="ServicesList">
      <Stack.Screen name="ServicesList" component={ServicesListScreen} options={{ title: 'Serviços' }} />
      <Stack.Screen name="AddService" component={AddServiceScreen} options={{ title: 'Novo serviço' }} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} options={{ title: 'Detalhes do serviço' }} />
    </Stack.Navigator>
  );
}
