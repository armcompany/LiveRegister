import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ScreenContainer from '~/components/ScreenContainer';
import { supabase } from '~/services/supabaseClient';
import { useRoute } from '@react-navigation/native';

const ServiceDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const id: string = route.params?.id;
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').eq('id', id).single();
    setService(data);
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
      <Text style={styles.title}>{service?.type}</Text>
      <Text style={styles.sub}>{service?.date} • {service?.time ?? '--'}</Text>
      <Text style={styles.sub}>Status: {service?.status}</Text>
      {!!service?.technician && <Text style={styles.sub}>Técnico: {service.technician}</Text>}
      {!!service?.description && <Text style={styles.paragraph}>{service.description}</Text>}
      {!!service?.notes && (
        <>
          <View style={{ height: 16 }} />
          <Text style={styles.section}>Observações</Text>
          <Text style={styles.paragraph}>{service.notes}</Text>
        </>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '600' },
  sub: { color: '#555', marginTop: 4 },
  section: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  paragraph: { marginTop: 8, color: '#111' },
});

export default ServiceDetailsScreen;

