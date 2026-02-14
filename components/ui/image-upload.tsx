import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ImageUploadProps = {
  label: string;
  value: string | null;
  onImageSelected: (uri: string) => void;
  uploadFn: (localUri: string, oldImageUrl?: string) => Promise<string>;
  onUploadingChange?: (uploading: boolean) => void;
  maxSizeMB?: number;
};

export default function ImageUpload({
  label,
  value,
  onImageSelected,
  uploadFn,
  onUploadingChange,
  maxSizeMB = 2,
}: ImageUploadProps) {
  const { toast } = useToast();
  const colors = useTheme();
  const [uploading, setUploading] = useState(false);

  const setUploadingState = (state: boolean) => {
    setUploading(state);
    onUploadingChange?.(state);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      toast(
        "error",
        "Permission Required",
        "Sorry, we need camera roll permissions to upload photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const localUri = asset.uri;

      // Client-side file size check
      if (asset.fileSize && asset.fileSize > maxSizeMB * 1024 * 1024) {
        toast(
          "error",
          "Image Too Large",
          `Please select an image smaller than ${maxSizeMB}MB.`,
        );
        return;
      }

      try {
        setUploadingState(true);

        // Upload via the provided upload function, passing old URL for cleanup
        const imageUrl = await uploadFn(localUri, value || undefined);

        // Pass the uploaded URL back
        onImageSelected(imageUrl);
      } catch (error: any) {
        console.error("Error uploading image:", error);

        // Surface specific server errors (e.g. file too large from multer)
        const message =
          error?.response?.data?.error ||
          error?.message ||
          "Failed to upload image. Please try again.";

        toast("error", "Upload Failed", message);
      } finally {
        setUploadingState(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.uploadArea, { backgroundColor: colors.inputBackground }]}
        onPress={pickImage}
        activeOpacity={0.7}
        disabled={uploading}
      >
        {uploading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.uploadingText, { color: colors.primary }]}>
              Uploading...
            </Text>
          </View>
        ) : value ? (
          <Image source={{ uri: value }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <View
              style={[styles.iconContainer, { backgroundColor: colors.border }]}
            >
              <Feather name="image" size={32} color={colors.textPlaceholder} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "400",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  uploadArea: {
    borderRadius: 8,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
