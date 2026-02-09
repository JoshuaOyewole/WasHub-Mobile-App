import { useTheme } from "@/hooks/useTheme";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const colors = useTheme();
  return (
    <SafeAreaView
      style={[style.container, { backgroundColor: colors.background }]}
    >
      <View style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <View>
          <Image source={require("../../assets/images/onboarding1.png")} />
          <Text style={[style.title, { color: colors.title }]}>
            Choose the Perfect Wash Option
          </Text>
          <Text style={[style.subTitle, { color: colors.subtitle }]}>
            From quick rinses to full detailing browse services and transparent
            pricing tailored to your car's needs
          </Text>
        </View>
        <View>
          <Link
            href="/register"
            style={[
              style.button,
              { backgroundColor: colors.surface, color: colors.white },
            ]}
          >
            Get Started
          </Link>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 5,
              marginTop: 20,
            }}
          >
            <Text
              style={[
                {
                  fontWeight: "600",
                  fontSize: 14,
                  color: colors.text,
                },
              ]}
            >
              Already have an account?
            </Text>
            <Link
              href="/(auth)/login"
              style={{
                fontWeight: "600",
                fontSize: 14,
                color: colors.link,
                textDecorationLine: "underline",
              }}
            >
              Sign In
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    padding: 15,
    borderRadius: 30,
    marginTop: 30,
    width: 250,
    height: 47,
    textAlign: "center",
  },
});
