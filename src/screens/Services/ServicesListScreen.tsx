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
import { supabase } from "~/services/supabaseClient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { dateFormat } from "~/utils/functions";
import { Ionicons } from "@expo/vector-icons";

interface ServiceItem {
  id: string;
  type: string;
  date: string;
  status: string;
  time?: string;
  technician?: string;
  client_id: string;
  clients?: { name: string };
  units?: { name: string };
  equipment?: { tag: string };
}

const ServicesListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ServiceItem[]>([]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select(
        `
        id,
        type,
        date,
        status,
        time,
        technician,
        client_id,
        clients (name),
        units (name),
        equipment (tag)
      `
      )
      .order("date", { ascending: false });
    setItems((data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Reload when returning from a screen that made changes
  useFocusEffect(
    React.useCallback(() => {
      const params = (navigation as any)
        .getState()
        ?.routes?.find((r: any) => r.name === "ServicesListMain")?.params;

      if (params?.refresh) {
        load();
        // Clear the refresh param
        navigation.setParams({ refresh: undefined } as never);
      }
    }, [navigation])
  );

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
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.title}>Serviços</Text>
            <Text style={styles.subtitle}>
              Crie novos serviços a partir de um cliente ou equipamento
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const getStatusColor = (status: string) => {
            const s = status?.toLowerCase();
            if (s?.includes("concluído") || s?.includes("concluido"))
              return "#10b981";
            if (s?.includes("andamento")) return "#f59e0b";
            if (s?.includes("cancelado")) return "#ef4444";
            return "#6b7280";
          };

          return (
            <Pressable
              onPress={() =>
                navigation.navigate(
                  "ServiceDetails" as never,
                  { id: item.id } as never
                )
              }
              style={styles.card}
            >
              {/* Header com tipo e status */}
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.type}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              {/* Informações principais */}
              <View style={styles.cardDetails}>
                <View style={styles.cardRow}>
                  <Ionicons name="calendar" size={16} color="#6b7280" />
                  <Text style={styles.cardInfo}>
                    {dateFormat(item.date)}
                    {item.time && ` às ${item.time}`}
                  </Text>
                </View>

                {item.clients?.name && (
                  <View style={styles.cardRow}>
                    <Ionicons name="person-circle" size={16} color="#6b7280" />
                    <Text style={styles.cardInfo}>{item.clients.name}</Text>
                  </View>
                )}

                {item.units?.name && (
                  <View style={styles.cardRow}>
                    <Ionicons name="business" size={16} color="#6b7280" />
                    <Text style={styles.cardInfo}>{item.units.name}</Text>
                  </View>
                )}

                {item.equipment?.tag && (
                  <View style={styles.cardRow}>
                    <Ionicons name="snow" size={16} color="#6b7280" />
                    <Text style={styles.cardInfo}>{item.equipment.tag}</Text>
                  </View>
                )}

                {item.technician && (
                  <View style={styles.cardRow}>
                    <Ionicons name="person" size={16} color="#6b7280" />
                    <Text style={styles.cardInfo}>
                      Técnico: {item.technician}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        }}
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
    flexDirection: "column",
    gap: 4,
    marginVertical: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
  },
  cardDetails: {
    gap: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardInfo: {
    fontSize: 14,
    color: "#374151",
  },
  cardSub: { color: "#555" },
});

export default ServicesListScreen;
