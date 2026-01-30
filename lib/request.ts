import { useAuthStore } from "@/store/useAuthStore";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

interface ApiSuccessResponse<T = any> {
  data: DataType<T>;
  status: boolean;
  statusCode: number;
}
interface ApiFailureResponse {
  status: boolean;
  error: string;
  statusCode: number;
}
interface DataType<T = any> {
  message?: T;
}

type ApiError = AxiosError<ApiFailureResponse>;

function createApiClient() {
  const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api",
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor: Add auth token
  instance.interceptors.request.use(
    async (config) => {
      try {
        // Get token from SecureStore only
        const storedToken = await SecureStore.getItemAsync("auth_token");

        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error("Error adding auth token:", error);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor: Handle errors and token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 Unauthorized - token might be expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Clear auth state using logout
          const { logout } = useAuthStore.getState();
          await logout();

          console.log("❌ Unauthorized: Please login again");
        } catch (err) {
          console.error("Error handling 401:", err);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
}

export const apiClient = createApiClient();

export async function makeRequest<T = any>(
  config: AxiosRequestConfig,
): Promise<ApiSuccessResponse<T> | ApiFailureResponse> {
  try {
    const response: AxiosResponse<ApiSuccessResponse<T>> =
      await apiClient(config);
    return {
      data: response.data?.data,
      status: response?.data?.status,
      statusCode: response?.data?.statusCode,
    };
  } catch (error) {
    const axiosError = error as ApiError;
    if (axiosError.response) {
      console.log("API Error Response:", axiosError.response.data);
      throw {
        error: axiosError.response.data.error || "API Error",
        status: axiosError.response.data.status || false,
        statusCode: axiosError.response.data.statusCode || 500,
      };
    } else if (axiosError.request) {
      throw {
        error: "No response from server. Please check your connection.",
        status: false,
        statusCode: 500,
      };
    } else {
      throw {
        error: axiosError.message || "An unexpected error occurred",
        status: false,
        statusCode: 500,
      };
    }
  }
}
