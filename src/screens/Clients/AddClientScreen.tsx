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
import { useNavigation } from "@react-navigation/native";

const schema = yup.object({
  name: yup.string().required("Informe o nome."),
  phone: yup.string().defined(),
  email: yup.string().email("E-mail inválido.").defined(),
  street: yup.string().defined(),
  number: yup.string().defined(),
  city: yup.string().defined(),
  state: yup.string().defined(),
  zip: yup.string().defined(),
});

type Form = yup.InferType<typeof schema>;

const AddClientScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      street: "",
      number: "",
      city: "",
      state: "",
      zip: "",
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
      const { error } = await supabase.from("clients").insert({
        name: values.name,
        phone: values.phone,
        email: values.email,
        address,
      });
      if (error) throw error;
      Alert.alert("Cliente criado", "O cliente foi cadastrado com sucesso.");
      reset();
      navigation.navigate("ClientsList" as never);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll maxWidth={720}>
      <CustomHeader title="Novo Cliente" />
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <FormInput
            label="Nome"
            placeholder="Nome completo"
            {...field}
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <FormInput
            label="Telefone"
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
            {...field}
            error={errors.phone?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <FormInput
            label="E-mail"
            placeholder="email@exemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            {...field}
            error={errors.email?.message}
          />
        )}
      />
      <View style={{ height: 8 }} />
      <Text style={styles.section}>Endereço</Text>
      <Controller
        control={control}
        name="street"
        render={({ field }) => (
          <FormInput
            label="Rua"
            placeholder="Rua"
            {...field}
            error={errors.street?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="number"
        render={({ field }) => (
          <FormInput
            label="Número"
            placeholder="Número"
            {...field}
            error={errors.number?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="city"
        render={({ field }) => (
          <FormInput
            label="Cidade"
            placeholder="Cidade"
            {...field}
            error={errors.city?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="state"
        render={({ field }) => (
          <FormInput
            label="Estado"
            placeholder="UF"
            {...field}
            error={errors.state?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="zip"
        render={({ field }) => (
          <FormInput
            label="CEP"
            placeholder="00000-000"
            {...field}
            error={errors.zip?.message}
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

const styles = StyleSheet.create({
  section: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 12 },
});

export default AddClientScreen;
