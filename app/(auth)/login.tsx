import LoginScreen from "@/components/form/LoginScreen";
import { useTheme } from "@/hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const colors = useTheme();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  
  return (
    <SafeAreaView
      style={[style.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={isDarkMode ? colors.secondary : colors.background}
        translucent={false}
      />
      <ScrollView
        contentContainerStyle={{
          backgroundColor: colors.background,
          paddingHorizontal: 20,
          gap: 10,
          flex: 1,
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={style.formHeader}>
          <Text style={[style.header, { color: colors.formHeading }]}>
            Sign into your account
          </Text>
          <Text style={[style.formSubHeader, { color: colors.formHeading }]}>
            Please enter your details below
          </Text>
        </View>
        {/* Form */}
        <LoginScreen />
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    // gap: 10,
    justifyContent: "center",
  },
  formHeader: {
    paddingVertical: 20,
  },
  header: {
    fontWeight: 500,
    fontSize: 26,
    textAlign: "center",
  },
  formSubHeader: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    width: "80%",
    alignSelf: "center",
  },
});
