import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform, SafeAreaView, KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '~/context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ScreenContainer from '~/components/ScreenContainer';
import PrimaryButton from '~/components/PrimaryButton';
import FormInput from '~/components/FormInput';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = React.useState(false);
  const { signIn } = useAuth();

  const schema = yup.object({
    email: yup.string().required('Informe seu e-mail.').email('E-mail inválido.'),
    password: yup.string().required('Informe sua senha.').min(6, 'A senha deve ter ao menos 6 caracteres.'),
  });

  const { control, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    try {
      setLoading(true);
      await signIn(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Falha no login', e?.message ?? 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
        <View style={styles.content}>
          <Text accessibilityRole={Platform.OS === 'web' ? 'header' : undefined} style={styles.title}>Entrar</Text>

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
                  textContentType="password"
                  autoComplete="current-password"
                  enterKeyHint="go"
                  accessibilityLabel="Senha"
                  error={errors.password?.message}
                />
              )}
            />

          <PrimaryButton disabled={loading} onPress={handleSubmit(onSubmit)} title={loading ? 'Entrando...' : 'Entrar'} />

          <Pressable onPress={() => navigation.navigate('EsqueciSenha' as never)} style={styles.linkRow} accessibilityRole={Platform.OS === 'web' ? 'link' : undefined}>
            <Text style={styles.linkText}>Esqueci minha senha</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Cadastro' as never)} style={styles.linkRow} accessibilityRole={Platform.OS === 'web' ? 'link' : undefined}>
            <Text style={styles.linkText}>Novo por aqui? Crie sua conta</Text>
          </Pressable>
        </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  linkRow: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#2563eb' },
});

export default LoginScreen;
