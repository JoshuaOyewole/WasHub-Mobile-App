import FormInput from "@/components/ui/text-input";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { checkEmail, sendOTP } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const colors = useTheme();
  const router = useRouter();
  const { setAuthStep } = useAuthStore();
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);

  // Mutation for checking if email exists
  const checkEmailMutation = useMutation({
    mutationFn: (email: string) => checkEmail({ email }),
    onSuccess: async (response) => {
      if (response.status && response.data) {
        if (response.data.exists) {
          toast(
            "error",
            "Email Already Registered",
            "This email is already registered. Please use a different email or login to your account."
          );
          setTimeout(() => {
            setAuthStep("LOGIN");
            router.push("/(auth)/login");
          }, 2000);
        } else {
          // Email doesn't exist, proceed with storing data and sending OTP
          try {
            await AsyncStorage.setItem(
              "pendingRegistration",
              JSON.stringify(form),
            );
            sendOTPMutation.mutate(form.email);
          } catch (error) {
            console.error("Error saving registration data:", error);
            toast("error", "Error", "Failed to save registration data");
          }
        }
      }
    },
    onError: (error: any) => {
      console.error("Error checking email:", error);
      toast(
        "error",
        "Error",
        error?.response?.data?.error || "Failed to validate email"
      );
    },
  });

  // Mutation for sending OTP
  const sendOTPMutation = useMutation({
    mutationFn: (email: string) => sendOTP({ email }),
    onSuccess: (response) => {
      if (response.status) {
        // Store registration data temporarily in authStore or AsyncStorage
        toast(
          "success",
          "OTP Sent",
          `A verification code has been sent to ${form.email}`
        );
        // Navigate to OTP screen and set auth step
        setTimeout(() => {
          setAuthStep("OTP");
          router.push("/(auth)/otp");
        }, 1500);
      } else {
        console.error(
          "Error sending OTP:",
          response.message || "Failed to send OTP",
        );
        toast("error", "Error", response.message || "Failed to send OTP");
      }
    },
    onError: (error: any) => {
      console.error("Error sending OTP:", error);
      toast(
        "error",
        "Error",
        error?.response?.data?.message || "Failed to send OTP"
      );
    },
  });
  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    // Validate form
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.phoneNumber
    ) {
      toast("error", "Error", "Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast("error", "Error", "Please enter a valid email address");
      return;
    }

    // Validate password match
    if (form.password !== form.confirmPassword) {
      toast("error", "Error", "Passwords do not match");
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      toast("error", "Error", "Password must be at least 6 characters");
      return;
    }

    // Check if email already exists before sending OTP
    checkEmailMutation.mutate(form.email);
  };
  const hanldeTermsPress = () => {
    //display a modal here
    console.log("Terms of Service pressed");
  };
  const handlePrivacyPress = () => {
    //display a modal here
    console.log("Privacy Policy pressed");
  };
  const handleGoogleSignup = () => {
    console.log("Google Signup initiated");
  };
  return (
    <SafeAreaView
      style={[style.container, { backgroundColor: colors.background }]}
    >
      <StatusBar />
      <ScrollView
        contentContainerStyle={{
          backgroundColor: colors.background,
          paddingHorizontal: 20,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={style.formHeader}>
          <Text style={[style.header, { color: colors.formHeading }]}>
            Let’s get started
          </Text>
          <Text style={[style.formSubHeader, { color: colors.formHeading }]}>
            To continue, please complete the form with your details
          </Text>
        </View>
        {/* Form */}
        <View style={style.formContainer}>
          <FormInput
            label="First Name"
            handleChange={(text) => handleChange("firstName", text)}
            placeholder="John"
            value={form.firstName}
            placeholderTextColor={colors.text}
          />
          <FormInput
            label="Last Name"
            handleChange={(text) => handleChange("lastName", text)}
            placeholder="Doe"
            value={form.lastName}
            placeholderTextColor={colors.text}
          />
          <FormInput
            label="Email Address"
            handleChange={(text) => handleChange("email", text)}
            placeholder="john.doe@example.com"
            keyboardType="email-address"
            value={form.email}
            placeholderTextColor={colors.text}
          />
          <FormInput
            label="Phone Number"
            handleChange={(text) => handleChange("phoneNumber", text)}
            placeholder="123-456-7890"
            value={form.phoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor={colors.text}
          />

          <FormInput
            label="Password"
            handleChange={(text) => handleChange("password", text)}
            placeholder="********"
            value={form.password}
            secureTextEntry={!showPassword}
            placeholderTextColor={colors.text}
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
            handleChange={(text) => handleChange("confirmPassword", text)}
            placeholder="********"
            value={form.confirmPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor={colors.text}
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

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                {
                  fontWeight: "600",
                  fontSize: 14,
                  color: "#17143380",
                  lineHeight: 20,
                },
              ]}
            >
              By clicking Proceed, you agree to the
            </Text>
            <Pressable
              onPress={hanldeTermsPress}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: "#17143380",
                  fontWeight: "600",
                  fontSize: 14,
                  textDecorationLine: "underline",
                }}
              >
                {" "}
                Terms of Service{" "}
              </Text>
            </Pressable>
            <Text
              style={[
                {
                  fontWeight: "600",
                  fontSize: 14,
                  color: "#17143380",
                },
              ]}
            >
              and
            </Text>
            <Pressable
              onPress={handlePrivacyPress}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: "#17143380",
                  fontWeight: "600",
                  fontSize: 14,
                  textDecorationLine: "underline",
                }}
              >
                {" "}
                Privacy Policy
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleSubmit}
            style={[
              style.submitBtn,
              {
                backgroundColor: colors.secondaryButton,
                opacity:
                  checkEmailMutation.isPending || sendOTPMutation.isPending
                    ? 0.7
                    : 1,
              },
            ]}
            disabled={checkEmailMutation.isPending || sendOTPMutation.isPending}
          >
            {checkEmailMutation.isPending || sendOTPMutation.isPending ? (
              <ActivityIndicator size="small" color={colors.buttonText} />
            ) : (
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: colors.buttonText,
                }}
              >
                {" "}
                Proceed
              </Text>
            )}
          </Pressable>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Text
              style={[
                {
                  fontWeight: "600",
                  fontSize: 14,
                  color: "#17143380",
                },
              ]}
            >
              Are you an existing user?
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
              Sign into your account
            </Link>
          </View>

          {/* Implement the OR here */}
          <View style={style.dividerContainer}>
            <View style={[style.divider, { backgroundColor: colors.border }]} />
            <Text style={[style.dividerText, { color: colors.gray500 }]}>
              OR
            </Text>
            <View style={[style.divider, { backgroundColor: colors.border }]} />
          </View>
          {/* GOOGLE SIGNUP */}
          <Pressable
            onPress={() => handleGoogleSignup()}
            style={[
              style.submitBtn,
              {
                backgroundColor: "#fff",
                borderColor: "#007AFF38",
                borderWidth: 1,
                height: 50,
                marginTop: 0,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 10,
              }}
            >
              <Image
                source={require("../../assets/images/Google.png")}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: colors.link,
                }}
              >
                {" "}
                Sign up with Google
              </Text>
            </View>
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
    textAlign: "center",
  },
  formSubHeader: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    width: "80%",
    alignSelf: "center",
  },
  formContainer: {
    gap: 15,
    paddingVertical: 10,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 40,
  },
  submitBtn: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    textAlign: "center",
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    justifyContent: "center",
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 15,
  },
  termButton: {},
});
