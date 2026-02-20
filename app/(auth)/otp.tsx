import Button from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { register, sendOTP, verifyOTP } from "@/lib/api";
import { otpSchema } from "@/lib/schema/validationSchema";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import OTPTextView from "react-native-otp-textinput";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OTP() {
  const colors = useTheme();
  const router = useRouter();
//  const { setAuthStep } = useAuthStore();
  const { toast } = useToast();
  const [otp, setOtp] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [registrationData, setRegistrationData] = React.useState<any>(null);
  const [countdown, setCountdown] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);

  // Start countdown timer on mount (initial OTP was sent from register screen)
  useEffect(() => {
    setCountdown(60);
    setCanResend(false);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Load registration data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem("pendingRegistration");
        if (data) {
          const parsed = JSON.parse(data);
          setRegistrationData(parsed);
          setEmail(parsed.email);
        } else {
          toast("error", "Error", "No registration data found");
          router.replace("/(auth)/register");
        }
      } catch (error) {
        console.error("Error loading registration data:", error);
      }
    };
    loadData();
  }, []);

  // Mutation for verifying OTP
  const verifyOTPMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOTP({ email, otp }),
    onSuccess: async (response) => {
      if (response.status && response.data.verificationToken) {
        // Store verification token temporarily
        await AsyncStorage.setItem(
          "verificationToken",
          response.data.verificationToken,
        );
        // Now call register endpoint
        registerMutation.mutate(response.data.verificationToken);
      } else {
        toast("error", "Error", response.error || "Invalid OTP");
      }
    },
    onError: (error: any) => {
      console.log("Error verifying OTP:", error);
      toast("error", "Invalid OTP", error?.error || "Failed to verify OTP");
    },
  });

  // Mutation for registration
  const registerMutation = useMutation({
    mutationFn: (verificationToken: string) => {
      if (!registrationData) {
        throw new Error("No registration data");
      }

      return register(
        {
          firstname: registrationData.firstName,
          lastname: registrationData.lastName,
          email: registrationData.email,
          password: registrationData.password,
          phoneNumber: registrationData.phoneNumber,
        },
        verificationToken,
      );
    },
    onSuccess: async (response) => {
      if (response.status) {
        // Clear temporary data
        await AsyncStorage.removeItem("pendingRegistration");
        await AsyncStorage.removeItem("verificationToken");

        toast(
          "success",
          "Success",
          "Account created successfully! Please login.",
        );
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 1500);
      } else {
        console.error("Error creating account2", response);
        toast("error", "Error", response.message || "Failed to create account");
      }
    },
    onError: (error: any) => {
      console.error("Error creating account:", error);
      toast(
        "error",
        "Error creating account",
        error?.error || "Failed to create account",
      );
    },
  });

  // Mutation for resending OTP
  const resendOTPMutation = useMutation({
    mutationFn: (email: string) => sendOTP({ email }),
    onSuccess: (response) => {
      if (response.status) {
        setOtp(""); // Clear OTP inputs
        setCountdown(60); // Reset countdown
        setCanResend(false); // Disable resend button
        toast("success", "Success", "OTP has been resent to your email");
      } else {
        toast("error", "Error", response.error || "Failed to resend OTP");
      }
    },
    onError: (error: any) => {
      toast("error", "Error", error?.error || "Failed to resend OTP");
    },
  });

  const handleTextChange = (value: string) => {
    setOtp(value);
    // Auto-dismiss keyboard when OTP is complete
    if (value.length === 6) {
      Keyboard.dismiss();
    }
  };

  const handleVerify = () => {
    const parsed = otpSchema.safeParse({ email, otp });
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      toast("error", "Error", firstIssue?.message || "Invalid OTP details");
      return;
    }

    verifyOTPMutation.mutate(parsed.data);
  };

  const resendOTP = () => {
    if (!email) {
      toast("error", "Error", "Email not found");
      return;
    }
    resendOTPMutation.mutate(email);
  };
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
              {/*   <Text style={{ color: colors.text }}>Back</Text> */}
              </View>
            </Pressable>

            
      {/* OTP Screen Content Goes Here */}
      <View
        style={{ flex: 1, rowGap: 10, marginTop: 80, alignItems: "center" }}
      >
        <Text style={[style.formSubHeader, { color: colors.formHeading }]}>
          Enter the 6 digit otp we sent to {email || "your email"} to verify
          your email.
        </Text>

        <View
          style={{
            width: "85%",
            marginHorizontal: "auto",
            marginTop: 20,
            columnGap: 10,
          }}
        >
          <OTPTextView
            handleTextChange={handleTextChange}
            inputCount={6}
            keyboardType="numeric"
            tintColor={colors.text}
            offTintColor={colors.border}
            style={[
              style.otpInput,
              {
                borderColor: colors.border,
                color: colors.text,
                fontSize: 20,
                textAlign: "center",
              },
            ]}
          />
        </View>
        <Button
          title={canResend ? "Resend otp" : `Resend otp in ${countdown}s`}
          onPress={resendOTP}
          variant="link"
          disabled={!canResend || resendOTPMutation.isPending}
          accessibilityLabel="Resend otp button"
        />
        <Pressable
          onPress={handleVerify}
          style={[
            style.submitBtn,
            {
              backgroundColor: colors.secondaryButtonBackground,
              opacity:
                verifyOTPMutation.isPending ||
                registerMutation.isPending ||
                resendOTPMutation.isPending
                  ? 0.7
                  : 1,
            },
          ]}
          disabled={
            verifyOTPMutation.isPending ||
            registerMutation.isPending ||
            resendOTPMutation.isPending
          }
        >
          {verifyOTPMutation.isPending ||
          registerMutation.isPending ||
          resendOTPMutation.isPending ? (
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
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
   backButtonAbsolute: {
    position: "absolute",
    top: 50,
    left: 0,
    zIndex: 10,
  },
  formSubHeader: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    width: "95%",
    alignSelf: "center",
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    width: 45,
  },
  submitBtn: {
    width: "85%",
    marginHorizontal: "auto",
    marginTop: 30,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  resendOTPButton: {
    marginTop: 20,
  },
});
