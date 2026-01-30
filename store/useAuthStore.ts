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
  clearAuth: () => Promise<void>;
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

      clearAuth: async () => {
        try {
          await SecureStore.deleteItemAsync("auth_token");
          set({ user: null });
          console.log("✅ Auth token cleared from SecureStore");
        } catch (error) {
          console.error("❌ Error clearing auth token:", error);
        }
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync("auth_token");
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
