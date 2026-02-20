import { ToastOverlay } from "@/components/ui/ToastOverlay";
import { BookingProvider } from "@/contexts/BookingContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDeepLink } from "@/hooks/useDeepLinks";
import { bootstrapAuth } from "@/lib/auth/bootstrapAuth";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, TextInput } from "react-native";
import { PaystackProvider } from 'react-native-paystack-webview';
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";


const FONT_PATCH_FLAG = "__washub_font_patch_applied__";

const getFontFamilyFromWeight = (fontWeight?: string) => {
  switch (fontWeight) {
    case "500":
      return "Inter_500Medium";
    case "600":
      return "PlusJakartaSans_600SemiBold";
    case "700":
    case "bold":
      return "PlusJakartaSans_700Bold";
    case "800":
    case "900":
      return "PlusJakartaSans_800ExtraBold";
    case "400":
    default:
      return "Inter_400Regular";
  }
};

const normalizeTextStyle = (style: any): any => {
  if (!style) return style;

  if (Array.isArray(style)) {
    return style.map(normalizeTextStyle);
  }

  if (typeof style === "object") {
    const normalized: Record<string, any> = { ...style };
    if (!normalized.fontFamily && normalized.fontWeight) {
      normalized.fontFamily = getFontFamilyFromWeight(
        String(normalized.fontWeight),
      );
      delete normalized.fontWeight;
    }
    return normalized;
  }

  return style;
};

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

  console.log("Color scheme:", colorScheme);
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Set Inter as default and map fontWeight to Inter/Plus Jakarta Sans globally
  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    const globalScope = globalThis as any;
    if (globalScope[FONT_PATCH_FLAG]) return;

    const defaultStyle = { fontFamily: "Inter_400Regular" };
    const TextComponent = Text as any;
    const TextInputComponent = TextInput as any;

    const originalTextRender = TextComponent.render;
    if (originalTextRender) {
      TextComponent.render = function (props: any, ref: any) {
        return originalTextRender.call(
          this,
          {
            ...props,
            style: [defaultStyle, normalizeTextStyle(props.style)],
          },
          ref,
        );
      };
    }

    const originalTextInputRender = TextInputComponent.render;
    if (originalTextInputRender) {
      TextInputComponent.render = function (props: any, ref: any) {
        return originalTextInputRender.call(
          this,
          {
            ...props,
            style: [defaultStyle, normalizeTextStyle(props.style)],
          },
          ref,
        );
      };
    }

    globalScope[FONT_PATCH_FLAG] = true;
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    // Splash screen is still visible, so just return null
    return null;
  }

  const PAYSTACK_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_KEY || '';
  return (
    <SafeAreaProvider>
      <PaystackProvider publicKey={PAYSTACK_PUBLIC_KEY} debug={true}>
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
      </PaystackProvider>
    </SafeAreaProvider>
  );
}
