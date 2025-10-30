import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ScreenContainer from '~/components/ScreenContainer';
import PrimaryButton from '~/components/PrimaryButton';
import { supabase } from '~/services/supabaseClient';
import { useNavigation, useRoute } from '@react-navigation/native';

const ClientDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id: string = route.params?.id;
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    const { data: c } = await supabase.from('clients').select('*').eq('id', id).single();
    const { data: s } = await supabase.from('services').select('id,type,date,status').eq('client_id', id).order('created_at', { ascending: false });
    setClient(c);
    setServices(s ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return (
    <ScreenContainer>
      <ActivityIndicator />
    </ScreenContainer>
  );

  return (
    <ScreenContainer scroll maxWidth={720}>
      <Text style={styles.title}>{client?.name}</Text>
      {!!client?.email && <Text style={styles.sub}>{client.email}</Text>}
      {!!client?.phone && <Text style={styles.sub}>{client.phone}</Text>}
      {!!client?.address && <Text style={styles.sub}>{client.address.street}, {client.address.number} - {client.address.city}/{client.address.state} - {client.address.zip}</Text>}

      <View style={{ height: 16 }} />
      <PrimaryButton title="Novo serviço" onPress={() => navigation.navigate('AddService' as never, { clientId: id } as never)} />

      <View style={{ height: 16 }} />
      <Text style={styles.section}>Serviços</Text>
      {services.map((s) => (
        <View key={s.id} style={styles.serviceItem}>
          <Text style={styles.serviceTitle}>{s.type}</Text>
          <Text style={styles.serviceSub}>{s.date} • {s.status}</Text>
        </View>
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '600' },
  sub: { color: '#555' },
  section: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  serviceItem: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 8 },
  serviceTitle: { fontSize: 16, fontWeight: '600' },
  serviceSub: { color: '#555' },
});

export default ClientDetailsScreen;

