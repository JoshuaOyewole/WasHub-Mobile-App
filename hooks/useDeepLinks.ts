import { useAuthStore } from "@/store/useAuthStore";
import * as Linking from "expo-linking";
import { useEffect } from "react";

export const useDeepLink = () => {
  const { setAuthStep } = useAuthStore();

  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      const data = Linking.parse(url);

      if (data.path === "auth/otp") {
        await setAuthStep("OTP");
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
