import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { authStep, isInitialized } = useAuthStore();
  const [token, setToken] = useState<string | null>(null);
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);

  useEffect(() => {
    // Load token from secure storage
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("auth_token");
        setToken(storedToken);
      } catch (error) {
        console.error("Error loading token:", error);
      } finally {
        setIsTokenLoaded(true);
      }
    };

    loadToken();
  }, []);

  useEffect(() => {
    // Wait for initialization and token to load
    if (!isInitialized || !isTokenLoaded) return;

    // Show splash for 1.2 seconds, then navigate
    const timer = setTimeout(() => {
      if (token) {
        return router.replace("/(tabs)");
      }

      switch (authStep) {
        case "OTP":
          return router.replace("/(auth)/otp");
        case "LOGIN":
          return router.replace("/(auth)/login");
        case "REGISTER":
          return router.replace("/(auth)/register");
        case "EMAIL_VERIFICATION":
          return router.replace("/(auth)/emailVerification");
        case "FORGET_PASSWORD":
          return router.replace("/(auth)/forgetPassword");
        default:
          return router.replace("/splash");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [authStep, isInitialized, isTokenLoaded, token, router]);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/icon.png")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2D33",
    justifyContent: "center",
    alignItems: "center",
  },
});
