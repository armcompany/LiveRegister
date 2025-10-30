import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "~/screens/Auth/LoginScreen";
import RegisterScreen from "~/screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "~/screens/Auth/ForgotPasswordScreen";
import ResetPasswordScreen from "~/screens/Auth/ResetPasswordScreen";

const Stack = createNativeStackNavigator();

export default function AuthRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={RegisterScreen} />
      <Stack.Screen name="EsqueciSenha" component={ForgotPasswordScreen} />
      <Stack.Screen name="RedefinirSenha" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
