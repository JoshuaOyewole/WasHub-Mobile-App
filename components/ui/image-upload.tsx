import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/contexts/ToastContext";
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
};

export default function ImageUpload({
  label,
  value,
  onImageSelected,
}: ImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      toast(
        "error",
        "Permission Required",
        "Sorry, we need camera roll permissions to upload photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const localUri = result.assets[0].uri;

      try {
        setUploading(true);

        // Upload to Cloudinary
        const cloudinaryUrl = await uploadImageToCloudinary(localUri);

        // Pass the Cloudinary URL back
        onImageSelected(cloudinaryUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast(
          "error",
          "Upload Failed",
          "Failed to upload image. Please try again."
        );
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.uploadArea}
        onPress={pickImage}
        activeOpacity={0.7}
        disabled={uploading}
      >
        {uploading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F77C0B" />
            <Text style={styles.uploadingText}>Uploading...</Text>
          </View>
        ) : value ? (
          <Image source={{ uri: value }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.iconContainer}>
              <Feather name="image" size={32} color="#B0B0B0" />
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
    color: "#1F2D33",
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
    color: "#F77C0B",
    fontWeight: "500",
  },
  uploadArea: {
    backgroundColor: "#F5F5F5",

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
    backgroundColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
