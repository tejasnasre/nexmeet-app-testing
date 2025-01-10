import '../global.css';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import AuthProvider from '~/contexts/AuthProvider';
import { StatusBar } from 'expo-status-bar';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  console.log('Fonts loaded:', fontsLoaded); // Add this line

  if (!fontsLoaded) {
    return null;
  }
  return (
    <AuthProvider>
      <StatusBar hidden={false} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}
