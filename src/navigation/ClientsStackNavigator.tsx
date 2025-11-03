import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientsListScreen from "~/screens/Clients/ClientsListScreen";
import AddClientScreen from "~/screens/Clients/AddClientScreen";
import ClientDetailsScreen from "~/screens/Clients/ClientDetailsScreen";
import AddUnitScreen from "~/screens/Units/AddUnitScreen";
import AddEquipmentScreen from "~/screens/Equipment/AddEquipmentScreen";
import EquipmentDetailsScreen from "~/screens/Equipment/EquipmentDetailsScreen";
import AddServiceScreen from "~/screens/Services/AddServiceScreen";
import ServiceDetailsScreen from "~/screens/Services/ServiceDetailsScreen";

const Stack = createNativeStackNavigator();

export default function ClientsStackNavigator() {
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
        options={{
          title: "Novo Cliente",
        }}
      />
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetailsScreen}
        options={{
          title: "Detalhes do Cliente",
        }}
      />
      <Stack.Screen
        name="AddUnit"
        component={AddUnitScreen}
        options={{
          title: "Nova Unidade",
        }}
      />
      <Stack.Screen
        name="AddEquipment"
        component={AddEquipmentScreen}
        options={{
          title: "Novo Equipamento",
        }}
      />
      <Stack.Screen
        name="EquipmentDetails"
        component={EquipmentDetailsScreen}
        options={{
          title: "Detalhes do Equipamento",
        }}
      />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{
          title: "Novo Atendimento",
        }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetailsScreen}
        options={{ title: "Detalhes do Atendimento" }}
      />
    </Stack.Navigator>
  );
}
