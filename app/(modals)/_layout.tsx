import { Stack } from "expo-router";
import React from "react";

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="car-details" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="edit-car-details"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
}
