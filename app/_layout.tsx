import { ToastOverlay } from "@/components/ui/ToastOverlay";
import { BookingProvider } from "@/contexts/BookingContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDeepLink } from "@/hooks/useDeepLinks";
import { bootstrapAuth } from "@/lib/auth/bootstrapAuth";
import { useAuthStore } from "@/store/useAuthStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

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
  const { user, isInitialized, authStep } = useAuthStore();
  const router = useRouter();

  useDeepLink();

  // Initialize auth on app launch
  useEffect(() => {
    bootstrapAuth();
  }, []);

  // After initialization, navigate based on auth state
  useEffect(() => {
    if (!isInitialized) return;

    // Small delay to allow splash screen animation
    const timer = setTimeout(() => {
      if (user) {
        console.log("User authenticated, redirecting to /(tabs)");
        router.replace("/(tabs)");
      } else {
        // Navigate based on authStep
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
            router.replace("/(screens)/splash");
            break;
        }
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [isInitialized, user, authStep, router]);

  return (
    <Stack>
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BookingProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <AppContent />
            <StatusBar style="auto" />
            <ToastOverlay />
          </ThemeProvider>
        </BookingProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
