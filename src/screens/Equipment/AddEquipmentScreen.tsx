import React from "react";
import { View, Alert, StyleSheet, Text } from "react-native";
import ScreenContainer from "~/components/ScreenContainer";
import CustomHeader from "~/components/CustomHeader";
import FormInput from "~/components/FormInput";
import DatePickerInput from "~/components/DatePickerInput";
import PrimaryButton from "~/components/PrimaryButton";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "~/services/supabaseClient";
import { useNavigation, useRoute } from "@react-navigation/native";

const schema = yup.object({
  tag: yup.string().required("Informe a TAG do equipamento."),
  location: yup.string().default(""),
  brand: yup.string().default(""),
  model: yup.string().default(""),
  type: yup.string().default(""),
  capacity_btu: yup.string().default(""),
  serial_number: yup.string().default(""),
  installation_date: yup.string().default(""),
  warranty_expiry: yup.string().default(""),
  maintenance_interval_days: yup.string().default("90"),
  refrigerant_type: yup.string().default(""),
  voltage: yup.string().default(""),
  status: yup.string().required("Informe o status."),
  notes: yup.string().default(""),
});

type Form = yup.InferType<typeof schema>;

const AddEquipmentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const unitId: string = route.params?.unitId;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: {
      tag: "",
      location: "",
      brand: "",
      model: "",
      type: "",
      capacity_btu: "",
      serial_number: "",
      installation_date: "",
      warranty_expiry: "",
      maintenance_interval_days: "90",
      refrigerant_type: "",
      voltage: "",
      status: "Ativo",
      notes: "",
    },
  });

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (values: Form) => {
    try {
      setLoading(true);

      const { error } = await supabase.from("equipment").insert({
        unit_id: unitId,
        tag: values.tag,
        location: values.location,
        brand: values.brand,
        model: values.model,
        type: values.type,
        capacity_btu: values.capacity_btu
          ? parseInt(values.capacity_btu)
          : null,
        serial_number: values.serial_number,
        installation_date: values.installation_date || null,
        warranty_expiry: values.warranty_expiry || null,
        maintenance_interval_days: parseInt(
          values.maintenance_interval_days || "90"
        ),
        refrigerant_type: values.refrigerant_type,
        voltage: values.voltage,
        status: values.status,
        notes: values.notes,
        photos: [],
      });

      if (error) throw error;

      Alert.alert(
        "Equipamento criado",
        "O equipamento foi cadastrado com sucesso."
      );

      // Get clientId from route params to navigate back to ClientDetails
      const clientId = route.params?.clientId;
      if (clientId) {
        navigation.navigate(
          "ClientDetails" as never,
          { id: clientId, refresh: true } as never
        );
      } else {
        navigation.goBack();
      }
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll maxWidth={720}>
      {/* <CustomHeader title="Novo Equipamento" /> */}

      <Text style={styles.sectionHeader}>Identificação</Text>

      <Controller
        control={control}
        name="tag"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="TAG do Equipamento *"
            placeholder="Ex: AC-001, SPLIT-SALA-01"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.tag?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="location"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Localização"
            placeholder="Ex: Sala de Reuniões, 2º Andar"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.location?.message}
          />
        )}
      />

      <View style={styles.divider} />
      <Text style={styles.sectionHeader}>Especificações Técnicas</Text>

      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Tipo"
            placeholder="Split / Window / Central / Cassete / Piso Teto"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.type?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="brand"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Marca"
            placeholder="Ex: LG, Samsung, Carrier"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.brand?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="model"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Modelo"
            placeholder="Modelo do equipamento"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.model?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="capacity_btu"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Capacidade (BTU)"
            placeholder="Ex: 12000, 18000, 24000"
            keyboardType="numeric"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.capacity_btu?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="voltage"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Voltagem"
            placeholder="110V / 220V / 380V"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.voltage?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="refrigerant_type"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Tipo de Gás Refrigerante"
            placeholder="Ex: R410A, R32, R22"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.refrigerant_type?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="serial_number"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Número de Série"
            placeholder="Número de série do fabricante"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.serial_number?.message}
          />
        )}
      />

      <View style={styles.divider} />
      <Text style={styles.sectionHeader}>Datas e Manutenção</Text>

      <Controller
        control={control}
        name="installation_date"
        render={({ field: { onChange, value } }) => (
          <DatePickerInput
            label="Data de Instalação"
            value={value}
            onChange={onChange}
            error={errors.installation_date?.message}
            disabled={loading}
          />
        )}
      />

      <Controller
        control={control}
        name="warranty_expiry"
        render={({ field: { onChange, value } }) => (
          <DatePickerInput
            label="Vencimento da Garantia"
            value={value}
            onChange={onChange}
            error={errors.warranty_expiry?.message}
            disabled={loading}
          />
        )}
      />

      <Controller
        control={control}
        name="maintenance_interval_days"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Intervalo de Manutenção (dias)"
            placeholder="Ex: 90, 180"
            keyboardType="numeric"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.maintenance_interval_days?.message}
          />
        )}
      />

      <View style={styles.divider} />

      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Status *"
            placeholder="Ativo / Inativo / Manutenção"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.status?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Observações"
            placeholder="Notas adicionais sobre o equipamento"
            multiline
            numberOfLines={3}
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.notes?.message}
          />
        )}
      />

      <PrimaryButton
        title={loading ? "Salvando..." : "Salvar Equipamento"}
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 20,
  },
});

export default AddEquipmentScreen;
