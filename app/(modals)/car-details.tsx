import { fetchVehicleById } from "@/lib/api/vehicles";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CarDetailsModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vehicleId: string }>();
  const { user } = useAuthStore();
  const translateY = useRef(new Animated.Value(0)).current;

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

  // Protect route - redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/login");
    }
  }, [user, router]);

  // Use React Query to fetch vehicle details with automatic caching
  const {
    data: vehicleResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vehicle", params.vehicleId],
    queryFn: () => fetchVehicleById(params.vehicleId!),
    enabled: !!params.vehicleId && !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const carDetails = vehicleResponse?.data || null;

  // Redirect back if error or no vehicle ID
  useEffect(() => {
    if (!params.vehicleId || (isError && !isLoading)) {
      router.back();
    }
  }, [params.vehicleId, isError, isLoading]);

  const handleEdit = () => {
    // Replace current modal with edit modal
    router.replace({
      pathname: "/(modals)/edit-car-details",
      params: { vehicleId: params.vehicleId },
    });
  };

  const handleClose = () => {
    router.back();
  };

  // Don't render if user is not authenticated
  if (!user) {
    return null;
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
              <Text style={styles.headerTitle}>Car details</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEdit}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F77C0B" />
              </View>
            ) : carDetails ? (
              <>
                {/* Car Make */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Car Make</Text>
                  <View style={styles.fieldValue}>
                    <Text style={styles.fieldText}>
                      {carDetails.vehicleMake}
                    </Text>
                  </View>
                </View>

                {/* Car Model */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Car Model</Text>
                  <View style={styles.fieldValue}>
                    <Text style={styles.fieldText}>
                      {carDetails.vehicleModel}
                    </Text>
                  </View>
                </View>

                {/* Car Year */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Car Year</Text>
                  <View style={styles.fieldValue}>
                    <Text style={styles.fieldText}>
                      {carDetails.vehicleYear}
                    </Text>
                  </View>
                </View>

                {/* Car Color */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Car Color</Text>
                  <View style={styles.fieldValue}>
                    <Text style={styles.fieldText}>
                      {carDetails.vehicleColor || "N/A"}
                    </Text>
                  </View>
                </View>

                {/* Plate Number */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Plate Number</Text>
                  <View style={styles.fieldValue}>
                    <Text style={styles.fieldText}>
                      {carDetails.plateNumber}
                    </Text>
                  </View>
                </View>

                {/* Vehicle Type */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Vehicle Type</Text>
                  <View style={styles.fieldValue}>
                    <Text style={styles.fieldText}>
                      {carDetails.vehicleType}
                    </Text>
                  </View>
                </View>

                {/* Photo */}
                {carDetails.image && (
                  <View style={styles.photoContainer}>
                    <Image
                      source={{ uri: carDetails.image }}
                      style={styles.carPhoto}
                    />
                  </View>
                )}
              </>
            ) : null}
          </ScrollView>
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
  editButton: {
    position: "absolute",
    right: 0,
  },
  editButtonText: {
    fontSize: 16,
    color: "#F77C0B",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#1F2D33",
    marginBottom: 8,
    fontWeight: "400",
  },
  fieldValue: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    justifyContent: "center",
  },
  fieldText: {
    fontSize: 14,
    color: "#1F2D33",
  },
  photoContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    overflow: "hidden",
    height: 200,
  },
  carPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
