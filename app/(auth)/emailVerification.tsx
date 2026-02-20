import FormInput from "@/components/ui/text-input";
import { useTheme } from "@/hooks/useTheme";
import { emailVerificationSchema } from "@/lib/schema/validationSchema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmailVerification() {
  const colors = useTheme();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const handleChange = (field: string, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    const parsed = emailVerificationSchema.safeParse({ email: form.email });
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.issues[0]?.message);
      return;
    }
    console.log("Form submitted:", parsed.data);
  };

  const handleGoogleSignin = () => {
    console.log("Google Signin initiated");
  };
  return (
    <SafeAreaView
      style={[style.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={isDarkMode ? colors.secondary : colors.background}
        translucent={false}
      />

      {/* Back Button - Absolute Position */}
      <Pressable
        onPress={() => router.back()}
        style={[
          style.backButtonAbsolute,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            borderRadius: 50,
          }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
          <Text>Back</Text>
        </View>
      </Pressable>

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
            Forgot Password
          </Text>
          <Text style={[style.formSubHeader, { color: colors.formHeading }]}>
            Enter the email address registered with your account. We'll send you
            a link to reset your password.
          </Text>
        </View>
        {/* Form */}
        <View style={style.formContainer}>
          <FormInput
            label="Email Address"
            handleChange={(text) => handleChange("email", text)}
            placeholder="john.doe@example.com"
            keyboardType="email-address"
            value={form.email}
            placeholderTextColor={colors.text}
            leftIcon={
              <Ionicons name={"mail-outline"} size={20} color={colors.text} />
            }
          />

          <Pressable
            onPress={handleSubmit}
            style={[
              style.submitBtn,
              {
                backgroundColor: colors.secondaryButtonBackground,
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                color: colors.buttonText,
              }}
            >
              {" "}
              Submit
            </Text>
          </Pressable>
        </View>
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
  },
  formSubHeader: {
    fontSize: 16,
    marginTop: 10,
    alignSelf: "center",
  },
  formContainer: {
    gap: 15,
    paddingVertical: 10,
  },
  submitBtn: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    textAlign: "center",
    marginTop: 10,
  },
  backButtonAbsolute: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
});
