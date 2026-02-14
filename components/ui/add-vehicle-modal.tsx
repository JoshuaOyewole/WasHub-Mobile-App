import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import FormPicker from "@/components/ui/form-picker";
import ImageUpload from "@/components/ui/image-upload";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { createVehicle } from "@/lib/api/vehicles";
import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type VehicleData = {
  vehicleType: string;
  make: string;
  model: string;
  year: string;
  color: string;
  plateNumber: string;
  photo: string | null;
};

type AddVehicleModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (vehicleData: VehicleData) => void;
};

const VEHICLE_TYPES = [
  { label: "Sedan", value: "sedan" },
  { label: "SUV", value: "suv" },
  { label: "Truck", value: "truck" },
  { label: "Van", value: "van" },
  { label: "Coupe", value: "coupe" },
  { label: "Hatchback", value: "hatchback" },
];

export default function AddVehicleModal({
  visible,
  onClose,
  onSave,
}: AddVehicleModalProps) {
  const { toast } = useToast();
  const colors = useTheme();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<VehicleData>({
    vehicleType: "",
    make: "",
    model: "",
    year: "",
    color: "",
    plateNumber: "",
    photo: null,
  });

  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward swipes
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // If swiped down more than 100px, close the modal
          Animated.timing(translateY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            handleClose();
          });
        } else {
          // Otherwise, spring back to original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const handleSave = async () => {
    // Validate form data
    if (
      !formData.vehicleType ||
      !formData.make ||
      !formData.model ||
      !formData.plateNumber
    ) {
      toast("error", "Validation Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const response = await createVehicle({
        vehicleType: formData.vehicleType,
        vehicleMake: formData.make,
        vehicleModel: formData.model,
        vehicleYear: formData.year,
        vehicleColor: formData.color,
        plateNumber: formData.plateNumber,
        imageUri: formData.photo || undefined,
      });

      if (response.status) {
        toast("success", "Success", "Vehicle added successfully!");
        onSave(formData);
        setTimeout(() => handleClose(), 1500);
      } else {
        toast("error", "Error", response.error || "Failed to add vehicle");
      }
    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      toast("error", "Error", error.error || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      vehicleType: "",
      make: "",
      model: "",
      year: "",
      color: "",
      plateNumber: "",
      photo: null,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View
        style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}
      >
        <Animated.View
          style={[
            styles.modalContent,
            { backgroundColor: colors.card },
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.card }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {/* Header */}
            <View
              style={[styles.header, { borderBottomColor: colors.borderLight }]}
              {...panResponder.panHandlers}
            >
              <View
                style={[
                  styles.headerHandle,
                  { backgroundColor: colors.divider },
                ]}
              />
              <View style={styles.headerContent}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                  New vehicle
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="x" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Please, type in details of your vehicle.
              </Text>
            </View>

            {/* Form */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.formContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FormPicker
                label="Type of Vehicle"
                value={formData.vehicleType}
                onValueChange={(value) =>
                  setFormData({ ...formData, vehicleType: value })
                }
                options={VEHICLE_TYPES}
                placeholder="Select vehicle type"
              />

              <FormField
                label="Car Make"
                value={formData.make}
                onChangeText={(text) =>
                  setFormData({ ...formData, make: text })
                }
                placeholder="e.g., Toyota"
              />

              <FormField
                label="Car Model"
                value={formData.model}
                onChangeText={(text) =>
                  setFormData({ ...formData, model: text })
                }
                placeholder="e.g., Camry"
              />

              <FormField
                label="Car Year"
                value={formData.year}
                onChangeText={(text) =>
                  setFormData({ ...formData, year: text })
                }
                placeholder="e.g., 2023"
                keyboardType="numeric"
              />

              <FormField
                label="Car Color"
                value={formData.color}
                onChangeText={(text) =>
                  setFormData({ ...formData, color: text })
                }
                placeholder="e.g., Black"
              />

              <FormField
                label="Plate Number"
                value={formData.plateNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, plateNumber: text })
                }
                placeholder="e.g., ABC-1234"
                autoCapitalize="characters"
              />

              <ImageUpload
                label="Add Photo (Max 1MB)"
                value={formData.photo}
                onImageSelected={(uri) =>
                  setFormData({ ...formData, photo: uri })
                }
                uploadFn={async (localUri) => localUri}
                onUploadingChange={setUploadingImage}
              />
            </ScrollView>

            {/* Footer */}
            <View
              style={[styles.footer, { borderTopColor: colors.borderLight }]}
            >
              <Button
                title={
                  uploadingImage
                    ? "Uploading image..."
                    : loading
                      ? "Saving..."
                      : "Save"
                }
                onPress={handleSave}
                variant="primary"
                loading={loading}
                disabled={loading || uploadingImage}
              />
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "95%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    borderTopWidth: 1,
  },
});
