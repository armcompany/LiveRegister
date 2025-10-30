import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, View, StyleSheet, ScrollView, ScrollViewProps } from 'react-native';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  maxWidth?: number;
  style?: any;
  contentStyle?: any;
}

const ScreenContainer: React.FC<Props> = ({ children, scroll = false, maxWidth = 420, style, contentStyle }) => {
  const Content = scroll ? ScrollView : View;
  const contentProps = (scroll ? { keyboardShouldPersistTaps: 'handled' } : {}) as ScrollViewProps;
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.kav}>
        <Content {...contentProps} contentContainerStyle={scroll ? [styles.contentContainer, { maxWidth }, contentStyle] : undefined} style={!scroll ? [styles.content, { maxWidth }, contentStyle] : undefined}>
          {children}
        </Content>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  kav: { flex: 1 },
  content: { flex: 1, width: '100%', alignSelf: 'center', paddingHorizontal: 16, justifyContent: 'center' },
  contentContainer: { width: '100%', alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 16 },
});

export default ScreenContainer;

