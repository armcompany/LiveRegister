import React from "react";
import { Pressable, Text, StyleSheet, Platform } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const PrimaryButton: React.FC<Props> = ({ title, onPress, disabled }) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={(state: any) => [
        styles.button,
        state.pressed && styles.buttonPressed,
        state.hovered && styles.buttonHover,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        boxShadow:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      },
    }),
  },
  buttonHover: Platform.select({
    web: { backgroundColor: "#1d4ed8" },
    default: {},
  }) as any,
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});

export default PrimaryButton;
