import React from "react";
import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import { supabase } from "~/services/supabaseClient";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ScreenContainer from '~/components/ScreenContainer';
import PrimaryButton from '~/components/PrimaryButton';
import FormInput from '~/components/FormInput';

const ForgotPasswordScreen: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const schema = yup.object({ email: yup.string().required('Informe seu e-mail.').email('E-mail inválido.') });
  const { control, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  });

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      Alert.alert(
        "Verifique seu email",
        "Se o email existir, enviaremos instruções para redefinição."
      );
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível enviar o email.");
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
            Redefinir senha
          </Text>
          <Text style={styles.helper}>
            Informe seu email para receber o link de redefinição.
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="E-mail"
                style={{ marginTop: 12 }}
                placeholder="seu@email.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                enterKeyHint="go"
                accessibilityLabel="E-mail"
                error={errors.email?.message}
              />
            )}
          />
          <PrimaryButton disabled={loading} onPress={handleSubmit(onSubmit)} title={loading ? 'Enviando...' : 'Enviar link'} />
        </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { width: "100%", maxWidth: 420, alignSelf: "center" },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  helper: { color: "#555", textAlign: "center" },
  
});

export default ForgotPasswordScreen;
