import { ThemedText } from "@/components/themed-text";
import Button from "@/components/ui/button";
import { Fonts } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { changePassword } from "@/lib/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePassword() {
  const router = useRouter();
  const { toast } = useToast();
  const colors = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast("error", "Missing Info", "Please fill all password fields.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast("error", "Passwords Mismatch", "New passwords do not match.");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      toast(
        "error",
        "Invalid Password",
        "New password cannot be the same as current password.",
      );
      return;
    }

    setIsSaving(true);
    try {
      const response = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      if (response.status) {
        toast("success", "Updated", "Password changed successfully.");
        router.back();
      }
    } catch (error: any) {
      toast("error", "Error", error?.error || "Failed to change password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable
            style={[
              styles.backButton,
              { backgroundColor: colors.card, shadowColor: colors.shadow },
            ]}
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={18}
              color={colors.primary}
            />
          </Pressable>
          <ThemedText style={[styles.headerTitle, { color: colors.title }]}>
            Change Password
          </ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <ThemedText style={[styles.label, { color: colors.text }]}>
                Current Password
              </ThemedText>
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                value={form.currentPassword}
                onChangeText={(value) => handleChange("currentPassword", value)}
                placeholder="********"
                placeholderTextColor={colors.textPlaceholder}
                secureTextEntry={!showCurrent}
                style={[
                  styles.input,
                  styles.inputWithIcon,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                  },
                ]}
              />
              <Pressable
                onPress={() => router.push("/(auth)/forgetPassword")}
                style={({ pressed }) => [pressed && styles.linkPressed]}
              >
                <ThemedText style={styles.linkText}>Forgot Password</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setShowCurrent((prev) => !prev)}
                style={({ pressed }) => [
                  styles.eyeButton,
                  pressed && styles.eyePressed,
                ]}
              >
                <MaterialIcons
                  name={showCurrent ? "visibility" : "visibility-off"}
                  size={18}
                  color={colors.icon}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <ThemedText style={[styles.label, { color: colors.text }]}>
              New Password
            </ThemedText>
            <View style={styles.inputWrap}>
              <TextInput
                value={form.newPassword}
                onChangeText={(value) => handleChange("newPassword", value)}
                placeholder="********"
                placeholderTextColor={colors.textPlaceholder}
                secureTextEntry={!showNew}
                style={[
                  styles.input,
                  styles.inputWithIcon,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                  },
                ]}
              />
              <Pressable
                onPress={() => setShowNew((prev) => !prev)}
                style={({ pressed }) => [
                  styles.eyeButton,
                  pressed && styles.eyePressed,
                ]}
              >
                <MaterialIcons
                  name={showNew ? "visibility" : "visibility-off"}
                  size={18}
                  color={colors.icon}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <ThemedText style={[styles.label, { color: colors.text }]}>
              Confirm New Password
            </ThemedText>
            <View style={styles.inputWrap}>
              <TextInput
                value={form.confirmPassword}
                onChangeText={(value) => handleChange("confirmPassword", value)}
                placeholder="********"
                placeholderTextColor={colors.textPlaceholder}
                secureTextEntry={!showConfirm}
                style={[
                  styles.input,
                  styles.inputWithIcon,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                  },
                ]}
              />
              <Pressable
                onPress={() => setShowConfirm((prev) => !prev)}
                style={({ pressed }) => [
                  styles.eyeButton,
                  pressed && styles.eyePressed,
                ]}
              >
                <MaterialIcons
                  name={showConfirm ? "visibility" : "visibility-off"}
                  size={18}
                  color={colors.icon}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.buttonWrap}>
            <Button
              title={isSaving ? "Updating..." : "Change password"}
              onPress={handleSubmit}
              disabled={isSaving}
            />
          </View>

          {isSaving && (
            <View style={styles.spinnerRow}>
              <ActivityIndicator size="small" color={colors.text} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.rounded,
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  fieldBlock: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "400",
  },
  linkText: {
    color: "#F77C0B",
    fontSize: 12,
    fontWeight: "500",
  },
  linkPressed: {
    opacity: 0.6,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    height: 48,
  },
  inputWrap: {
    position: "relative",
    justifyContent: "center",
  },
  inputWithIcon: {
    paddingRight: 44,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    height: 40,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  eyePressed: {
    opacity: 0.6,
  },
  buttonWrap: {
    marginTop: 18,
  },
  spinnerRow: {
    marginTop: 12,
    alignItems: "center",
  },
});
