import FormInput from "@/components/ui/text-input";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const colors = useTheme();
  const router = useRouter();
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Register form submitted:");
    // Implement registration logic here
    console.log("Form submitted:", form);
    router.push("/otp");
  };
  const hanldeTermsPress = () => {
    //display a modal here
    console.log("Terms of Service pressed");
  };
  const handlePrivacyPress = () => {
    //display a modal here
    console.log("Privacy Policy pressed");
  };
  const handleGoogleSignup = () => {
    console.log("Google Signup initiated");
  };
  return (
    <SafeAreaView
      style={[style.container, { backgroundColor: colors.background }]}
    >
      <StatusBar />
      <ScrollView
        contentContainerStyle={{
          backgroundColor: colors.background,
          paddingHorizontal: 20,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={style.formHeader}>
          <Text style={[style.header, { color: colors.formHeading }]}>
            Let’s get started
          </Text>
          <Text style={[style.formSubHeader, { color: colors.formHeading }]}>
            To continue, please complete the form with your details
          </Text>
        </View>
        {/* Form */}
        <View style={style.formContainer}>
          <FormInput
            label="First Name"
            handleChange={(text) => handleChange("firstName", text)}
            placeholder="John"
            value={form.firstName}
            placeholderTextColor={colors.text}
          />
          <FormInput
            label="Last Name"
            handleChange={(text) => handleChange("lastName", text)}
            placeholder="Doe"
            value={form.lastName}
            placeholderTextColor={colors.text}
          />
          <FormInput
            label="Email Address"
            handleChange={(text) => handleChange("email", text)}
            placeholder="john.doe@example.com"
            keyboardType="email-address"
            value={form.email}
            placeholderTextColor={colors.text}
          />
          <FormInput
            label="Phone Number"
            handleChange={(text) => handleChange("phoneNumber", text)}
            placeholder="123-456-7890"
            value={form.phoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor={colors.text}
          />

          <FormInput
            label="Password"
            handleChange={(text) => handleChange("password", text)}
            placeholder="********"
            value={form.password}
            secureTextEntry={!showPassword}
            placeholderTextColor={colors.text}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
          <FormInput
            label="Confirm Password"
            handleChange={(text) => handleChange("confirmPassword", text)}
            placeholder="********"
            value={form.confirmPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor={colors.text}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
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
              By clicking Proceed, you agree to the
            </Text>
            <Pressable
              onPress={hanldeTermsPress}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: "#17143380",
                  fontWeight: "600",
                  fontSize: 14,
                  textDecorationLine: "underline",
                }}
              >
                {" "}
                Terms of Service{" "}
              </Text>
            </Pressable>
            <Text
              style={[
                {
                  fontWeight: "600",
                  fontSize: 14,
                  color: "#17143380",
                },
              ]}
            >
              {" "}
              and{" "}
            </Text>
            <Pressable
              onPress={handlePrivacyPress}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: "#17143380",
                  fontWeight: "600",
                  fontSize: 14,
                  textDecorationLine: "underline",
                }}
              >
                {" "}
                Privacy Policy{" "}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleSubmit}
            style={[
              style.submitBtn,
              {
                backgroundColor: colors.secondaryButton,
              },
            ]}
          >
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
              Are you an existing user?
            </Text>
            <Link
              href="/(auth)/login"
              style={{
                fontWeight: "600",
                fontSize: 14,
                color: colors.link,
                textDecorationLine: "underline",
              }}
            >
              Sign into your account
            </Link>
          </View>

          {/* Implement the OR here */}
          <View style={style.dividerContainer}>
            <View style={[style.divider, { backgroundColor: colors.border }]} />
            <Text style={[style.dividerText, { color: colors.gray500 }]}>
              OR
            </Text>
            <View style={[style.divider, { backgroundColor: colors.border }]} />
          </View>
          {/* GOOGLE SIGNUP */}
          <Pressable
            onPress={() => handleGoogleSignup()}
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
                Sign up with Google
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    // gap: 10,
    justifyContent: "center",
  },
  formHeader: {
    paddingVertical: 20,
  },
  header: {
    fontWeight: 500,
    fontSize: 26,
    textAlign: "center",
  },
  formSubHeader: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    width: "80%",
    alignSelf: "center",
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
  termButton: {},
});
