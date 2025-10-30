import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import ScreenContainer from "~/components/ScreenContainer";
import PrimaryButton from "~/components/PrimaryButton";
import { supabase } from "~/services/supabaseClient";
import { useNavigation } from "@react-navigation/native";

interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

const ClientsListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("clients")
      .select("id,name,phone,email")
      .order("created_at", { ascending: false });
    setClients(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ScreenContainer scroll maxWidth={960}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Clientes</Text>
        <PrimaryButton
          title="Novo cliente"
          onPress={() => navigation.navigate("AddClient" as never)}
        />
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate(
                  "ClientDetails" as never,
                  { id: item.id } as never
                )
              }
              style={styles.card}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              {!!item.email && <Text style={styles.cardSub}>{item.email}</Text>}
              {!!item.phone && <Text style={styles.cardSub}>{item.phone}</Text>}
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "600" },
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSub: { color: "#555" },
});

export default ClientsListScreen;
