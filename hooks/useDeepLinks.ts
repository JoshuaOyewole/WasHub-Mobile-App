import { useAuthStore } from "@/store/useAuthStore";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export const useDeepLink = () => {
  const { setAuthStep } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      const data = Linking.parse(url);

      if (data.path === "auth/otp") {
        await setAuthStep("OTP");
      } else if (data.path === "auth/setupPassword") {
        // Extract token from query params
        const token = data.queryParams?.token as string;

        if (token) {
          // Navigate to setupPassword with token
          router.push({
            pathname: "/(auth)/setupPassword",
            params: { token },
          });
        }
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl({ url });
      }
    });
    const sub = Linking.addEventListener("url", handleUrl);
    return () => sub.remove();
  }, []);
};
