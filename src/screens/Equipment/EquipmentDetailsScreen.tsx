import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ScreenContainer from "~/components/ScreenContainer";
import CustomHeader from "~/components/CustomHeader";
import PrimaryButton from "~/components/PrimaryButton";
import MaintenanceIndicator from "~/components/MaintenanceIndicator";
import { supabase } from "~/services/supabaseClient";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { Equipment } from "~/types";
import { Ionicons } from "@expo/vector-icons";
import { dateFormat } from "~/utils/functions";

const EquipmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const equipmentId: string = route.params?.equipmentId;

  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [services, setServices] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    const { data: eq } = await supabase
      .from("equipment")
      .select("*")
      .eq("id", equipmentId)
      .single();

    const { data: srv } = await supabase
      .from("services")
      .select("id,type,date,status,technician")
      .eq("equipment_id", equipmentId)
      .order("date", { ascending: false });

    setEquipment(eq);
    setServices(srv ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [equipmentId]);

  // Reload when returning from a screen that made changes
  useFocusEffect(
    React.useCallback(() => {
      const params = (navigation as any)
        .getState()
        ?.routes?.find((r: any) => r.name === "EquipmentDetails")?.params;

      if (params?.refresh) {
        load();
        // Clear the refresh param
        navigation.setParams({ refresh: undefined } as never);
      }
    }, [navigation])
  );

  if (loading)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );

  if (!equipment) {
    return (
      <ScreenContainer>
        <CustomHeader title="Equipamento" />
        <Text style={styles.errorText}>Equipamento não encontrado.</Text>
      </ScreenContainer>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "#10b981";
      case "Inativo":
        return "#6b7280";
      case "Manutenção":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <ScreenContainer scroll maxWidth={720}>
      {/* <CustomHeader title="Detalhes do Equipamento" /> */}

      {/* Equipment Info Card */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.tag}>{equipment.tag}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(equipment.status) },
            ]}
          >
            <Text style={styles.statusText}>{equipment.status}</Text>
          </View>
        </View>

        {equipment.location && (
          <Text style={styles.location}>{equipment.location}</Text>
        )}

        <View style={styles.divider} />

        <MaintenanceIndicator
          lastMaintenance={equipment.last_maintenance}
          intervalDays={equipment.maintenance_interval_days}
        />
      </View>

      {/* Technical Specs Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Especificações Técnicas</Text>

        {equipment.type && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Tipo:</Text>
            <Text style={styles.specValue}>{equipment.type}</Text>
          </View>
        )}

        {equipment.brand && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Marca:</Text>
            <Text style={styles.specValue}>{equipment.brand}</Text>
          </View>
        )}

        {equipment.model && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Modelo:</Text>
            <Text style={styles.specValue}>{equipment.model}</Text>
          </View>
        )}

        {equipment.capacity_btu && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Capacidade:</Text>
            <Text style={styles.specValue}>{equipment.capacity_btu} BTU</Text>
          </View>
        )}

        {equipment.voltage && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Voltagem:</Text>
            <Text style={styles.specValue}>{equipment.voltage}</Text>
          </View>
        )}

        {equipment.refrigerant_type && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Gás Refrigerante:</Text>
            <Text style={styles.specValue}>{equipment.refrigerant_type}</Text>
          </View>
        )}

        {equipment.serial_number && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Nº Série:</Text>
            <Text style={styles.specValue}>{equipment.serial_number}</Text>
          </View>
        )}

        {equipment.installation_date && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Instalação:</Text>
            <Text style={styles.specValue}>
              {dateFormat(equipment.installation_date)}
            </Text>
          </View>
        )}

        {equipment.warranty_expiry && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Garantia até:</Text>
            <Text style={styles.specValue}>
              {dateFormat(equipment.warranty_expiry)}
            </Text>
          </View>
        )}

        {equipment.notes && (
          <>
            <View style={styles.divider} />
            <Text style={styles.specLabel}>Observações:</Text>
            <Text style={styles.notes}>{equipment.notes}</Text>
          </>
        )}
      </View>

      {/* Action Button */}
      <PrimaryButton
        title="Criar Atendimento"
        onPress={() =>
          navigation.navigate(
            "AddService" as never,
            {
              equipmentId: equipment.id,
              unitId: equipment.unit_id,
            } as never
          )
        }
      />
      <View style={{ height: 16 }} />

      {/* Service History Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Histórico de Manutenções ({services.length})
        </Text>
        {services.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhuma manutenção registrada ainda.
          </Text>
        ) : (
          services.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.serviceItem}
              onPress={() =>
                navigation.navigate(
                  "ServiceDetails" as never,
                  { id: s.id } as never
                )
              }
              activeOpacity={0.7}
            >
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceType}>{s.type}</Text>
                <View style={styles.iconTextRow}>
                  <Ionicons name="calendar" size={14} color="#6b7280" />
                  <Text style={styles.serviceDate}>{dateFormat(s.date)}</Text>
                </View>
              </View>
              {s.technician && (
                <View style={styles.iconTextRow}>
                  <Ionicons name="person" size={14} color="#6b7280" />
                  <Text style={styles.serviceTech}>
                    Técnico: {s.technician}
                  </Text>
                </View>
              )}
              <Text style={styles.serviceStatus}>Status: {s.status}</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tag: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  location: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  specRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    width: 140,
  },
  specValue: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  notes: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 4,
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
    marginBottom: 6,
  },
  serviceType: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  serviceDate: {
    fontSize: 13,
    color: "#6b7280",
  },
  serviceTech: {
    fontSize: 13,
    color: "#6b7280",
  },
  serviceStatus: {
    fontSize: 13,
    color: "#6b7280",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginTop: 32,
  },
});

export default EquipmentDetailsScreen;
