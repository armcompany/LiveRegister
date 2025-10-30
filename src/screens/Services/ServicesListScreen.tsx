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
import CustomHeader from "~/components/CustomHeader";

interface ServiceItem {
  id: string;
  type: string;
  date: string;
  status: string;
  client_id: string;
}

const ServicesListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ServiceItem[]>([]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select("id,type,date,status,client_id")
      .order("date", { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator style={{ marginTop: 20 }} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer maxWidth={960}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.title}>Serviços</Text>
            <PrimaryButton
              title="Novo serviço"
              onPress={() => navigation.navigate("AddService" as never)}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate(
                "ServiceDetails" as never,
                { id: item.id } as never
              )
            }
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.type}</Text>
            <Text style={styles.cardSub}>
              {item.date} • {item.status}
            </Text>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 24,
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

export default ServicesListScreen;
