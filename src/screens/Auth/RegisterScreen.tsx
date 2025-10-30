import React from "react";
import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "~/services/supabaseClient";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ScreenContainer from '~/components/ScreenContainer';
import PrimaryButton from '~/components/PrimaryButton';
import FormInput from '~/components/FormInput';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = React.useState(false);

  const schema = yup.object({
    name: yup.string().required('Informe seu nome.'),
    email: yup.string().required('Informe seu e-mail.').email('E-mail inválido.'),
    password: yup.string().required('Informe uma senha.').min(6, 'A senha deve ter ao menos 6 caracteres.'),
  });

  const { control, handleSubmit, formState: { errors } } = useForm<{ name: string; email: string; password: string }>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      Alert.alert("Verifique seu email", "Enviamos um link de confirmação.");
      navigation.navigate("Login" as never);
    } catch (e: any) {
      Alert.alert("Falha no cadastro", e?.message ?? "Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
        <View style={styles.content}>
          <Text
            accessibilityRole={Platform.OS === "web" ? "header" : undefined}
            style={styles.title}
          >
            Criar conta
          </Text>

          <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Nome"
                  placeholder="Seu nome"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  textContentType="name"
                  autoComplete="name"
                  enterKeyHint="next"
                  accessibilityLabel="Nome"
                  error={errors.name?.message}
                />
              )}
            />

          <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="E-mail"
                  placeholder="seu@email.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  enterKeyHint="next"
                  accessibilityLabel="E-mail"
                  error={errors.email?.message}
                />
              )}
            />

          <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Senha"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  textContentType="newPassword"
                  autoComplete="new-password"
                  enterKeyHint="go"
                  accessibilityLabel="Senha"
                  error={errors.password?.message}
                />
              )}
            />

          <PrimaryButton disabled={loading} onPress={handleSubmit(onSubmit)} title={loading ? 'Cadastrando...' : 'Cadastrar'} />

          <Pressable
            onPress={() => navigation.navigate("Login" as never)}
            style={styles.linkRow}
            accessibilityRole={Platform.OS === "web" ? "link" : undefined}
          >
            <Text style={styles.linkText}>Já tem conta? Entrar</Text>
          </Pressable>
        </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { width: "100%", maxWidth: 420, alignSelf: "center" },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  linkRow: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#2563eb" },
});

export default RegisterScreen;
