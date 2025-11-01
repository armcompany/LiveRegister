import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import ScreenContainer from "~/components/ScreenContainer";
import CustomHeader from "~/components/CustomHeader";
import PrimaryButton from "~/components/PrimaryButton";
import CollapsibleUnitCard from "~/components/CollapsibleUnitCard";
import { supabase } from "~/services/supabaseClient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Unit, Equipment } from "~/types";

const ClientDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id: string = route.params?.id;
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [equipmentsByUnit, setEquipmentsByUnit] = useState<
    Record<string, Equipment[]>
  >({});

  const load = async () => {
    setLoading(true);
    const { data: c } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();
    const { data: s } = await supabase
      .from("services")
      .select("id,type,date,status")
      .eq("client_id", id)
      .order("created_at", { ascending: false });
    const { data: u } = await supabase
      .from("units")
      .select("*")
      .eq("client_id", id)
      .order("name", { ascending: true });
    const { data: e } = await supabase
      .from("equipment")
      .select("*")
      .in(
        "unit_id",
        (u ?? []).map((unit) => unit.id)
      );

    setClient(c);
    setServices(s ?? []);
    setUnits(u ?? []);

    // Group equipment by unit_id
    const grouped: Record<string, Equipment[]> = {};
    (e ?? []).forEach((eq) => {
      if (!grouped[eq.unit_id]) {
        grouped[eq.unit_id] = [];
      }
      grouped[eq.unit_id].push(eq);
    });
    setEquipmentsByUnit(grouped);

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s?.includes("concluído") || s?.includes("concluido")) return "#10b981";
    if (s?.includes("andamento")) return "#f59e0b";
    if (s?.includes("cancelado")) return "#ef4444";
    return "#6b7280";
  };

  return (
    <ScreenContainer scroll maxWidth={720}>
      <CustomHeader title="Detalhes do Cliente" />

      {/* Client Info Card */}
      <View style={styles.card}>
        <Text style={styles.clientName}>{client?.name}</Text>

        <View style={styles.infoSection}>
          {!!client?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{client.phone}</Text>
            </View>
          )}

          {!!client?.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{client.email}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Address Card */}
      {!!client?.address && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Text style={styles.addressText}>
            {client.address.street}
            {client.address.number && `, ${client.address.number}`}
          </Text>
          <Text style={styles.addressText}>
            {client.address.city && `${client.address.city}`}
            {client.address.state && ` - ${client.address.state}`}
          </Text>
          {client.address.zip && (
            <Text style={styles.addressText}>CEP: {client.address.zip}</Text>
          )}
        </View>
      )}

      {/* Units Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Unidades de Atendimento</Text>
      </View>

      {units.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.emptyText}>
            Nenhuma unidade cadastrada ainda.
          </Text>
        </View>
      ) : (
        units.map((unit) => (
          <CollapsibleUnitCard
            key={unit.id}
            unit={unit}
            equipments={equipmentsByUnit[unit.id] ?? []}
            onAddEquipment={() => {
              // Navigate to AddEquipment
              navigation.navigate(
                "AddEquipment" as never,
                {
                  unitId: unit.id,
                  clientId: id,
                } as never
              );
            }}
            onServiceEquipment={(equipment) => {
              // Navigate to AddService with pre-filled data
              navigation.navigate(
                "ServicesList" as never,
                {
                  screen: "AddService",
                  params: {
                    clientId: id,
                    unitId: unit.id,
                    equipmentId: equipment.id,
                  },
                } as never
              );
            }}
            onEquipmentDetails={(equipment) => {
              // Navigate to EquipmentDetails
              navigation.navigate(
                "EquipmentDetails" as never,
                {
                  equipmentId: equipment.id,
                } as never
              );
            }}
          />
        ))
      )}

      <TouchableOpacity
        style={styles.addUnitButton}
        onPress={() =>
          navigation.navigate("AddUnit" as never, { clientId: id } as never)
        }
        activeOpacity={0.7}
      >
        <Text style={styles.addUnitButtonText}>+ Adicionar Unidade</Text>
      </TouchableOpacity>
      <View style={{ height: 16 }} />

      {/* Actions */}
      <PrimaryButton
        title="Novo Atendimento"
        onPress={() =>
          navigation.navigate(
            "ServicesList" as never,
            { screen: "AddService", params: { clientId: id } } as never
          )
        }
      />
      <View style={{ height: 16 }} />

      {/* Services List Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Atendimentos ({services.length})
        </Text>
        {services.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum atendimento cadastrado ainda.
          </Text>
        ) : (
          services.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.serviceItem}
              onPress={() =>
                navigation.navigate(
                  "ServicesList" as never,
                  { screen: "ServiceDetails", params: { id: s.id } } as never
                )
              }
              activeOpacity={0.7}
            >
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceTitle}>{s.type}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(s.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{s.status}</Text>
                </View>
              </View>
              <Text style={styles.serviceDate}>{s.date}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clientName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  addressText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
  serviceItem: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f9fafb",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  serviceDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  sectionHeader: {
    marginBottom: 12,
  },
  addUnitButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#2563eb",
    borderRadius: 12,
    borderStyle: "dashed",
    paddingVertical: 16,
    alignItems: "center",
  },
  addUnitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
  },
});

export default ClientDetailsScreen;
