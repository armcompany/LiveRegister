import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { TechnicalDetails } from "~/types";

interface TechnicalDetailsFormProps {
  value: TechnicalDetails;
  onChange: (details: TechnicalDetails) => void;
}

const TechnicalDetailsForm: React.FC<TechnicalDetailsFormProps> = ({
  value,
  onChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  const updateMeasurement = (key: string, val: string) => {
    onChange({
      ...value,
      measurements: {
        ...value.measurements,
        [key]: val,
      },
    });
  };

  const toggleService = (service: string) => {
    const current = value.services_performed || [];
    const updated = current.includes(service)
      ? current.filter((s) => s !== service)
      : [...current, service];
    onChange({ ...value, services_performed: updated });
  };

  const addPart = () => {
    const parts = value.parts_replaced || [];
    onChange({
      ...value,
      parts_replaced: [...parts, { name: "", quantity: 1 }],
    });
  };

  const updatePart = (index: number, field: string, val: any) => {
    const parts = [...(value.parts_replaced || [])];
    parts[index] = { ...parts[index], [field]: val };
    onChange({ ...value, parts_replaced: parts });
  };

  const removePart = (index: number) => {
    const parts = value.parts_replaced?.filter((_, i) => i !== index) || [];
    onChange({ ...value, parts_replaced: parts });
  };

  const commonServices = [
    "Limpeza de filtros",
    "Limpeza de evaporador",
    "Limpeza de condensador",
    "Verificação de gás",
    "Troca de gás",
    "Verificação elétrica",
    "Lubrificação",
    "Teste de vazamento",
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.headerText}>Detalhes Técnicos</Text>
        <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {/* Measurements */}
          <Text style={styles.sectionTitle}>Medições</Text>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Pressão Sucção</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 65 psi"
                value={value.measurements?.suction_pressure || ""}
                onChangeText={(v) => updateMeasurement("suction_pressure", v)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Pressão Descarga</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 250 psi"
                value={value.measurements?.discharge_pressure || ""}
                onChangeText={(v) => updateMeasurement("discharge_pressure", v)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Temp. Sucção</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 10°C"
                value={value.measurements?.suction_temp || ""}
                onChangeText={(v) => updateMeasurement("suction_temp", v)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Temp. Descarga</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 45°C"
                value={value.measurements?.discharge_temp || ""}
                onChangeText={(v) => updateMeasurement("discharge_temp", v)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Superheat</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 5°C"
                value={value.measurements?.superheat || ""}
                onChangeText={(v) => updateMeasurement("superheat", v)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Subcooling</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 8°C"
                value={value.measurements?.subcooling || ""}
                onChangeText={(v) => updateMeasurement("subcooling", v)}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Amperagem</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: 12.5A"
              value={value.measurements?.amperage || ""}
              onChangeText={(v) => updateMeasurement("amperage", v)}
            />
          </View>

          <View style={styles.divider} />

          {/* Services Performed */}
          <Text style={styles.sectionTitle}>Serviços Realizados</Text>
          <View style={styles.checkboxGrid}>
            {commonServices.map((service) => (
              <TouchableOpacity
                key={service}
                style={styles.checkbox}
                onPress={() => toggleService(service)}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    (value.services_performed || []).includes(service) &&
                      styles.checkboxBoxChecked,
                  ]}
                >
                  {(value.services_performed || []).includes(service) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{service}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Parts Replaced */}
          <Text style={styles.sectionTitle}>Peças Substituídas</Text>
          {(value.parts_replaced || []).map((part, index) => (
            <View key={index} style={styles.partRow}>
              <TextInput
                style={[styles.input, styles.partName]}
                placeholder="Nome da peça"
                value={part.name}
                onChangeText={(v) => updatePart(index, "name", v)}
              />
              <TextInput
                style={[styles.input, styles.partQty]}
                placeholder="Qtd"
                keyboardType="numeric"
                value={part.quantity.toString()}
                onChangeText={(v) =>
                  updatePart(index, "quantity", parseInt(v) || 1)
                }
              />
              <TouchableOpacity
                style={styles.removePartButton}
                onPress={() => removePart(index)}
              >
                <Text style={styles.removePartText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addPart}>
            <Text style={styles.addButtonText}>+ Adicionar Peça</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Refrigerant */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Gás Refrigerante Adicionado</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: 0.5kg"
              value={value.refrigerant_added || ""}
              onChangeText={(v) => onChange({ ...value, refrigerant_added: v })}
            />
          </View>

          {/* Next Maintenance */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Próxima Manutenção Recomendada</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-DD"
              value={value.next_maintenance || ""}
              onChangeText={(v) => onChange({ ...value, next_maintenance: v })}
            />
          </View>
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
    marginBottom: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  chevron: {
    fontSize: 12,
    color: "#9ca3af",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  checkboxGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBoxChecked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#374151",
    flex: 1,
  },
  partRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  partName: {
    flex: 1,
  },
  partQty: {
    width: 60,
  },
  removePartButton: {
    width: 32,
    height: 32,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  removePartText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    borderStyle: "dashed",
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  },
});

export default TechnicalDetailsForm;
