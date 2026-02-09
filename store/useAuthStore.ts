import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthStep =
  | "ONBOARDING"
  | "LOGIN"
  | "REGISTER"
  | "OTP"
  | "EMAIL_VERIFICATION"
  | "FORGET_PASSWORD";

export interface User {
  userId: string;
  email: string;
  role: string;
  name?: string;
  profileImage?: string | null;
  phoneNumber?: string;
  dob?: string | null;
}

interface AuthState {
  // auth (NOT persisted - memory only)
  user: User | null;

  // flow (persisted in AsyncStorage)
  authStep: AuthStep | null;

  // app
  isInitialized: boolean;

  // actions
  setUser: (user: User | null) => void;
  setAuthStep: (step: AuthStep) => void;
  setInitialized: () => void;
  saveCredentials: (email: string) => Promise<void>;
  getCredentials: () => Promise<{ email: string } | null>;
  clearCredentials: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      authStep: null,
      isInitialized: false,

      setUser: (user) => set({ user }),
      setAuthStep: (step) => set({ authStep: step }),
      setInitialized: () => set({ isInitialized: true }),

      saveCredentials: async (email: string) => {
        try {
          await SecureStore.setItemAsync("saved_email", email);
          console.log("✅ Credentials saved for auto-fill");
        } catch (error) {
          console.error("❌ Error saving credentials:", error);
        }
      },

      getCredentials: async () => {
        try {
          const email = await SecureStore.getItemAsync("saved_email");
          if (email) {
            return { email };
          }
          return null;
        } catch (error) {
          console.error("❌ Error getting credentials:", error);
          return null;
        }
      },

      clearCredentials: async () => {
        try {
          await SecureStore.deleteItemAsync("saved_email");
          console.log("✅ Saved credentials cleared");
        } catch (error) {
          console.error("❌ Error clearing credentials:", error);
        }
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync("auth_token");
          // Don't clear saved credentials on logout - they persist for remember me
          set({ user: null, authStep: "LOGIN" });
          console.log("✅ User logged out");
        } catch (error) {
          console.error("❌ Error during logout:", error);
        }
      },
    }),
    {
      name: "auth-flow-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        authStep: state.authStep, // ✅ Only persist authStep, NOT user
      }),
    },
  ),
);
