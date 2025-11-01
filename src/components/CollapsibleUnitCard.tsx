import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import EquipmentMiniCard from "./EquipmentMiniCard";
import { Unit, Equipment } from "~/types";

interface CollapsibleUnitCardProps {
  unit: Unit;
  equipments: Equipment[];
  onAddEquipment: () => void;
  onServiceEquipment: (equipment: Equipment) => void;
  onEquipmentDetails: (equipment: Equipment) => void;
}

const CollapsibleUnitCard: React.FC<CollapsibleUnitCardProps> = ({
  unit,
  equipments,
  onAddEquipment,
  onServiceEquipment,
  onEquipmentDetails,
}) => {
  const [expanded, setExpanded] = useState(false);

  const formatAddress = () => {
    if (!unit.address) return null;
    const { street, number, city, state } = unit.address;
    const parts = [];
    if (street) parts.push(street);
    if (number) parts.push(number);
    if (city) parts.push(city);
    if (state) parts.push(state);
    return parts.join(", ");
  };

  const address = formatAddress();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.unitName}>{unit.name}</Text>
          {address && <Text style={styles.address}>{address}</Text>}
        </View>

        <View style={styles.headerRight}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {equipments.length}{" "}
              {equipments.length === 1 ? "equip." : "equips."}
            </Text>
          </View>
          <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {equipments.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhum equipamento cadastrado nesta unidade.
            </Text>
          ) : (
            equipments.map((eq) => (
              <EquipmentMiniCard
                key={eq.id}
                equipment={eq}
                onService={() => onServiceEquipment(eq)}
                onDetails={() => onEquipmentDetails(eq)}
              />
            ))
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddEquipment}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+ Adicionar Equipamento</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  unitName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  address: {
    fontSize: 13,
    color: "#6b7280",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3730a3",
  },
  chevron: {
    fontSize: 12,
    color: "#9ca3af",
  },
  content: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  addButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    borderStyle: "dashed",
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
});

export default CollapsibleUnitCard;
