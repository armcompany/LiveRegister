import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import ScreenContainer from "~/components/ScreenContainer";
import CustomHeader from "~/components/CustomHeader";
import FormInput from "~/components/FormInput";
import PrimaryButton from "~/components/PrimaryButton";
import PhotoUploader from "~/components/PhotoUploader";
import TechnicalDetailsForm from "~/components/TechnicalDetailsForm";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "~/services/supabaseClient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TechnicalDetails } from "~/types";

const schema = yup.object({
  client_id: yup.string().required("Selecione o cliente."),
  type: yup.string().required("Informe o tipo."),
  description: yup.string().default(""),
  date: yup.string().required("Informe a data (AAAA-MM-DD)."),
  time: yup.string().default(""),
  technician: yup.string().default(""),
  status: yup.string().required("Informe o status."),
  notes: yup.string().default(""),
});

type Form = yup.InferType<typeof schema>;

const AddServiceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const presetClientId: string | undefined = route.params?.clientId;
  const presetUnitId: string | undefined = route.params?.unitId;
  const presetEquipmentId: string | undefined = route.params?.equipmentId;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [technicalDetails, setTechnicalDetails] = useState<TechnicalDetails>(
    {}
  );

  // Contextual data when coming from equipment
  const [clientName, setClientName] = useState<string>("");
  const [unitName, setUnitName] = useState<string>("");
  const [equipmentTag, setEquipmentTag] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: {
      client_id: presetClientId ?? "",
      type: "",
      description: "",
      date: "",
      time: "",
      technician: "",
      status: "Pendente",
      notes: "",
    },
  });

  useEffect(() => {
    if (presetClientId) setValue("client_id", presetClientId);
    loadContextData();
  }, [presetClientId, presetUnitId, presetEquipmentId]);

  const loadContextData = async () => {
    if (!presetEquipmentId) return;

    setLoadingData(true);
    try {
      // Load equipment data
      const { data: equipment } = await supabase
        .from("equipment")
        .select("tag, unit_id")
        .eq("id", presetEquipmentId)
        .single();

      if (equipment) {
        setEquipmentTag(equipment.tag);

        // Load unit data
        const { data: unit } = await supabase
          .from("units")
          .select("name, client_id")
          .eq("id", equipment.unit_id)
          .single();

        if (unit) {
          setUnitName(unit.name);

          // Load client data
          const { data: client } = await supabase
            .from("clients")
            .select("name")
            .eq("id", unit.client_id)
            .single();

          if (client) {
            setClientName(client.name);
            setValue("client_id", unit.client_id);
          }
        }
      }
    } catch (error: any) {
      console.error("Error loading context data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (values: Form) => {
    try {
      setLoading(true);

      const serviceData = {
        ...values,
        unit_id: presetUnitId || null,
        equipment_id: presetEquipmentId || null,
        photos: photos.length > 0 ? photos : null,
        technical_details:
          Object.keys(technicalDetails).length > 0 ? technicalDetails : null,
      };

      const { error } = await supabase.from("services").insert(serviceData);

      if (error) throw error;

      // Update last_maintenance on equipment if equipment_id is present
      if (presetEquipmentId) {
        await supabase
          .from("equipment")
          .update({ last_maintenance: values.date })
          .eq("id", presetEquipmentId);
      }

      Alert.alert("Serviço criado", "O serviço foi cadastrado com sucesso.");
      navigation.navigate("ServicesList" as never);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  const isPrefilled = !!presetEquipmentId;

  return (
    <ScreenContainer scroll maxWidth={720}>
      <CustomHeader title="Novo Atendimento" />

      {loadingData ? (
        <Text style={styles.loadingText}>Carregando dados...</Text>
      ) : (
        <>
          {/* Pre-filled context display */}
          {isPrefilled && (
            <View style={styles.contextCard}>
              <Text style={styles.contextTitle}>Atendimento para:</Text>
              {clientName && (
                <Text style={styles.contextItem}>👤 Cliente: {clientName}</Text>
              )}
              {unitName && (
                <Text style={styles.contextItem}>🏢 Unidade: {unitName}</Text>
              )}
              {equipmentTag && (
                <Text style={styles.contextItem}>
                  ❄️ Equipamento: {equipmentTag}
                </Text>
              )}
            </View>
          )}

          {/* Client ID - only editable if not pre-filled */}
          {!isPrefilled && (
            <Controller
              control={control}
              name="client_id"
              render={({ field: { onChange, value, onBlur } }) => (
                <FormInput
                  label="ID do cliente"
                  placeholder="UUID do cliente"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors.client_id?.message}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value, onBlur } }) => (
              <FormInput
                label="Tipo"
                placeholder="Manutenção / Instalação / Reparo"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.type?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value, onBlur } }) => (
              <FormInput
                label="Descrição"
                placeholder="Descrição do serviço"
                multiline
                numberOfLines={2}
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.description?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value, onBlur } }) => (
              <FormInput
                label="Data"
                placeholder="AAAA-MM-DD"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.date?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="time"
            render={({ field: { onChange, value, onBlur } }) => (
              <FormInput
                label="Hora"
                placeholder="HH:MM"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.time?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="technician"
            render={({ field: { onChange, value, onBlur } }) => (
              <FormInput
                label="Técnico"
                placeholder="Responsável"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.technician?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value, onBlur } }) => (
              <FormInput
                label="Status"
                placeholder="Pendente / Em andamento / Concluído"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.status?.message}
              />
            )}
          />

          {/* Photo Uploader */}
          <PhotoUploader photos={photos} onPhotosChange={setPhotos} />

          {/* Technical Details Form */}
          {presetEquipmentId && (
            <TechnicalDetailsForm
              value={technicalDetails}
              onChange={setTechnicalDetails}
            />
          )}

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value, onBlur } }) => (
              <FormInput
                label="Observações"
                placeholder="Notas adicionais"
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
            title={loading ? "Salvando..." : "Salvar"}
            disabled={loading || loadingData}
            onPress={handleSubmit(onSubmit)}
          />
        </>
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
  contextItem: {
    fontSize: 14,
    color: "#1e40af",
    marginBottom: 4,
  },
  loadingText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    paddingVertical: 20,
  },
});

export default AddServiceScreen;
