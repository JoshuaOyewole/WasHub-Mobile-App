import FormInput from "@/components/ui/text-input";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { resetPassword } from "@/lib/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupPassword() {
  const colors = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, setForm] = React.useState({
    pwd: "",
    confirmPwd: "",
  });

  // Get token from URL params
  const resetToken = params.token as string;

  // Mutation for resetting password
  const resetPasswordMutation = useMutation({
    mutationFn: (password: string) =>
      resetPassword({ token: resetToken, password }),
    onSuccess: (response) => {
      if (response.status) {
        toast(
          "success",
          "Success",
          "Your password has been reset successfully. Please login with your new password."
        );
        setTimeout(() => router.replace("/(auth)/login"), 2000);
      } else {
        toast(
          "error",
          "Error",
          response.error || "Failed to reset password. Please try again."
        );
      }
    },
    onError: (error: any) => {
      toast(
        "error",
        "Error",
        error.message || "An error occurred. Please try again."
      );
    },
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (!form.pwd || !form.confirmPwd) {
      toast("error", "Required", "Please fill in all password fields");
      return;
    }

    if (form.pwd.length < 6) {
      toast(
        "error",
        "Invalid Password",
        "Password must be at least 6 characters long"
      );
      return;
    }

    if (form.pwd !== form.confirmPwd) {
      toast("error", "Password Mismatch", "Passwords do not match");
      return;
    }

    if (!resetToken) {
      toast(
        "error",
        "Invalid Link",
        "Reset token is missing. Please use the link from your email."
      );
      return;
    }

    resetPasswordMutation.mutate(form.pwd);
  };

  // Check if token exists
  React.useEffect(() => {
    if (!resetToken) {
      toast(
        "error",
        "Invalid Link",
        "This password reset link is invalid. Please request a new one."
      );
      setTimeout(() => router.push("/(auth)/forgetPassword"), 2000);
    }
  }, [resetToken]);

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
            Set New Password
          </Text>
          <Text style={[style.formSubHeader, { color: colors.text }]}>
            Please enter your new password
          </Text>
        </View>
        {/* Form */}
        <View style={style.formContainer}>
          <FormInput
            label="Password"
            handleChange={(text) => handleChange("pwd", text)}
            placeholder="********"
            value={form.pwd}
            secureTextEntry={!showPassword}
            placeholderTextColor={colors.text}
            editable={!resetPasswordMutation.isPending}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
            }
            leftIcon={
              <Ionicons
                name={"lock-closed-outline"}
                size={20}
                color={colors.text}
              />
            }
          />
          <FormInput
            label="Confirm Password"
            handleChange={(text) => handleChange("confirmPwd", text)}
            placeholder="********"
            value={form.confirmPwd}
            secureTextEntry={!showPassword}
            placeholderTextColor={colors.text}
            editable={!resetPasswordMutation.isPending}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
            }
            leftIcon={
              <Ionicons
                name={"lock-closed-outline"}
                size={20}
                color={colors.text}
              />
            }
          />

          <Pressable
            onPress={handleSubmit}
            disabled={resetPasswordMutation.isPending}
            style={[
              style.submitBtn,
              {
                backgroundColor: resetPasswordMutation.isPending
                  ? colors.text + "40"
                  : colors.secondaryButton,
              },
            ]}
          >
            {resetPasswordMutation.isPending ? (
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
    // alignSelf: "center",
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
