import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientsListScreen from "~/screens/Clients/ClientsListScreen";
import AddClientScreen from "~/screens/Clients/AddClientScreen";
import ClientDetailsScreen from "~/screens/Clients/ClientDetailsScreen";
import ServicesListScreen from "~/screens/Services/ServicesListScreen";
import AddServiceScreen from "~/screens/Services/AddServiceScreen";
import ServiceDetailsScreen from "~/screens/Services/ServiceDetailsScreen";
import ProfileScreen from "~/screens/Profile/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClientsList"
        component={ClientsListScreen}
        options={{ title: "Clientes" }}
      />
      <Stack.Screen
        name="AddClient"
        component={AddClientScreen}
        options={{ title: "Novo Cliente" }}
      />
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetailsScreen}
        options={{ title: "Detalhes do Cliente" }}
      />
      <Stack.Screen
        name="ServicesList"
        component={ServicesListScreen}
        options={{ title: "Atendimentos" }}
      />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{ title: "Novo Atendimento" }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetailsScreen}
        options={{ title: "Detalhes do Atendimento" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Stack.Navigator>
  );
}
