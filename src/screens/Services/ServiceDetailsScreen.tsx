import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import ScreenContainer from "~/components/ScreenContainer";
import { supabase } from "~/services/supabaseClient";
import {
  useRoute,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { dateFormat } from "~/utils/functions";
import { Ionicons } from "@expo/vector-icons";

const ServiceDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id: string = route.params?.id;
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select(
        `
        *,
        clients (name),
        units (name),
        equipment (tag, location)
      `
      )
      .eq("id", id)
      .single();
    setService(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  // Reload when returning from a screen that made changes
  useFocusEffect(
    React.useCallback(() => {
      const params = (navigation as any)
        .getState()
        ?.routes?.find((r: any) => r.name === "ServiceDetails")?.params;

      if (params?.refresh) {
        load();
        // Clear the refresh param
        navigation.setParams({ refresh: undefined } as never);
      }
    }, [navigation])
  );

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
      {/* <CustomHeader title="Detalhes do Atendimento" /> */}

      {/* Context Card */}
      {(service?.clients || service?.units || service?.equipment) && (
        <View style={styles.contextCard}>
          <Text style={styles.contextTitle}>Informações do Atendimento</Text>
          {service?.clients?.name && (
            <View style={styles.contextRow}>
              <Ionicons name="person-circle" size={20} color="#1e40af" />
              <Text style={styles.contextItem}>
                Cliente: {service.clients.name}
              </Text>
            </View>
          )}
          {service?.units?.name && (
            <View style={styles.contextRow}>
              <Ionicons name="business" size={20} color="#1e40af" />
              <Text style={styles.contextItem}>
                Unidade: {service.units.name}
              </Text>
            </View>
          )}
          {service?.equipment?.tag && (
            <View style={styles.contextRow}>
              <Ionicons name="snow" size={20} color="#1e40af" />
              <Text style={styles.contextItem}>
                Equipamento: {service.equipment.tag}
              </Text>
            </View>
          )}
          {service?.equipment?.location && (
            <View style={styles.contextRow}>
              <Ionicons name="location" size={20} color="#1e40af" />
              <Text style={styles.contextItem}>
                Local: {service.equipment.location}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Main Info Card */}
      <View style={styles.card}>
        <Text style={styles.serviceType}>{service?.type}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data</Text>
            <Text style={styles.infoValue}>
              {dateFormat(service?.date) || "--"}
            </Text>
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

      {/* Photos Card */}
      {service?.photos && service.photos.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Fotos ({service.photos.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.photosContainer}>
              {service.photos.map((photoUri: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: photoUri }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Technical Details Card */}
      {service?.technical_details &&
        Object.keys(service.technical_details).length > 0 && (
          <View style={styles.card}>
            <View style={styles.technicalHeader}>
              <Ionicons name="build" size={26} color="#2563eb" />
              <Text style={styles.sectionTitle}>
                Detalhes Técnicos da Manutenção
              </Text>
            </View>
            <View style={styles.technicalGrid}>
              {Object.entries(service.technical_details).map(
                ([key, value]: [string, any]) => {
                  // Format the value based on type
                  let displayValue = "--";

                  if (value === null || value === undefined) {
                    displayValue = "--";
                  } else if (Array.isArray(value)) {
                    // Handle arrays (like MEASUREMENTS, PARTS_REPLACED)
                    displayValue =
                      value.length > 0
                        ? value
                            .map((item, index) =>
                              typeof item === "object"
                                ? Object.entries(item)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(", ")
                                : item
                            )
                            .join("\n")
                        : "--";
                  } else if (typeof value === "object") {
                    // Handle objects
                    displayValue = Object.entries(value)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join("\n");
                  } else {
                    displayValue = value.toString();
                  }

                  return (
                    <View key={key} style={styles.technicalItem}>
                      <Text style={styles.technicalLabel}>
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Text>
                      <Text style={styles.technicalValue}>{displayValue}</Text>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contextCard: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contextTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: 8,
  },
  contextRow: {
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contextItem: {
    fontSize: 14,
    color: "#1e40af",
  },
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
  photosContainer: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 16,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    minWidth: 140,
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  technicalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  technicalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  technicalItem: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    minWidth: "48%",
    flexGrow: 1,
  },
  technicalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  technicalValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
});

export default ServiceDetailsScreen;
