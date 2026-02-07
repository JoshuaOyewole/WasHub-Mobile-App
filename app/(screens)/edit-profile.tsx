import { ThemedText } from "@/components/themed-text";
import FormField from "@/components/ui/form-field";
import { Fonts } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import {
  deleteAccount,
  fetchUserProfile,
  updateUserProfile,
  uploadProfileImage,
} from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
              profileImage: response.data.user.profileImage ?? response.data.url,
              phoneNumber: response.data.user.phoneNumber,
              dob: response.data.user.dob,
            });
          }
        }
      } catch (error: any) {
        console.error("Error uploading image:", error);
        toast("error", "Upload Failed", error?.error || "Could not upload image.");
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
      toast(
        "error",
        "Invalid Phone Number",
        "Phone number must be 11 digits.",
      );
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={18} color="#F77C0B" />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Edit Profile</ThemedText>
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
              <ActivityIndicator size="small" color="#F77C0B" />
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
                style={styles.avatar}
              />
              <Pressable style={styles.cameraButton} onPress={pickImage}>
                {isUploading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialIcons
                    name="photo-camera"
                    size={16}
                    color="#FFFFFF"
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
              borderColor: "#e7e5e5",
              borderRadius: 5,
              paddingHorizontal: 10,
            }}
            onChangeText={(value) => handleChange("firstname", value)}
            placeholder="Ibale"
          />
          <FormField
            label="Last Name"
            value={form.lastname}
            style={{
              borderWidth: 1,
              borderColor: "#e7e5e5",
              borderRadius: 5,
              paddingHorizontal: 10,
            }}
            onChangeText={(value) => handleChange("lastname", value)}
            placeholder="Matthew"
          />
          <FormField
            label="Email Address"
            value={form.email}
            style={{
              borderWidth: 1,
              borderColor: "#e7e5e5",
              borderRadius: 5,
              paddingHorizontal: 10,
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
              borderColor: "#e7e5e5",
              borderRadius: 5,
              paddingHorizontal: 10,
            }}
            onChangeText={(value) => handleChange("phoneNumber", value)}
            placeholder="08148062417"
            keyboardType="phone-pad"
          />
          <FormField
            label="Date of Birth"
            value={form.dob}
            style={{
              borderWidth: 1,
              borderColor: "#e7e5e5",
              borderRadius: 5,
              paddingHorizontal: 10,
            }}
            onChangeText={(value) => handleChange("dob", value)}
            placeholder="18-September"
          />

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
    backgroundColor: "#F8F8F8",
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
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
    backgroundColor: "#E8E8E8",
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
    borderColor: "#FFFFFF",
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
