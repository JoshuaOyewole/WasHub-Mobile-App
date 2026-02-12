import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { BackHandler } from "react-native";

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);

  // Prevent Android back button from navigating back to tabs when logged out
  useEffect(() => {
    if (user) return;

    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, [user]);

  return <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />;
}
