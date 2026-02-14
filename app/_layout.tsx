import { ToastOverlay } from "@/components/ui/ToastOverlay";
import { BookingProvider } from "@/contexts/BookingContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDeepLink } from "@/hooks/useDeepLinks";
import { bootstrapAuth } from "@/lib/auth/bootstrapAuth";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
  useFonts,
} from "@expo-google-fonts/poppins";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, Text, TextInput } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keep the native splash screen visible while we resolve auth
SplashScreen.preventAutoHideAsync();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppContent() {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(
    useAuthStore.persist.hasHydrated(),
  );

  useDeepLink();

  // Wait for Zustand persist hydration before bootstrapping auth
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsub;
  }, []);

  // Initialize auth, then hide splash and navigate — all in one chain
  useEffect(() => {
    if (!hasHydrated) return;

    const init = async () => {
      await bootstrapAuth();

      // Read state directly from store — don't rely on re-render
      const { user, authStep } = useAuthStore.getState();

      // Hide the native splash screen
      await SplashScreen.hideAsync();

      if (user) {
        console.log("User authenticated, redirecting to /(tabs)");
        router.replace("/(tabs)");
      } else {
        switch (authStep) {
          case "LOGIN":
            router.replace("/(auth)/login");
            break;
          case "REGISTER":
            router.replace("/(auth)/register");
            break;
          case "OTP":
            router.replace("/(auth)/otp");
            break;
          case "EMAIL_VERIFICATION":
            router.replace("/(auth)/emailVerification");
            break;
          case "FORGET_PASSWORD":
            router.replace("/(auth)/forgetPassword");
            break;
          default:
            router.replace("/(auth)/login");
            break;
        }
      }
    };

    init();
  }, [hasHydrated, router]);

  return (
    <Stack>
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const isAndroid = Platform.OS === "android";

  const [fontsLoaded, fontError] = useFonts(
    isAndroid
      ? {
          Poppins_100Thin,
          Poppins_100Thin_Italic,
          Poppins_200ExtraLight,
          Poppins_200ExtraLight_Italic,
          Poppins_300Light,
          Poppins_300Light_Italic,
          Poppins_400Regular,
          Poppins_400Regular_Italic,
          Poppins_500Medium,
          Poppins_500Medium_Italic,
          Poppins_600SemiBold,
          Poppins_600SemiBold_Italic,
          Poppins_700Bold,
          Poppins_700Bold_Italic,
          Poppins_800ExtraBold,
          Poppins_800ExtraBold_Italic,
          Poppins_900Black,
          Poppins_900Black_Italic,
        }
      : {},
  );

  // Set Poppins as the global default font for all Text and TextInput (Android only)
  useEffect(() => {
    if (!isAndroid) return;
    if (fontsLoaded || fontError) {
      const defaultStyle = { fontFamily: "Poppins_400Regular" };

      const originalTextRender = (Text as any).render;
      if (originalTextRender) {
        (Text as any).render = function (props: any, ref: any) {
          return originalTextRender.call(
            this,
            { ...props, style: [defaultStyle, props.style] },
            ref,
          );
        };
      }

      const originalTextInputRender = (TextInput as any).render;
      if (originalTextInputRender) {
        (TextInput as any).render = function (props: any, ref: any) {
          return originalTextInputRender.call(
            this,
            { ...props, style: [defaultStyle, props.style] },
            ref,
          );
        };
      }
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    // Splash screen is still visible, so just return null
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BookingProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <StatusBar style="auto" />
              <AppContent />

              <ToastOverlay />
            </ThemeProvider>
          </BookingProvider>
        </ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
