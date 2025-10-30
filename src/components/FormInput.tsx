import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

const FormInput: React.FC<Props> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} style={[styles.input, error && styles.inputError, style]} />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  field: { marginBottom: 12 },
  label: { marginBottom: 6, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', marginTop: 4, fontSize: 12 },
});

export default FormInput;

