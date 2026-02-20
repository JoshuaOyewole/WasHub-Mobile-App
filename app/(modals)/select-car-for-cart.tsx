import EmptyState from "@/components/ui/empty-state";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import {
  addVehicleToWash,
  fetchVehicles,
  type Vehicle,
} from "@/lib/api/vehicles";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function SelectCarForCart() {
  const colors = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
const insets = useSafeAreaInsets();
  // Fetch vehicles (not in wishlist)
  const {
    data: vehiclesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => fetchVehicles(),
  });

  // Mutation to add vehicle to cart
  const addToCartMutation = useMutation({
    mutationFn: addVehicleToWash,
    onSuccess: () => {
      toast("success", "Added to Cart", "Vehicle added to your wash cart");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles", "wishlist"] });
      // Navigate back to cart
      router.back();
    },
    onError: (error: any) => {
      toast("error", "Failed", error?.error || "Failed to add vehicle to cart");
    },
  });

  const vehicles: Vehicle[] = vehiclesResponse?.data || [];

  // Filter out vehicles already in wishlist and apply search
  const availableVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return !vehicle.inWishlist && matchesSearch;
  });

  const handleLongPress = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowConfirmModal(true);
  };

  const handleConfirmAddToCart = () => {
    if (selectedVehicle) {
      addToCartMutation.mutate(selectedVehicle._id);
      setShowConfirmModal(false);
      setSelectedVehicle(null);
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    setSelectedVehicle(null);
  };

  return (
    <SafeAreaView  style={[
            styles.container,
            {
              backgroundColor: colors.background,
              paddingBottom: (Platform.OS === "ios" ? 20 : 0) + insets.bottom || 0,
            },
          ]}
          edges={["top"]}>
      <StatusBar
        barStyle={colors.statusBarStyle}
       backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Select car to add to Cart
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading vehicles...
          </Text>
        </View>
      ) : availableVehicles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            image={require("@/assets/images/my_wash_no-request.png")}
            title={
              searchQuery ? "No vehicles found" : "All vehicles are in cart"
            }
          />
          <Text style={styles.hintText}>
            {searchQuery
              ? "Try a different search term"
              : "You can add more vehicles from the booking tab"}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {availableVehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle._id}
              style={[
                styles.carCard,
                { backgroundColor: colors.card, shadowColor: colors.shadow },
              ]}
              onPress={() => handleLongPress(vehicle)}
              activeOpacity={0.7}
            >
              {/* Car Image */}
              <View
                style={[
                  styles.imageContainer,
                  { backgroundColor: colors.surfaceAlt },
                ]}
              >
                <Image
                  source={
                    vehicle.image
                      ? { uri: vehicle.image }
                      : require("@/assets/images/toyota_prado.png")
                  }
                  style={styles.carImage}
                  resizeMode="cover"
                />
              </View>

              {/* Car Details */}
              <View style={styles.detailsContainer}>
                <Text style={[styles.carBrand, { color: colors.text }]}>
                  {vehicle.vehicleMake} {vehicle.vehicleModel}
                </Text>

                <View style={styles.infoRow}>
                  <Feather name="calendar" size={14} color={colors.textMuted} />
                  <Text style={[styles.infoText, { color: colors.textMuted }]}>
                    {vehicle.vehicleYear}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Feather
                    name="credit-card"
                    size={14}
                    color={colors.textMuted}
                  />
                  <Text style={[styles.infoText, { color: colors.textMuted }]}>
                    {vehicle.plateNumber}
                  </Text>
                </View>

                {vehicle.vehicleColor && (
                  <View style={styles.infoRow}>
                    <Feather
                      name="droplet"
                      size={14}
                      color={colors.textMuted}
                    />
                    <Text
                      style={[styles.infoText, { color: colors.textMuted }]}
                    >
                      {vehicle.vehicleColor}
                    </Text>
                  </View>
                )}
              </View>

              {/* Long Press Indicator */}
              <View style={styles.iconContainer}>
                <Feather name="plus-circle" size={24} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelModal}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: colors.modalOverlay },
          ]}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View
              style={[
                styles.modalHeader,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Feather name="shopping-cart" size={32} color={colors.white} />
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add to Cart?
            </Text>
            <Text style={[styles.modalMessage, { color: colors.textMuted }]}>
              Do you want to add{" "}
              <Text style={[styles.vehicleName, { color: colors.text }]}>
                {selectedVehicle?.vehicleMake} {selectedVehicle?.vehicleModel}
              </Text>{" "}
              to your wash cart?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.surfaceAlt },
                ]}
                onPress={handleCancelModal}
                disabled={addToCartMutation.isPending}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleConfirmAddToCart}
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text
                    style={[styles.confirmButtonText, { color: colors.white }]}
                  >
                    Yes, Add
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  hintText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
    padding: 12,
    borderRadius: 8,
  },
  carCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  carBrand: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    marginLeft: 6,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalHeader: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  vehicleName: {
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
