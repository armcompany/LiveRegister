import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ScreenContainer from '~/components/ScreenContainer';
import PrimaryButton from '~/components/PrimaryButton';
import { useAuth } from '~/context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e: any) {
      Alert.alert('Erro', e?.message ?? 'Não foi possível sair.');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{user?.email ?? '-'}</Text>
        </View>
        <PrimaryButton title="Sair" onPress={handleSignOut} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 720, alignSelf: 'center' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, backgroundColor: '#fff', marginBottom: 16 },
  label: { color: '#555', marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '500' },
});

export default ProfileScreen;

