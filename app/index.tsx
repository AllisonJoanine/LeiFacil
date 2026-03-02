import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Tela de entrada do app
 * Redireciona automaticamente para onboarding ou home
 */
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // O _layout.tsx já gerencia o redirecionamento
    // Esta tela é apenas um fallback
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1e3a8a" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});
