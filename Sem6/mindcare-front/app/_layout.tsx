// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';

// import { useEffect } from 'react';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';

// import "../global.css"
// import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
// import { Slot } from 'expo-router'
// import { tokenCache } from '@/lib/auth'
// import * as SecureStore from 'expo-secure-store'
// import Constants from 'expo-constants';
// // const publishableKey = Constants.expoConfig?.extra?.expoKey;
// const publishableKey = "pk_test_aGFuZHktdGVybWl0ZS02OC5jbGVyay5hY2NvdW50cy5kZXYk";

// // const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;


// if (!publishableKey) {
//   throw new Error(
//     'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
//   )
// }

// function RootLayoutNav() {
//   return (
//     <ClerkProvider publishableKey={publishableKey}>
//       <ClerkLoaded>
//         <Slot />
//       </ClerkLoaded>
//     </ClerkProvider>
//   )
// }
// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
//     <ClerkLoaded>
//       <Stack>
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//         <Stack.Screen name="(root)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//     </ClerkLoaded>
//   </ClerkProvider>
//   );
// }


import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useCallback } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme"; // Ensure this is correct
import "../global.css";
import { Slot } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const hideSplashScreen = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    hideSplashScreen();
  }, [hideSplashScreen]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Slot /> {/* Ensures child screens render properly */}
    </Stack>
  );
}
