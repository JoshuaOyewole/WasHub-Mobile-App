const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_FOLDER = process.env.EXPO_PUBLIC_CLOUDINARY_FOLDER || "cars";

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
};

export const uploadImageToCloudinary = async (
  imageUri: string,
): Promise<string> => {
  try {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary configuration is missing. Please set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env file",
      );
    }

    // Determine the file extension
    const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `photo_${Date.now()}.${fileExtension}`;
    const mimeType = `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`;

    // Create form data using the new File API
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: mimeType,
      name: fileName,
    } as any);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", CLOUDINARY_FOLDER);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Failed to upload image to Cloudinary",
      );
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export const deleteImageFromCloudinary = async (
  publicId: string,
): Promise<void> => {
  try {
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary configuration is missing");
    }

    // Note: For deletion, you typically need to do this from your backend
    // because it requires API secret. This is just a placeholder.
    console.warn(
      "Image deletion should be handled by your backend with proper authentication",
    );
    console.log("Public ID to delete:", publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};
