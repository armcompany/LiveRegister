import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClientsStack from '~/navigation/ClientsStack';
import ServicesStack from '~/navigation/ServicesStack';
import ProfileScreen from '~/screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator initialRouteName="ServicesTab" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="ServicesTab" component={ServicesStack} options={{ title: 'Serviços' }} />
      <Tab.Screen name="ClientsTab" component={ClientsStack} options={{ title: 'Clientes' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
