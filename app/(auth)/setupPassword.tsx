import FormInput from "@/components/ui/text-input";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupPassword() {
  const colors = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, setForm] = React.useState({
    pwd: "",
    confirmPwd: "",
  });
  const handleChange = (field: string, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (form.pwd !== form.confirmPwd) {
      Alert.alert("Oooop", "Passwords do not match");
      return;
    }
    console.log("Form submitted:", form);
  };

  return (
    <SafeAreaView
      style={[style.container, { backgroundColor: colors.background }]}
    >
      <StatusBar />

      {/* Back Button - Absolute Position */}
      <Pressable
        onPress={() => router.back()}
        style={[
          style.backButtonAbsolute,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            borderRadius: 50,
          }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
          <Text>Back</Text>
        </View>
      </Pressable>

      <ScrollView
        contentContainerStyle={{
          backgroundColor: colors.background,
          paddingHorizontal: 20,
          gap: 10,
          flex: 1,
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={style.formHeader}>
          <Text style={[style.header, { color: colors.formHeading }]}>
            Kindly set-up your password
          </Text>
        </View>
        {/* Form */}
        <View style={style.formContainer}>
          <FormInput
            label="Password"
            handleChange={(text) => handleChange("pwd", text)}
            placeholder="********"
            value={form.pwd}
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
            handleChange={(text) => handleChange("confirmPwd", text)}
            placeholder="********"
            value={form.confirmPwd}
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
              Submit
            </Text>
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
  },
  formSubHeader: {
    fontSize: 16,
    marginTop: 10,
    alignSelf: "center",
  },
  formContainer: {
    gap: 15,
    paddingVertical: 10,
  },
  submitBtn: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    textAlign: "center",
    marginTop: 10,
  },
  backButtonAbsolute: {
    position: "absolute",
    top: 50,
    left: 0,
    zIndex: 10,
  },
});
