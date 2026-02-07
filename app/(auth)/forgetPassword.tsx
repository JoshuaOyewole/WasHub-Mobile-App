import FormInput from "@/components/ui/text-input";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { forgotPassword } from "@/lib/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgetPassword() {
  const colors = useTheme();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false);
  const { toast } = useToast();
  // Email validation regex
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Mutation for forgot password
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => forgotPassword({ email }),
    onSuccess: (response) => {
      if (response.status && response.data?.emailSent) {
        setEmailSent(true);
      } else {
        toast("error", "Error", "Failed to send reset link. Please try again.");
      }
    },
    onError: (error: any) => {
      toast(
        "error",
        "Error",
        error.message || "An error occurred. Please try again.",
      );
    },
  });

  const handleSubmit = () => {
    if (!email.trim()) {
      toast("error", "Required", "Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      toast("error", "Invalid Email", "Please enter a valid email address");
      return;
    }

    forgotPasswordMutation.mutate(email);
  };

  const handleBackToLogin = () => {
    router.push("/(auth)/login");
  };

  // Success screen after email sent
  if (emailSent) {
    return (
      <SafeAreaView
        style={[style.container, { backgroundColor: colors.background }]}
      >
        <StatusBar />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            gap: 20,
          }}
        >
          <Ionicons name="checkmark-circle" size={80} color="green" />
          <Text
            style={[
              style.header,
              { color: colors.formHeading, textAlign: "center" },
            ]}
          >
            Check Your Email
          </Text>
          <Text
            style={[
              style.formSubHeader,
              { color: colors.text, textAlign: "center", lineHeight: 23 },
            ]}
          >
            We've sent a password reset link to {email}. Please check your email
            and click the link to reset your password.
          </Text>
          <Text
            style={[
              style.formSubHeader,
              { color: colors.text, textAlign: "center", fontSize: 14 },
            ]}
          >
            The link will expire in 10 minutes.
          </Text>
          <Pressable
            onPress={handleBackToLogin}
            style={[
              style.submitBtn,
              {
                flexDirection: "row",
                backgroundColor: colors.background,
                marginTop: 20,
              },
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={16}
              color={colors.secondaryButton}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                color: colors.secondaryButton,
              }}
            >
              Back to Login
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[style.container, { backgroundColor: colors.background }]}
    >
      <StatusBar />

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
          <Text style={{ color: colors.text }}>Back</Text>
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
            handleChange={(text) => setEmail(text)}
            placeholder="john.doe@example.com"
            keyboardType="email-address"
            value={email}
            placeholderTextColor={colors.text}
            editable={!forgotPasswordMutation.isPending}
            leftIcon={
              <Ionicons name={"mail-outline"} size={20} color={colors.text} />
            }
          />

          <Pressable
            onPress={handleSubmit}
            disabled={forgotPasswordMutation.isPending}
            style={[
              style.submitBtn,
              {
                backgroundColor: forgotPasswordMutation.isPending
                  ? colors.text + "40"
                  : colors.secondaryButton,
              },
            ]}
          >
            {forgotPasswordMutation.isPending ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: colors.buttonText,
                }}
              >
                Submit
              </Text>
            )}
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
    left: 0,
    zIndex: 10,
  },
});
