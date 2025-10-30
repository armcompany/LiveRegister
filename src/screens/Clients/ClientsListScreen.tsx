import React, { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import { Button, Card } from 'react-native-paper'
import { supabase } from '~/services/supabaseClient'
import { useNavigation } from '@react-navigation/native'

export default function ClientsListScreen() {
  const [clients, setClients] = useState<any[]>([])
  const navigation = useNavigation()

  const fetchClients = async () => {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    if (!error && data) setClients(data)
  }
  useEffect(() => { fetchClients() }, [])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button mode="contained" onPress={() => navigation.navigate('NovoCliente' as never)}>Novo Cliente</Button>
      <FlatList
        data={clients}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: 8 }} onPress={() => navigation.navigate('DetalhesCliente' as never, { client: item } as never)}>
            <Card.Title title={item.name} subtitle={item.phone} />
          </Card>
        )}
      />
    </View>
  )
}
