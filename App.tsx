import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "~/navigation/DrawerNavigator";
import AuthRoutes from "~/navigation/AuthRoutes";
import { useAuth, AuthProvider } from "~/context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-gesture-handler";
import { Platform } from "react-native";
import AppTabs from "~/navigation/AppTabs";

function Routes() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {user ? (
        Platform.OS === "web" ? (
          <DrawerNavigator />
        ) : (
          <AppTabs />
        )
      ) : (
        <AuthRoutes />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PaperProvider>
  );
}
