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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CustomHeader from "~/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";

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
      .select(
        `
        id,
        name,
        phone,
        email,
        address,
        units (count)
      `
      )
      .order("created_at", { ascending: false });
    setClients((data as any) ?? []);
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
        ?.routes?.find((r: any) => r.name === "ClientsList")?.params;

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
        data={clients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.title}>Clientes</Text>
            <PrimaryButton
              title="Novo cliente"
              onPress={() => navigation.navigate("AddClient" as never)}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
            {/* Header com nome */}
            <View style={styles.cardHeader}>
              <View style={styles.nameContainer}>
                <Ionicons name="person-circle" size={24} color="#2563eb" />
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>
              {(item as any).units && (item as any).units.length > 0 && (
                <View style={styles.unitsBadge}>
                  <Ionicons name="business" size={14} color="#6b7280" />
                  <Text style={styles.unitsBadgeText}>
                    {(item as any).units[0].count}
                  </Text>
                </View>
              )}
            </View>

            {/* Informações de contato */}
            <View style={styles.contactInfo}>
              {!!item.email && (
                <View style={styles.contactRow}>
                  <Ionicons name="mail" size={16} color="#6b7280" />
                  <Text style={styles.contactText}>{item.email}</Text>
                </View>
              )}
              {!!item.phone && (
                <View style={styles.contactRow}>
                  <Ionicons name="call" size={16} color="#6b7280" />
                  <Text style={styles.contactText}>{item.phone}</Text>
                </View>
              )}
              {!!(item as any).address?.city && (
                <View style={styles.contactRow}>
                  <Ionicons name="location" size={16} color="#6b7280" />
                  <Text style={styles.contactText}>
                    {(item as any).address.city}
                    {(item as any).address.state &&
                      ` - ${(item as any).address.state}`}
                  </Text>
                </View>
              )}
            </View>
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
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  unitsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unitsBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  contactInfo: {
    gap: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: "#374151",
  },
  cardSub: { color: "#555" },
});

export default ClientsListScreen;
