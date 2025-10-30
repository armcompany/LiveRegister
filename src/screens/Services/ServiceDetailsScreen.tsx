import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import ScreenContainer from "~/components/ScreenContainer";
import CustomHeader from "~/components/CustomHeader";
import { supabase } from "~/services/supabaseClient";
import { useRoute } from "@react-navigation/native";

const ServiceDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const id: string = route.params?.id;
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();
    setService(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    try {
      setStatusMessage(`Atualizando para: ${newStatus}...`);
      const { error, data } = await supabase
        .from("services")
        .update({ status: newStatus })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        setStatusMessage(`Erro: ${error.message}`);
        setTimeout(() => setStatusMessage(""), 3000);
        throw error;
      }

      console.log("Update successful, data:", data);

      // Update local state immediately
      setService({ ...service, status: newStatus });
      setStatusMessage(`Status alterado para: ${newStatus}`);

      // Clear message after 3 seconds
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e: any) {
      console.error("Error updating status:", e);
      setStatusMessage(`Erro: ${e?.message ?? "Não foi possível atualizar"}`);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const confirmStatusChange = (newStatus: string) => {
    console.log("Button pressed! New status:", newStatus);
    // Bypass confirmation for testing
    console.log("Calling updateStatus directly...");
    updateStatus(newStatus);
  };

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
    return "#6b7280"; // Pendente or other
  };

  return (
    <ScreenContainer scroll maxWidth={720}>
      <CustomHeader title="Detalhes do Atendimento" />

      {/* Main Info Card */}
      <View style={styles.card}>
        <Text style={styles.serviceType}>{service?.type}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data</Text>
            <Text style={styles.infoValue}>{service?.date || "--"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Horário</Text>
            <Text style={styles.infoValue}>{service?.time || "--"}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(service?.status) },
            ]}
          >
            <Text style={styles.statusText}>{service?.status}</Text>
          </View>
        </View>

        {!!service?.technician && (
          <View style={styles.technicianContainer}>
            <Text style={styles.infoLabel}>Técnico Responsável</Text>
            <Text style={styles.technicianName}>{service.technician}</Text>
          </View>
        )}
      </View>

      {/* Status Message */}
      {!!statusMessage && (
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>{statusMessage}</Text>
        </View>
      )}

      {/* Status Actions Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ações</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPending]}
            onPress={() => {
              console.log("Pendente button touched");
              confirmStatusChange("Pendente");
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Pendente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonProgress]}
            onPress={() => {
              console.log("Em andamento button touched");
              confirmStatusChange("Em andamento");
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Em andamento</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonCompleted]}
            onPress={() => {
              console.log("Concluído button touched");
              confirmStatusChange("Concluído");
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Concluído</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonCancelled]}
            onPress={() => {
              console.log("Cancelado button touched");
              confirmStatusChange("Cancelado");
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Cancelado</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Description Card */}
      {!!service?.description && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>{service.description}</Text>
        </View>
      )}

      {/* Notes Card */}
      {!!service?.notes && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <Text style={styles.notesText}>{service.notes}</Text>
        </View>
      )}
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
  serviceType: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  technicianContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  technicianName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
  notesText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    fontStyle: "italic",
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    flexBasis: "48%",
    flexGrow: 0,
    flexShrink: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonPending: {
    backgroundColor: "#6b7280",
  },
  actionButtonProgress: {
    backgroundColor: "#f59e0b",
  },
  actionButtonCompleted: {
    backgroundColor: "#10b981",
  },
  actionButtonCancelled: {
    backgroundColor: "#ef4444",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  messageCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
});

export default ServiceDetailsScreen;
