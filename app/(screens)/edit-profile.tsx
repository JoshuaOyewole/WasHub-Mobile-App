import { ThemedText } from "@/components/themed-text";
import FormField from "@/components/ui/form-field";
import { Fonts } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import {
  deleteAccount,
  fetchUserProfile,
  updateUserProfile,
  uploadProfileImage,
} from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FALLBACK_AVATAR =
  "https://res.cloudinary.com/dic6uwf7a/image/upload/v1770476527/avatar_vfyax6.png";

export default function EditProfile() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const { toast } = useToast();
  const colors = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const nameParts = useMemo(() => {
    const split = (user?.name || "").trim().split(" ").filter(Boolean);
    return {
      first: split[0] || "",
      last: split.slice(1).join(" ") || "",
    };
  }, [user?.name]);

  const [form, setForm] = useState({
    firstname: nameParts.first,
    lastname: nameParts.last,
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    dob: user?.dob || "",
    profileImage: user?.profileImage || FALLBACK_AVATAR,
  });

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const response = await fetchUserProfile();
        if (response.status && response.data?.user && isMounted) {
          const profile = response.data.user;
          const splitName = (profile.name || "")
            .trim()
            .split(" ")
            .filter(Boolean);
          setForm((prev) => ({
            ...prev,
            firstname: splitName[0] || prev.firstname,
            lastname: splitName.slice(1).join(" ") || prev.lastname,
            email: profile.email || prev.email,
            phoneNumber: profile.phoneNumber || prev.phoneNumber,
            dob: profile.dob || prev.dob,
            profileImage: profile.profileImage || prev.profileImage,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const parsedDob = useMemo(() => {
    if (!form.dob) return new Date(2000, 0, 1);
    const d = new Date(form.dob);
    return isNaN(d.getTime()) ? new Date(2000, 0, 1) : d;
  }, [form.dob]);

  const formattedDob = useMemo(() => {
    if (!form.dob) return "";
    const d = new Date(form.dob);
    if (isNaN(d.getTime())) return form.dob;
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  }, [form.dob]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      handleChange("dob", selectedDate.toISOString());
    }
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      toast(
        "error",
        "Permission Required",
        "Please allow photo access to update your avatar.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        setIsUploading(true);
        const response = await uploadProfileImage(result.assets[0].uri);

        if (response.status && response.data?.url) {
          setForm((prev) => ({ ...prev, profileImage: response.data!.url }));
          if (response.data?.user) {
            setUser({
              ...user!,
              name: response.data.user.name,
              email: response.data.user.email,
              profileImage:
                response.data.user.profileImage ?? response.data.url,
              phoneNumber: response.data.user.phoneNumber,
              dob: response.data.user.dob,
            });
          }
        }
      } catch (error: any) {
        console.error("Error uploading image:", error);
        toast(
          "error",
          "Upload Failed",
          error?.error || "Could not upload image.",
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!form.firstname || !form.lastname || !form.email) {
      toast("error", "Missing Info", "Please fill required fields.");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast("error", "Invalid Email", "Please enter a valid email address.");
      return;
    }

    const digitsOnly = form.phoneNumber.replace(/\D/g, "");
    if (form.phoneNumber && digitsOnly.length !== 11) {
      toast("error", "Invalid Phone Number", "Phone number must be 11 digits.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateUserProfile({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        dob: form.dob.trim(),
        profileImage: form.profileImage,
      });

      if (response.status && response.data?.user) {
        const updated = response.data.user;
        setUser({
          ...user!,
          name: updated.name,
          email: updated.email,
          profileImage: updated.profileImage ?? FALLBACK_AVATAR,
          phoneNumber: updated.phoneNumber,
          dob: updated.dob,
        });
        toast("success", "Saved", "Profile updated successfully.");
        router.back();
      }
    } catch (error: any) {
      toast("error", "Error", error?.error || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDelete,
        },
      ],
    );
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const response = await deleteAccount();
      if (response.status) {
        await logout();
        router.replace("/(auth)/login");
      }
    } catch (error: any) {
      toast("error", "Error", error?.error || "Failed to delete account.");
    } finally {
      setIsDeleting(false);
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
            Edit Profile
          </ThemedText>
          <Pressable
            onPress={handleSave}
            disabled={isSaving || isUploading}
            style={({ pressed }) => [
              styles.saveButton,
              (isSaving || isUploading) && styles.saveDisabled,
              pressed && styles.savePressed,
            ]}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <ThemedText style={styles.saveText}>Save</ThemedText>
            )}
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: form.profileImage || FALLBACK_AVATAR }}
                style={[styles.avatar, { backgroundColor: colors.border }]}
              />
              <Pressable
                style={[styles.cameraButton, { borderColor: colors.card }]}
                onPress={pickImage}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <MaterialIcons
                    name="photo-camera"
                    size={16}
                    color={colors.white}
                  />
                )}
              </Pressable>
            </View>
          </View>

          <FormField
            label="First Name"
            value={form.firstname}
            style={{
              borderWidth: 1,
              borderColor: colors.inputBorder,
              borderRadius: 5,
              padding: 10,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            }}
            onChangeText={(value) => handleChange("firstname", value)}
            placeholder="Ibale"
          />
          <FormField
            label="Last Name"
            value={form.lastname}
            style={{
              borderWidth: 1,
              borderColor: colors.inputBorder,
              borderRadius: 5,
              padding: 10,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            }}
            onChangeText={(value) => handleChange("lastname", value)}
            placeholder="Matthew"
          />
          <FormField
            label="Email Address"
            value={form.email}
            editable={false}
            style={{
              borderWidth: 1,
              backgroundColor: colors.surface,
              borderColor: colors.inputBorder,
              borderRadius: 5,
              padding: 10,
              color: colors.textSecondary,
            }}
            onChangeText={(value) => handleChange("email", value)}
            placeholder="Ibalematthew@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormField
            label="Phone Number"
            value={form.phoneNumber}
            style={{
              borderWidth: 1,
              borderColor: colors.inputBorder,
              borderRadius: 5,
              padding: 10,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            }}
            onChangeText={(value) => handleChange("phoneNumber", value)}
            placeholder="08148062417"
            keyboardType="phone-pad"
          />
          <View style={styles.dobContainer}>
            <ThemedText style={[styles.dobLabel, { color: colors.text }]}>
              Date of Birth
            </ThemedText>
            <Pressable
              style={[
                styles.dobField,
                {
                  borderColor: colors.inputBorder,
                  backgroundColor: colors.card,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText
                style={[
                  styles.dobValue,
                  { color: colors.text },
                  !formattedDob && { color: colors.textPlaceholder },
                ]}
              >
                {formattedDob || "YYYY-MM-DD"}
              </ThemedText>
              <MaterialIcons
                name="calendar-today"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={parsedDob}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                minimumDate={new Date(1920, 0, 1)}
                onChange={handleDateChange}
              />
            )}
          </View>

          <Pressable
            onPress={confirmDelete}
            disabled={isDeleting}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deletePressed,
            ]}
          >
            <ThemedText style={styles.deleteText}>
              {isDeleting ? "Deleting..." : "Delete Account"}
            </ThemedText>
          </Pressable>
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
  saveButton: {
    minWidth: 48,
    alignItems: "flex-end",
  },
  saveText: {
    color: "#F77C0B",
    fontSize: 15,
    fontWeight: "600",
  },
  saveDisabled: {
    opacity: 0.5,
  },
  savePressed: {
    opacity: 0.7,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 18,
  },
  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F77C0B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  dobContainer: {
    marginBottom: 16,
  },
  dobLabel: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "400",
  },
  dobField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    minHeight: 44,
  },
  dobValue: {
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 10,
  },
  deleteText: {
    color: "#E11D48",
    fontSize: 15,
    fontWeight: "600",
  },
  deletePressed: {
    opacity: 0.6,
  },
});
