import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { hasCompletedOnboarding } from '@/utils/storage';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const completed = await hasCompletedOnboarding();
    setOnboardingComplete(completed);
    setIsLoading(false);

    // Redireciona para onboarding se não foi concluído
    if (!completed) {
      router.replace('/onboarding');
    } else {
      router.replace('/home');
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="home" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
