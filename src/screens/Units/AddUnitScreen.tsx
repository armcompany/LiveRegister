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
  name: yup.string().required("Informe o nome da unidade."),
  street: yup.string().default(""),
  number: yup.string().default(""),
  city: yup.string().default(""),
  state: yup.string().default(""),
  zip: yup.string().default(""),
  responsible_name: yup.string().default(""),
  responsible_phone: yup.string().default(""),
  notes: yup.string().default(""),
});

type Form = yup.InferType<typeof schema>;

const AddUnitScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const clientId: string = route.params?.clientId;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      street: "",
      number: "",
      city: "",
      state: "",
      zip: "",
      responsible_name: "",
      responsible_phone: "",
      notes: "",
    },
  });

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (values: Form) => {
    try {
      setLoading(true);

      const address = {
        street: values.street,
        number: values.number,
        city: values.city,
        state: values.state,
        zip: values.zip,
      };

      const { error } = await supabase.from("units").insert({
        client_id: clientId,
        name: values.name,
        address,
        responsible_name: values.responsible_name,
        responsible_phone: values.responsible_phone,
        notes: values.notes,
      });

      if (error) throw error;

      Alert.alert("Unidade criada", "A unidade foi cadastrada com sucesso.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll maxWidth={720}>
      <CustomHeader title="Nova Unidade" />

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Nome da Unidade *"
            placeholder="Ex: Matriz, Filial Centro"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.name?.message}
          />
        )}
      />

      <Text style={styles.sectionTitle}>Endereço</Text>

      <Controller
        control={control}
        name="street"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Rua/Avenida"
            placeholder="Nome da rua"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.street?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="number"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Número"
            placeholder="Número"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.number?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Cidade"
            placeholder="Cidade"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.city?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Estado"
            placeholder="UF"
            autoCapitalize="characters"
            maxLength={2}
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.state?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="zip"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="CEP"
            placeholder="00000-000"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.zip?.message}
          />
        )}
      />

      <View style={styles.divider} />

      <Controller
        control={control}
        name="responsible_name"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Responsável pela Unidade"
            placeholder="Nome do responsável"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.responsible_name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="responsible_phone"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Telefone do Responsável"
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            error={errors.responsible_phone?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value, onBlur } }) => (
          <FormInput
            label="Observações"
            placeholder="Notas adicionais sobre a unidade"
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
        title={loading ? "Salvando..." : "Salvar Unidade"}
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
});

export default AddUnitScreen;
