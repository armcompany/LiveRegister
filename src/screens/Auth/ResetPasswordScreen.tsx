import React from "react";
import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import { supabase } from "~/services/supabaseClient";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ScreenContainer from '~/components/ScreenContainer';
import PrimaryButton from '~/components/PrimaryButton';
import FormInput from '~/components/FormInput';

const schema = yup.object({
  password: yup
    .string()
    .required("Informe a nova senha.")
    .min(6, "A senha deve ter ao menos 6 caracteres."),
  confirm: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem.")
    .required("Confirme a nova senha."),
});

const ResetPasswordScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string; confirm: string }>({
    resolver: yupResolver(schema),
    defaultValues: { password: "", confirm: "" },
    mode: "onTouched",
  });
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async ({ password }: { password: string }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      Alert.alert("Senha atualizada", "Sua senha foi redefinida com sucesso.");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível atualizar a senha.");
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
            Definir nova senha
          </Text>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Nova senha"
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
                enterKeyHint="next"
                accessibilityLabel="Nova senha"
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Confirmar senha"
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
                enterKeyHint="go"
                accessibilityLabel="Confirmar senha"
                error={errors.confirm?.message}
              />
            )}
          />

          <PrimaryButton disabled={loading} onPress={handleSubmit(onSubmit)} title={loading ? 'Salvando...' : 'Salvar nova senha'} />
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
  
});

export default ResetPasswordScreen;
