import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "~/screens/Profile/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import ServicesStackNavigator from "./ServicesStackNavigator";
import ClientsStackNavigator from "./ClientsStackNavigator";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="ServicesTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons: { [key: string]: string | any } = {
            ServicesTab: focused ? "calendar" : "calendar-outline",
            ClientsTab: focused ? "people" : "people-outline",
            ProfileTab: focused ? "person" : "person-outline",
          };

          const iconName = icons[route.name] || "ellipse-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "gray",
        tabBarIconStyle: { marginTop: 6 },
      })}
    >
      <Tab.Screen
        name="ServicesTab"
        component={ServicesStackNavigator}
        options={{ headerShown: false, title: "Serviços" }}
      />
      <Tab.Screen
        name="ClientsTab"
        component={ClientsStackNavigator}
        options={{ headerShown: false, title: "Clientes" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ headerShown: false, title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}
