// lib/api/useAuthMutations.ts
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { handleLogin } from "../api";
import { apiClient } from "../request";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: boolean;
  token: string;
  data: {
    userId: string;
    role: string;
    email: string;
    name?: string;
  };
}

// Login Mutation Hook
export const useLoginMutation = () => {
  const mutation = useMutation({
    mutationFn: (credentials: LoginRequest) => handleLogin(credentials),
    mutationKey: ["login"],
  });
  return mutation;
  /*   return useMutation({
    mutationFn: handleLogin(credentials),
    mutationKey: ["login"],
    onSuccess: async (data) => {
      // Store token securely
      if (data.token) {
        await SecureStore.setItemAsync("auth_token", data.token);
        setToken(data.token);
      }

      // Store user in Zustand
      if (data.data) {
        setUser(data.data);
      }

      console.log("✅ Login successful:", data.data.email);
    },
    onError: (error) => {
      console.error("❌ Login failed:", error.message);
    },
  }); */
};

// Logout Mutation Hook
export const useLogoutMutation = () => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // Call logout endpoint if it exists
      // await apiClient.post("/auth/logout");
      return null;
    },
    onSuccess: async () => {
      // Clear secure storage and Zustand state
      await logout();
      console.log("✅ Logout successful");
    },
    onError: (error) => {
      console.error("❌ Logout failed:", error.message);
    },
  });
};

// Verify Token Mutation
export const useVerifyTokenMutation = () => {
  const { setUser } = useAuthStore();

  return useMutation<AuthResponse, Error, { token: string }>({
    mutationFn: async ({ token }) => {
      const response = await apiClient.get<AuthResponse>("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data) {
        setUser(data.data);
      }
      console.log("✅ Token verified");
    },
    onError: (error) => {
      console.error("❌ Token verification failed:", error.message);
    },
  });
};
