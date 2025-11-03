import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaintenanceIndicator from "./MaintenanceIndicator";
import { Equipment } from "~/types";

interface EquipmentMiniCardProps {
  equipment: Equipment;
  onService: () => void;
  onDetails: () => void;
}

const EquipmentMiniCard: React.FC<EquipmentMiniCardProps> = ({
  equipment,
  onService,
  onDetails,
}) => {
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
    <View style={styles.container}>
      <View style={styles.infoSection}>
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

        {equipment.type && (
          <Text style={styles.detail}>
            {equipment.type}
            {equipment.capacity_btu ? ` • ${equipment.capacity_btu} BTU` : ""}
          </Text>
        )}

        <MaintenanceIndicator
          lastMaintenance={equipment.last_maintenance}
          intervalDays={equipment.maintenance_interval_days}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={onService}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>Atender</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onDetails}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  infoSection: {
    gap: 6,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  location: {
    fontSize: 14,
    color: "#374151",
  },
  detail: {
    fontSize: 13,
    color: "#6b7280",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default EquipmentMiniCard;
