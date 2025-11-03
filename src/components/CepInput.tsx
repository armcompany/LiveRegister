import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import FormInput from "./FormInput";

interface Address {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface CepInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onAddressFetched?: (address: Address) => void;
  error?: string;
  disabled?: boolean;
}

const CepInput: React.FC<CepInputProps> = ({
  label,
  value,
  onChangeText,
  onAddressFetched,
  error,
  disabled,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string>("");

  const fetchAddress = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    setLoading(true);
    setFetchError("");

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        setFetchError("CEP não encontrado");
        return;
      }

      onAddressFetched?.(data);
    } catch (err) {
      setFetchError("Erro ao buscar CEP");
      console.error("ViaCEP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCepChange = (text: string) => {
    // Format as 00000-000
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    let formatted = cleaned;
    if (cleaned.length > 5) {
      formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }

    onChangeText(formatted);

    // Auto-fetch when complete
    if (cleaned.length === 8) {
      fetchAddress(cleaned);
    }
  };

  return (
    <View>
      <FormInput
        label={label}
        placeholder="00000-000"
        value={value}
        onChangeText={handleCepChange}
        error={error || fetchError}
        editable={!disabled && !loading}
        keyboardType="numeric"
        maxLength={9}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.loadingText}>Buscando endereço...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  loadingText: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
});

export default CepInput;
