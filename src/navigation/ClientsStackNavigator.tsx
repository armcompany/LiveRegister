import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientsListScreen from "~/screens/Clients/ClientsListScreen";
import AddClientScreen from "~/screens/Clients/AddClientScreen";
import ClientDetailsScreen from "~/screens/Clients/ClientDetailsScreen";

const Stack = createNativeStackNavigator();

export default function ClientsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientsListMain" component={ClientsListScreen} />
      <Stack.Screen
        name="AddClient"
        component={AddClientScreen}
        options={{ headerShown: true, title: "Novo Cliente" }}
      />
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetailsScreen}
        options={{ headerShown: true, title: "Detalhes do Cliente" }}
      />
    </Stack.Navigator>
  );
}
