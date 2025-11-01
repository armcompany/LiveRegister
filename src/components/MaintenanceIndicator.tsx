import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface MaintenanceIndicatorProps {
  lastMaintenance?: string;
  intervalDays?: number;
}

const MaintenanceIndicator: React.FC<MaintenanceIndicatorProps> = ({
  lastMaintenance,
  intervalDays = 90,
}) => {
  if (!lastMaintenance) {
    return (
      <View style={styles.container}>
        <View style={[styles.indicator, styles.gray]} />
        <Text style={styles.text}>Sem registro</Text>
      </View>
    );
  }

  const lastDate = new Date(lastMaintenance);
  const today = new Date();
  const daysSince = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const percentage = (daysSince / intervalDays) * 100;

  let color = styles.green;
  let statusText = "Em dia";

  if (percentage >= 100) {
    color = styles.red;
    statusText = "Atrasada";
  } else if (percentage >= 75) {
    color = styles.yellow;
    statusText = "Próxima";
  }

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, color]} />
      <Text style={styles.text}>
        {statusText} • há {daysSince} dias
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  green: {
    backgroundColor: "#10b981",
  },
  yellow: {
    backgroundColor: "#f59e0b",
  },
  red: {
    backgroundColor: "#ef4444",
  },
  gray: {
    backgroundColor: "#9ca3af",
  },
  text: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
});

export default MaintenanceIndicator;
