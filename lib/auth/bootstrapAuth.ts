import { fetchUserProfile } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import * as SecureStore from "expo-secure-store";

/**
 * Bootstrap authentication on app startup
 * Reads token from SecureStore and fetches user profile
 */
export const bootstrapAuth = async () => {
  const { setUser, setInitialized } = useAuthStore.getState();

  try {
    // Step 1: Read token from SecureStore
    let token: string | null = null;
    try {
      token = await SecureStore.getItemAsync("auth_token");
    } catch (storageError) {
      console.error("❌ Error reading from SecureStore:", storageError);
      setInitialized();
      return;
    }

    // Step 2: If no token, initialize app with default authStep
    if (!token) {
      console.log("ℹ️ No token found, initializing app");
      setInitialized();
      return;
    }

    // Step 3: If token exists, call /me endpoint to validate it
    console.log("✅ Token found, fetching user profile");
    try {
      const response = await fetchUserProfile();

      // Step 4: On success, set user in Zustand
      if (response.status && response.data?.user) {
        setUser(response.data.user);
        console.log("✅ User profile loaded:", response.data.user);
      } else {
        // API responded but with invalid data
        console.warn(
          "⚠️ Invalid response from auth/me endpoint, clearing token",
        );
        try {
          await SecureStore.deleteItemAsync("auth_token");
        } catch (deleteError) {
          console.error("❌ Error deleting invalid token:", deleteError);
        }
        setUser(null);
      }
    } catch (apiError: any) {
      // Handle API errors gracefully
      console.warn(
        "⚠️ Failed to fetch user profile:",
        apiError?.message || apiError,
      );

      // If endpoint doesn't exist (404) or token is invalid (401), clear token
      if (
        apiError?.response?.status === 404 ||
        apiError?.response?.status === 401
      ) {
        console.log("ℹ️ Clearing token due to API error");
        try {
          await SecureStore.deleteItemAsync("auth_token");
        } catch (deleteError) {
          console.error("❌ Error deleting token:", deleteError);
        }
      }

      setUser(null);
    }
  } catch (error: any) {
    // Catch-all for unexpected errors
    console.error(
      "❌ Unexpected error during auth bootstrap:",
      error?.message || error,
    );
    setUser(null);
  } finally {
    // Step 6: Always set isInitialized = true at the end
    setInitialized();
    console.log("✅ Auth initialization complete");
  }
};
