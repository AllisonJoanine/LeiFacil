import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useRouter } from 'expo-router';
import { setOnboardingCompleted } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  const handleDone = async () => {
    await setOnboardingCompleted();
    router.replace('/home');
  };

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
      pages={[
        {
          backgroundColor: '#1e3a8a',
          image: (
            <View style={styles.imageContainer}>
              <Ionicons name="book" size={120} color="#fbbf24" />
            </View>
          ),
          title: 'Bem-vindo ao LeiFácil',
          subtitle:
            'Seu assistente jurídico com inteligência artificial. Entenda leis e direitos de forma simples e acessível.',
        },
        {
          backgroundColor: '#1e40af',
          image: (
            <View style={styles.imageContainer}>
              <Ionicons name="chatbubbles" size={120} color="#fbbf24" />
            </View>
          ),
          title: 'Chat Inteligente',
          subtitle:
            'Faça perguntas jurídicas e receba respostas precisas. Nossa IA está treinada para te ajudar com diversos temas do direito.',
        },
        {
          backgroundColor: '#1d4ed8',
          image: (
            <View style={styles.imageContainer}>
              <Ionicons name="cloud-offline" size={120} color="#fbbf24" />
            </View>
          ),
          title: 'Funciona Offline',
          subtitle:
            'Acesse mais de 1000 leis mesmo sem internet. Consulte nossa base local de legislação a qualquer momento.',
        },
        {
          backgroundColor: '#2563eb',
          image: (
            <View style={styles.imageContainer}>
              <Ionicons name="star" size={120} color="#fbbf24" />
            </View>
          ),
          title: 'Premium sem Limites',
          subtitle:
            'Usuários gratuitos têm 6 mensagens por dia. Assine o Premium por R$ 35/ano e tenha acesso ilimitado sem anúncios!',
        },
      ]}
      showSkip={true}
      skipLabel="Pular"
      nextLabel="Próximo"
      doneLabel="Começar"
      bottomBarHighlight={false}
      containerStyles={styles.container}
      titleStyles={styles.title}
      subTitleStyles={styles.subtitle}
      imageContainerStyles={styles.imageWrapper}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    height: 200,
  },
  imageWrapper: {
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 24,
  },
});
