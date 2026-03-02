import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleStartChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/chat');
  };

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/settings');
  };

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Logo e Título */}
      <MotiView
        from={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}
        style={styles.logoContainer}
      >
        <View style={styles.logoCircle}>
          <Ionicons name="scale" size={80} color="#fbbf24" />
        </View>
        <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
          LeiFácil
        </Text>
        <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
          Seu assistente jurídico com IA
        </Text>
      </MotiView>

      {/* Botões */}
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800, delay: 200 }}
        style={styles.buttonsContainer}
      >
        <TouchableOpacity
          style={[styles.primaryButton, styles.shadowEffect]}
          onPress={handleStartChat}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubbles" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Iniciar Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            isDark ? styles.darkSecondaryButton : styles.lightSecondaryButton,
          ]}
          onPress={handleSettings}
          activeOpacity={0.8}
        >
          <Ionicons
            name="settings"
            size={20}
            color={isDark ? '#fff' : '#1e3a8a'}
            style={styles.buttonIcon}
          />
          <Text
            style={[
              styles.secondaryButtonText,
              isDark ? styles.darkText : { color: '#1e3a8a' },
            ]}
          >
            Configurações
          </Text>
        </TouchableOpacity>
      </MotiView>

      {/* Informações adicionais */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 1000, delay: 400 }}
        style={styles.infoContainer}
      >
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark" size={20} color="#10b981" />
          <Text style={[styles.infoText, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            Respostas precisas e confiáveis
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="cloud-offline" size={20} color="#3b82f6" />
          <Text style={[styles.infoText, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            Funciona offline com 1000+ leis
          </Text>
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  lightContainer: {
    backgroundColor: '#f9fafb',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  lightText: {
    color: '#111827',
  },
  darkText: {
    color: '#f9fafb',
  },
  lightSubtitle: {
    color: '#6b7280',
  },
  darkSubtitle: {
    color: '#9ca3af',
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowEffect: {
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  lightSecondaryButton: {
    borderColor: '#1e3a8a',
    backgroundColor: 'transparent',
  },
  darkSecondaryButton: {
    borderColor: '#3b82f6',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  infoContainer: {
    marginTop: 40,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
  },
});
