import {
    loginUser,
    sendOtp,
    verifyOtp,
    verifyUserEmail,
} from "@/lib/api/user-registration";
import { useMutation } from "@tanstack/react-query";
//import { useRouter } from "expo-router";

export default function useSignUp() {
  //const router = useRouter();

  const { isPending: isLogin, mutate: login } = useMutation({
    mutationFn: (variables: { email: string; password: string }) =>
      loginUser({ email: variables.email, password: variables.password }),
    mutationKey: ["login-user"],
    onSuccess: (data) => {
      console.log("Login successful", data);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const { isPending: isOtpLoading, mutate: otp } = useMutation({
    mutationFn: (variables: { email: string }) =>
      sendOtp({ email: variables.email }),
    mutationKey: ["send-otp"],
    onSuccess: () => {
      console.log("OTP sent successfully");
    },
    onError: (error) => {
      console.error("Error sending OTP:", error);
    },
  });

  const { isPending: verifyEmailLoading, mutate: verifyEmail } = useMutation({
    mutationFn: (variables: { email: string }) =>
      verifyUserEmail({ email: variables.email }),
    mutationKey: ["verify-email"],
  });

  const { isPending: isVerifyOtpLoading, mutate: verify } = useMutation({
    mutationFn: (variables: { email: string; otp: string }) =>
      verifyOtp({ email: variables.email, otp: variables.otp }),
    mutationKey: ["verify-otp"],
  });

  return {
    isOtpLoading,
    otp,
    verifyEmailLoading,
    verifyEmail,
    isVerifyOtpLoading,
    verify,
    isLogin,
    login,
  };
}
