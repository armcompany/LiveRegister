import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientsListScreen from "~/screens/Clients/ClientsListScreen";
import AddClientScreen from "~/screens/Clients/AddClientScreen";
import ClientDetailsScreen from "~/screens/Clients/ClientDetailsScreen";
import AddUnitScreen from "~/screens/Units/AddUnitScreen";
import AddEquipmentScreen from "~/screens/Equipment/AddEquipmentScreen";
import EquipmentDetailsScreen from "~/screens/Equipment/EquipmentDetailsScreen";

const Stack = createNativeStackNavigator();

export default function ClientsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientsListMain" component={ClientsListScreen} />
      <Stack.Screen
        name="AddClient"
        component={AddClientScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddUnit"
        component={AddUnitScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddEquipment"
        component={AddEquipmentScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EquipmentDetails"
        component={EquipmentDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
