// LoginScreen.tsx
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { useLoginMutation } from "@/lib/api/useAuthMutations";
import { loginSchema, LoginSchema } from "@/lib/schema/validationSchema";
import { useAuthStore } from "@/store/useAuthStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import Checkbox from "expo-checkbox";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Controller,
  useForm,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FormInput from "../ui/text-input";

const LoginScreen = () => {
  const colors = useTheme();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, saveCredentials, getCredentials, clearCredentials } =
    useAuthStore();
  const router = useRouter();
  // Use React Query mutation hook
  const { mutate: login, isPending, isError } = useLoginMutation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema) as Resolver<LoginSchema, any>,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Load saved credentials on mount
  useEffect(() => {
    const loadSavedCredentials = async () => {
      const credentials = await getCredentials();
      if (credentials) {
        setValue("email", credentials.email);
        setValue("rememberMe", true);
        console.log("✅ Loaded saved credentials");
      }
    };
    loadSavedCredentials();
  }, []);

  const handleGoogleSignin = () => {
    console.log("Google Signin initiated");
  };

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    console.log("Form Data:", data);

    login(
      { email: data.email, password: data.password },
      {
        onSuccess: async (res) => {
          console.log("Login response:", res);

          if (res.statusCode && res.statusCode !== 200) {
            return toast("error", "Login Failed", "An error occurred");
          }

          // ✅ Store token in SecureStore ONLY
          if (res.data?.token) {
            await SecureStore.setItemAsync("auth_token", res.data.token);
            console.log("✅ Token saved to SecureStore");
          }

          // ✅ Save credentials if remember me is checked
          if (data.rememberMe) {
            await saveCredentials(data.email);
          } else {
            await clearCredentials();
          }

          // ✅ Store user in Zustand memory ONLY
          if (res.data?.user) {
            setUser(res.data.user);
            console.log("✅ User saved to Zustand:", res.data.user);
          }

          // Navigate to home/tabs
          router.replace("/(tabs)");
        },
        onError: (error: any) => {
          console.log("login error=>", JSON.stringify(error).toString());
          if (error?.statusCode === 401) {
            toast(
              "error",
              "Login Failed",
              error.error || "Your email or password is incorrect.",
            );
          } else {
            toast("error", "Login Failed", error.error || "An error occurred.");
          }
        },
      },
    );
  };

  return (
    <View style={style.formContainer}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <FormInput
              label="Email Address"
              handleChange={onChange}
              value={value}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              onBlur={onBlur}
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              placeholderTextColor={colors.text}
              leftIcon={
                <Ionicons name={"mail-outline"} size={20} color={colors.text} />
              }
            />
            {errors.email && (
              <Text style={style.errorText}>{errors.email.message}</Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <FormInput
              label="Password"
              handleChange={onChange}
              placeholder="********"
              value={value}
              secureTextEntry={!showPassword}
              placeholderTextColor={colors.text}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
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
            {errors.password && (
              <Text style={style.errorText}>{errors.password.message}</Text>
            )}
          </>
        )}
      />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {/* Add a checkbox */}
        <Controller
          control={control}
          name="rememberMe"
          render={({ field: { value, onChange } }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 5,
              }}
            >
              <Checkbox
                value={value}
                onValueChange={onChange}
                color={value ? colors.secondaryButton : undefined}
                style={{ width: 18, height: 18, borderRadius: 4 }}
              />
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
                Remember Me
              </Text>
            </View>
          )}
        />

        <Link
          href={"/forgetPassword"}
          style={{
            color: "#EF1010",
            fontWeight: "500",
            fontSize: 14,
            textDecorationLine: "underline",
            textAlign: "center",
          }}
        >
          Forgot Password
        </Link>
      </View>

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting || isPending}
        style={[style.submitBtn, { backgroundColor: colors.secondaryButton }]}
      >
        {isSubmitting || isPending ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ActivityIndicator size="small" color={colors.buttonText} />
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                color: colors.buttonText,
              }}
            >
              Signing in...
            </Text>
          </View>
        ) : (
          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              color: colors.buttonText,
            }}
          >
            Sign In
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
          Are you a new user?
        </Text>
        <Link
          href="/(auth)/register"
          style={{
            fontWeight: "600",
            fontSize: 14,
            color: colors.link,
          }}
        >
          Create a new account
        </Link>
      </View>

      {/* Implement the OR here */}
      <View style={style.dividerContainer}>
        <View style={[style.divider, { backgroundColor: colors.border }]} />
        <Text style={[style.dividerText, { color: colors.gray500 }]}>OR</Text>
        <View style={[style.divider, { backgroundColor: colors.border }]} />
      </View>
      {/* GOOGLE SIGNUP */}
      <Pressable
        onPress={() => handleGoogleSignin()}
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
            Sign in with Google
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  errorText: {
    color: "red",
    marginBottom: 4,
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
});

export default LoginScreen;
