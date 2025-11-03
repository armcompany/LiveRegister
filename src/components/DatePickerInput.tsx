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

interface DatePickerInputProps {
  label: string;
  value: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  error?: string;
  disabled?: boolean;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  onChange,
  error,
  disabled,
}) => {
  const [show, setShow] = useState(false);

  // Convert YYYY-MM-DD to Date object
  const getDateFromString = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Convert Date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Format for display (DD/MM/YYYY)
  const formatForDisplay = (dateStr: string): string => {
    if (!dateStr) return "Selecione uma data";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShow(Platform.OS === "ios"); // Keep open on iOS

    if (event.type === "set" && selectedDate) {
      const formattedDate = formatDate(selectedDate);
      onChange(formattedDate);
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
          {value ? formatForDisplay(value) : "Selecione uma data"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#6b7280" />
      </TouchableOpacity>
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={getDateFromString(value)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
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

export default DatePickerInput;
