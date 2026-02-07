import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import ImageUpload from "@/components/ui/image-upload";
import { useToast } from "@/contexts/ToastContext";
import {
  fetchVehicleById,
  updateVehicle,
  type Vehicle,
} from "@/lib/api/vehicles";
import { useAuthStore } from "@/store/useAuthStore";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CarFormData = {
  make: string;
  model: string;
  year: string;
  color: string;
  plateNumber: string;
  photo: string | null;
  vehicleType: string;
};

export default function EditCarDetailsModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vehicleId: string }>();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const translateY = useRef(new Animated.Value(0)).current;

  // Fetch vehicle data with React Query
  const {
    data: vehicleResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["vehicle", params.vehicleId],
    queryFn: () => fetchVehicleById(params.vehicleId!),
    enabled: !!params.vehicleId && !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const vehicle = vehicleResponse?.data || null;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            router.back();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  // Form state
  const [formData, setFormData] = useState<CarFormData>({
    make: "",
    model: "",
    year: "",
    color: "",
    plateNumber: "",
    photo: null,
    vehicleType: "",
  });

  // Protect route - redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/login");
    }
  }, [user, router]);

  // Update form data when vehicle loads
  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.vehicleMake,
        model: vehicle.vehicleModel,
        year: vehicle.vehicleYear,
        color: vehicle.vehicleColor || "",
        plateNumber: vehicle.plateNumber,
        photo: vehicle.image || null,
        vehicleType: vehicle.vehicleType,
      });
    }
  }, [vehicle]);

  // Redirect back if error or no vehicle ID
  useEffect(() => {
    if (!params.vehicleId || (isError && !isLoading)) {
      toast("error", "Error", "Failed to load vehicle details");
      setTimeout(() => router.back(), 1500);
    }
  }, [params.vehicleId, isError, isLoading]);

  // Mutation for updating vehicle
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Vehicle>) =>
      updateVehicle(params.vehicleId!, data),
    onSuccess: (res) => {
      if (res.status) {
        // Invalidate queries to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        queryClient.invalidateQueries({
          queryKey: ["vehicle", params.vehicleId],
        });
        toast("success", "Success", "Vehicle updated successfully");
        setTimeout(() => router.back(), 1500);
      }
    },
    onError: (error: any) => {
      console.log("Error updating vehicle:", error);
      toast("error", "Error", error.error || "Failed to update vehicle");
    },
  });

  const handleSave = async () => {
    // Validate required fields
    if (
      !formData.make ||
      !formData.model ||
      !formData.year ||
      !formData.plateNumber
    ) {
      toast("error", "Error", "Please fill in all required fields");
      return;
    }

    updateMutation.mutate({
      vehicleMake: formData.make,
      vehicleModel: formData.model,
      vehicleYear: formData.year,
      vehicleColor: formData.color,
      plateNumber: formData.plateNumber,
      image: formData.photo || undefined,
      vehicleType: formData.vehicleType,
    });
  };

  const handleClose = () => {
    router.back();
  };

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#F77C0B" />
          <Text style={styles.loadingText}>Loading vehicle details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.modalOverlay}>
      <Animated.View
        style={[
          styles.modalContent,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <View style={styles.header} {...panResponder.panHandlers}>
            <View style={styles.headerHandle} />
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Edit Car details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={24} color="#F77C0B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <FormField
              label="Car Make"
              value={formData.make}
              onChangeText={(text) => setFormData({ ...formData, make: text })}
              placeholder="e.g., Toyota"
            />

            <FormField
              label="Car Model"
              value={formData.model}
              onChangeText={(text) => setFormData({ ...formData, model: text })}
              placeholder="e.g., Camry"
            />

            <FormField
              label="Car Year"
              value={formData.year}
              onChangeText={(text) => setFormData({ ...formData, year: text })}
              placeholder="e.g., 2023"
              keyboardType="numeric"
            />

            <FormField
              label="Car Color"
              value={formData.color}
              onChangeText={(text) => setFormData({ ...formData, color: text })}
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
              label="Add Photo"
              value={formData.photo}
              onImageSelected={(uri) =>
                setFormData({ ...formData, photo: uri })
              }
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Button
              title={updateMutation.isPending ? "Saving..." : "Save"}
              onPress={handleSave}
              variant="primary"
              disabled={updateMutation.isPending}
            />
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: "90%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2D33",
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});
