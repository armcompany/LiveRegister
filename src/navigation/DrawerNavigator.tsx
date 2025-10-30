import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from "react-native";
import ClientsStackNavigator from "~/navigation/ClientsStackNavigator";
import ServicesStackNavigator from "~/navigation/ServicesStackNavigator";
import ProfileScreen from "~/screens/Profile/ProfileScreen";
import CustomDrawerContent from "~/components/CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: isLargeScreen ? "permanent" : "front",
        drawerStyle: {
          width: isLargeScreen ? 240 : 280,
          backgroundColor: "#fff",
        },
        // Header
        headerStyle: {
          backgroundColor: "#2563eb",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
        swipeMinDistance: 20,
        // Active item
        drawerActiveBackgroundColor: "#e0e7ff",
        drawerActiveTintColor: "#1e40af",
        // Inactive item
        drawerInactiveTintColor: "#4b5563",
        sceneStyle: { backgroundColor: "#f9fafb" },

        // Spacing between icon and label + item padding
        drawerLabelStyle: {
          marginLeft: 8,
          fontSize: 16,
          fontWeight: "500",
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 2,
          marginVertical: 6,
        },
      }}
    >
      <Drawer.Screen
        name="ClientsList"
        component={ClientsStackNavigator}
        options={{
          title: "Clientes",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ServicesList"
        component={ServicesStackNavigator}
        options={{
          title: "Atendimentos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
