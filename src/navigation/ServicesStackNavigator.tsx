import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServicesListScreen from "~/screens/Services/ServicesListScreen";
import AddServiceScreen from "~/screens/Services/AddServiceScreen";
import ServiceDetailsScreen from "~/screens/Services/ServiceDetailsScreen";

const Stack = createNativeStackNavigator();

export default function ServicesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="ServicesList"
        component={ServicesListScreen}
        options={{ title: "Serviços" }}
      />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{
          headerShown: true,
          title: "Novo Serviço",
        }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetailsScreen}
        options={{
          headerShown: true,
          title: "Detalhes do Serviço",
        }}
      />
    </Stack.Navigator>
  );
}
