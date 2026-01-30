import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { authStep, isInitialized, token } = useAuthStore();

  useEffect(() => {
    // Wait for initialization to complete
    if (!isInitialized) return;

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
          return router.replace("/onboarding");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [authStep, isInitialized, token, router]);

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/logo.png")} />
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
