import React from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import ScreenContainer from "~/components/ScreenContainer";
import CustomHeader from "~/components/CustomHeader";
import FormInput from "~/components/FormInput";
import PrimaryButton from "~/components/PrimaryButton";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "~/services/supabaseClient";
import { useNavigation, useRoute } from "@react-navigation/native";

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
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (presetClientId) setValue("client_id", presetClientId);
  }, [presetClientId]);

  const onSubmit = async (values: Form) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("services").insert(values);
      if (error) throw error;
      Alert.alert("Serviço criado", "O serviço foi cadastrado com sucesso.");
      navigation.navigate("ServicesList" as never);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll maxWidth={720}>
      <CustomHeader title="Novo Atendimento" />
      <Controller
        control={control}
        name="client_id"
        render={({ field }) => (
          <FormInput
            label="ID do cliente"
            placeholder="UUID do cliente"
            autoCapitalize="none"
            {...field}
            error={errors.client_id?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <FormInput
            label="Tipo"
            placeholder="Tipo de serviço"
            {...field}
            error={errors.type?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <FormInput
            label="Descrição"
            placeholder="Descrição"
            {...field}
            error={errors.description?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="date"
        render={({ field }) => (
          <FormInput
            label="Data"
            placeholder="AAAA-MM-DD"
            autoCapitalize="none"
            {...field}
            error={errors.date?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="time"
        render={({ field }) => (
          <FormInput
            label="Hora"
            placeholder="HH:MM"
            autoCapitalize="none"
            {...field}
            error={errors.time?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="technician"
        render={({ field }) => (
          <FormInput
            label="Técnico"
            placeholder="Responsável"
            {...field}
            error={errors.technician?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <FormInput
            label="Status"
            placeholder="Pendente / Em andamento / Concluído"
            {...field}
            error={errors.status?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <FormInput
            label="Observações"
            placeholder="Notas adicionais"
            {...field}
            error={errors.notes?.message}
          />
        )}
      />
      <PrimaryButton
        title={loading ? "Salvando..." : "Salvar"}
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default AddServiceScreen;
