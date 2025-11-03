import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

interface TimePickerInputProps {
  label: string;
  value: string; // Format: HH:MM
  onChange: (time: string) => void;
  error?: string;
  disabled?: boolean;
}

const TimePickerInput: React.FC<TimePickerInputProps> = ({
  label,
  value,
  onChange,
  error,
  disabled,
}) => {
  const [show, setShow] = useState(false);

  // Convert HH:MM to Date object (using today's date)
  const getDateFromTime = (timeStr: string): Date => {
    const now = new Date();
    if (!timeStr) return now;

    const [hours, minutes] = timeStr.split(":").map(Number);
    now.setHours(hours || 0, minutes || 0, 0, 0);
    return now;
  };

  // Convert Date to HH:MM
  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShow(Platform.OS === "ios"); // Keep open on iOS

    if (event.type === "set" && selectedDate) {
      const formattedTime = formatTime(selectedDate);
      onChange(formattedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={() => !disabled && setShow(!show)}
        disabled={disabled}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value || "Selecione um horário"}
        </Text>
        <Ionicons name="time-outline" size={20} color="#6b7280" />
      </TouchableOpacity>
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={getDateFromTime(value)}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    color: "#333",
    fontSize: 14,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  inputText: {
    fontSize: 16,
    color: "#111827",
  },
  placeholder: {
    color: "#9ca3af",
  },
  errorText: {
    color: "#ef4444",
    marginTop: 4,
    fontSize: 12,
  },
});

export default TimePickerInput;
