import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
        <Stack.Screen name="createJoinScreen" options={{ 
          headerShown: true,
            headerTitle: 'Join Lobby', // This removes the title
            headerBackTitle: "back", // This removes the back button text on iOS
            headerBackButtonMenuEnabled: true // This removes the back button menu on Android/>
        }} />
        <Stack.Screen 
          name="gameScreen" 
          options={{ 
            headerShown: false,
            gestureEnabled: false, // This disables the swipe gesture
            animation: 'none' // This disables the animation when navigating to this screen
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
