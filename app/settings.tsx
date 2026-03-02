import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  useColorScheme,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  getTheme,
  setTheme,
  isSoundEnabled,
  setSoundEnabled,
  resetOnboarding,
  isPremium,
  clearChatHistory,
} from '@/utils/storage';
import { purchasePremium, restorePurchases, getPremiumBenefits } from '@/services/premiumService';

export default function SettingsScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const isDark = currentTheme === 'dark' || (currentTheme === null && systemColorScheme === 'dark');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const theme = await getTheme();
    const sound = await isSoundEnabled();
    const premium = await isPremium();

    setCurrentTheme(theme);
    setSoundEnabledState(sound);
    setIsPremiumUser(premium);
  };

  const toggleTheme = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newTheme = isDark ? 'light' : 'dark';
    await setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const toggleSound = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setSoundEnabled(value);
    setSoundEnabledState(value);
  };

  const handleResetTutorial = async () => {
    Alert.alert(
      'Restaurar Tutorial',
      'Deseja ver o tutorial inicial novamente?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            await resetOnboarding();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const handleClearHistory = async () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja apagar todo o histórico de conversas?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await clearChatHistory();
            Alert.alert('Sucesso', 'Histórico apagado com sucesso!');
          },
        },
      ]
    );
  };

  const handlePurchasePremium = async () => {
    const benefits = getPremiumBenefits();
    const benefitsText = benefits.map((b, i) => `${i + 1}. ${b}`).join('\n');

    Alert.alert(
      '⭐ LeiFácil Premium',
      `Por apenas R$ 35,00/ano você terá:\n\n${benefitsText}\n\nDeseja continuar?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Assinar Agora',
          onPress: async () => {
            const success = await purchasePremium();
            if (success) {
              setIsPremiumUser(true);
              Alert.alert('Sucesso! 🎉', 'Você agora é um usuário Premium!');
            } else {
              Alert.alert('Erro', 'Não foi possível processar a assinatura. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  const handleRestorePurchases = async () => {
    const restored = await restorePurchases();
    if (restored) {
      setIsPremiumUser(true);
      Alert.alert('Sucesso', 'Compras restauradas com sucesso!');
    } else {
      Alert.alert('Aviso', 'Nenhuma compra anterior encontrada.');
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      {/* Header */}
      <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#1e3a8a'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
          Configurações
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Premium Section */}
        {!isPremiumUser && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.premiumBanner}
              onPress={handlePurchasePremium}
              activeOpacity={0.8}
            >
              <Ionicons name="star" size={32} color="#fbbf24" />
              <View style={styles.premiumTextContainer}>
                <Text style={styles.premiumTitle}>Assine o Premium</Text>
                <Text style={styles.premiumSubtitle}>
                  Mensagens ilimitadas por R$ 35/ano
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {isPremiumUser && (
          <View style={styles.section}>
            <View style={[styles.premiumBadge, isDark ? styles.darkCard : styles.lightCard]}>
              <Ionicons name="star" size={24} color="#fbbf24" />
              <Text style={[styles.premiumActiveText, isDark ? styles.darkText : styles.lightText]}>
                Você é Premium! 🎉
              </Text>
            </View>
          </View>
        )}

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            Aparência
          </Text>

          <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={22}
                  color={isDark ? '#fbbf24' : '#1e3a8a'}
                />
                <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
                  Modo Escuro
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#d1d5db', true: '#1e3a8a' }}
                thumbColor={isDark ? '#fbbf24' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* Audio Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            Áudio
          </Text>

          <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name={soundEnabled ? 'volume-high' : 'volume-mute'}
                  size={22}
                  color={isDark ? '#fff' : '#1e3a8a'}
                />
                <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
                  Sons do App
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={toggleSound}
                trackColor={{ false: '#d1d5db', true: '#1e3a8a' }}
                thumbColor={soundEnabled ? '#fbbf24' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            Dados
          </Text>

          <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
            <TouchableOpacity style={styles.settingItem} onPress={handleClearHistory}>
              <View style={styles.settingLeft}>
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
                <Text style={[styles.settingText, { color: '#ef4444' }]}>
                  Limpar Histórico de Chat
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tutorial Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            Tutorial
          </Text>

          <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
            <TouchableOpacity style={styles.settingItem} onPress={handleResetTutorial}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="refresh-outline"
                  size={22}
                  color={isDark ? '#fff' : '#1e3a8a'}
                />
                <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
                  Restaurar Tutorial Inicial
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Purchase Section */}
        {!isPremiumUser && (
          <View style={styles.section}>
            <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
              <TouchableOpacity style={styles.settingItem} onPress={handleRestorePurchases}>
                <View style={styles.settingLeft}>
                  <Ionicons
                    name="download-outline"
                    size={22}
                    color={isDark ? '#fff' : '#1e3a8a'}
                  />
                  <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
                    Restaurar Compras
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Links Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            Informações
          </Text>

          <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => openLink('mailto:allisonjoanine@gmail.com')}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="mail-outline" size={22} color={isDark ? '#fff' : '#1e3a8a'} />
                <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
                  Contato
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => openLink('https://instagram.com/allisondeveloper_')}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="logo-instagram" size={22} color={isDark ? '#fff' : '#1e3a8a'} />
                <Text style={[styles.settingText, isDark ? styles.darkText : styles.lightText]}>
                  Instagram
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            LeiFácil v1.0
          </Text>
          <Text style={[styles.versionText, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            Desenvolvido por Allison Joanine
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#f9fafb',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  lightHeader: {
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  darkHeader: {
    borderBottomColor: '#374151',
    backgroundColor: '#1f2937',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  lightCard: {
    backgroundColor: '#fff',
  },
  darkCard: {
    backgroundColor: '#1f2937',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginLeft: 50,
  },
  premiumBanner: {
    backgroundColor: '#1e3a8a',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  premiumSubtitle: {
    color: '#e5e7eb',
    fontSize: 14,
  },
  premiumBadge: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumActiveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 4,
  },
  versionText: {
    fontSize: 12,
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
});
