import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { useBooking } from "@/contexts/BookingContext";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import {
  fetchVehicles,
  removeVehicleFromWash,
  type Vehicle,
} from "@/lib/api/vehicles";
import {
  WashRequest as ApiWashRequest,
  fetchWashRequests,
} from "@/lib/api/washRequests";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabType = "my-wash" | "scheduled" | "ongoing" | "completed";

export type WashRequest = {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "pending" | "ongoing" | "completed";
};

export default function Request() {
  const [activeTab, setActiveTab] = useState<TabType>("my-wash");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const colors = useTheme();
  const queryClient = useQueryClient();
  const { setCarId, clearBooking, setOutletId, setWashType, setPrice } =
    useBooking();

  // Fetch wishlist vehicles (cars added to cart)
  const {
    data: wishlistData,
    isLoading: isLoadingWishlist,
    isError: isErrorWishlist,
    refetch: refetchWishlist,
  } = useQuery({
    queryKey: ["vehicles", "wishlist"],
    queryFn: () => fetchVehicles(true),
    staleTime: 30000,
  });

  // Fetch wash requests from API
  const {
    data: washRequestsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["washRequests"],
    queryFn: () => fetchWashRequests(),
    staleTime: 30000, // 30 seconds
    refetchInterval:
      activeTab === "ongoing" || activeTab === "scheduled" ? 60000 : false, // Poll every 60 seconds for active requests
  });

  // Filter requests based on active tab
  const getFilteredRequests = (): ApiWashRequest[] => {
    if (!washRequestsData?.data) return [];

    if (activeTab === "scheduled") {
      return washRequestsData.data.filter((req) => req.status === "scheduled");
    } else if (activeTab === "ongoing") {
      const ongoingStatuses = [
        "order_received",
        "vehicle_checked",
        "in_progress",
        "drying_finishing",
        "ready_for_pickup",
      ];
      return washRequestsData.data.filter((req) =>
        ongoingStatuses.includes(req.status),
      );
    } else if (activeTab === "completed") {
      return washRequestsData.data.filter((req) => req.status === "completed");
    }
    return [];
  };

  const filteredRequests = getFilteredRequests();
  const wishlistVehicles = wishlistData?.data || [];
  const hasRequests =
    activeTab === "my-wash"
      ? wishlistVehicles.length > 0
      : filteredRequests.length > 0;

  // Get empty state image based on active tab
  const getEmptyStateImage = () => {
    if (activeTab === "my-wash") {
      return require("@/assets/images/my_wash_no-request.png");
    } else if (activeTab === "ongoing") {
      return require("@/assets/images/ongoing_no_request.png");
    } else {
      return require("@/assets/images/no_request_completed.png");
    }
  };

  // Get empty state message based on active tab
  const getEmptyStateMessage = () => {
    if (activeTab === "my-wash") {
      return { title: "Your cart is empty" , description: "Add cars to your wash cart and book a wash"};
    } else if (activeTab === "scheduled") {
      return { title: "No scheduled wash", description: "You have no scheduled washes at the moment" };
    } else if (activeTab === "ongoing") {
      return { title: "No ongoing wash", description:"Time to give your car a clean wash" };
    } else {
      return { title: "No completed wash", description: "You have not completed any washes yet" };
    }
  };

  const handleAddCarToWashCart = () => {
    router.push("/(modals)/select-car-for-cart");
  };
  const handleAddCarToWash = () => {
    router.push("/(screens)/select-car");
  };
  // Mutation to remove vehicle from cart
  const removeFromCartMutation = useMutation({
    mutationFn: removeVehicleFromWash,
    onSuccess: () => {
      toast("success", "Removed", "Vehicle removed from your cart");
      queryClient.invalidateQueries({ queryKey: ["vehicles", "wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setShowRemoveModal(false);
      setSelectedVehicle(null);
    },
    onError: (error: any) => {
      toast(
        "error",
        "Failed",
        error?.error || "Failed to remove vehicle from cart",
      );
    },
  });

  const handleLongPressVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (selectedVehicle) {
      removeFromCartMutation.mutate(selectedVehicle._id);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedVehicle(null);
  };

  const handleWashNow = (vehicleId: string) => {
    // Clear any previous booking data
    clearBooking();
    // Set the vehicle ID in booking context
    setCarId(vehicleId);
    // Navigate to outlets selection screen (Step 2 of booking flow)
    router.push("/(screens)/car-wash-outlets");
  };

  const handleViewRequest = (requestId: string) => {
    router.push(`/(screens)/wash-request-details?id=${requestId}`);
  };

  const handleRebook = (requestId: string) => {
    // Find the wash request from the data
    const washRequest = washRequestsData?.data?.find(
      (req) => req._id === requestId,
    );

    if (!washRequest) {
      toast("error", "Error", "Unable to find wash request details");
      return;
    }

    Alert.alert(
      "Rebook Wash",
      `Do you want to book another ${capitalizeFirstLetter(washRequest.serviceType)} for your ${washRequest.vehicleInfo.vehicleMake} ${washRequest.vehicleInfo.vehicleModel}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Rebook",
          onPress: () => {
            // Clear any existing booking data
            clearBooking();

            // Map service type to wash type format
            const washTypeMap: Record<
              string,
              "Quick Wash" | "Basic" | "Premium"
            > = {
              "quick wash": "Quick Wash",
              "full wash": "Basic",
              "premium wash": "Premium",
            };

            const washType = washTypeMap[washRequest.serviceType.toLowerCase()];

            if (!washType) {
              toast("error", "Error", "Invalid service type");
              return;
            }

            // Pre-fill booking context with previous wash details
            setCarId(washRequest.vehicleId);
            setOutletId(washRequest.outletId);
            setWashType(washType);
            setPrice(washRequest.price);

            // Navigate to car wash outlets screen (allows user to change outlet if desired)
            router.push("/(screens)/car-wash-outlets");

            toast(
              "success",
              "Booking Started",
              "Your previous wash details have been loaded. You can modify them if needed.",
            );
          },
        },
      ],
    );
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), refetchWishlist()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container,
      { backgroundColor: colors.background }]}
    >
      {/* Tabs */}
      <View
        style={[
          styles.tabsContainer,
          { backgroundColor: colors.card, shadowColor: colors.shadow },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "my-wash" && [
              styles.activeTab,
              { backgroundColor: colors.secondary },
            ],
          ]}
          onPress={() => setActiveTab("my-wash")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.textMuted },
              activeTab === "my-wash" && { color: colors.white },
            ]}
          >
            My Cart
            {wishlistVehicles.length > 0 ? (
              <Text style={styles.badgeText}> ({wishlistVehicles.length})</Text>
            ) : null}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "scheduled" && [
              styles.activeTab,
              { backgroundColor: colors.secondary },
            ],
          ]}
          onPress={() => setActiveTab("scheduled")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.textMuted },
              activeTab === "scheduled" && { color: colors.white },
            ]}
          >
            Scheduled
            {washRequestsData?.meta?.pending ? (
              <Text style={styles.badgeText}>
                {" "}
                ({washRequestsData.meta.pending})
              </Text>
            ) : null}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "ongoing" && [
              styles.activeTab,
              { backgroundColor: colors.secondary },
            ],
          ]}
          onPress={() => setActiveTab("ongoing")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.textMuted },
              activeTab === "ongoing" && { color: colors.white },
            ]}
          >
            Ongoing
            {washRequestsData?.meta?.ongoing ? (
              <Text style={styles.badgeText}>
                {" "}
                ({washRequestsData.meta.ongoing})
              </Text>
            ) : null}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "completed" && [
              styles.activeTab,
              { backgroundColor: colors.secondary },
            ],
          ]}
          onPress={() => setActiveTab("completed")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.textMuted },
              activeTab === "completed" && { color: colors.white },
            ]}
          >
            Completed
            {washRequestsData?.meta?.completed ? (
              <Text style={styles.badgeText}>
                {" "}
                ({washRequestsData.meta.completed})
              </Text>
            ) : null}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentArea}>
        {isLoading || isLoadingWishlist ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F77C0B" />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>
              Loading wash requests...
            </Text>
          </View>
        ) : isError || isErrorWishlist ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              Failed to load data
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                refetch();
                refetchWishlist();
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !hasRequests ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              image={getEmptyStateImage()}
              title={getEmptyStateMessage().title}
              description={getEmptyStateMessage().description}
            />
            <View style={styles.buttonContainer}>
              <Button
                title={
                  activeTab === "my-wash"
                    ? "Add Car to wash cart"
                    : "Book a wash"
                }
                variant="secondary"
                onPress={
                  activeTab === "my-wash"
                    ? handleAddCarToWashCart
                    : handleAddCarToWash
                }
              />
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#F77C0B"]}
                tintColor="#F77C0B"
              />
            }
          >
            {activeTab === "my-wash"
              ? // Render wishlist vehicles
              wishlistVehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle._id}
                  style={[
                    styles.requestCard,
                    {
                      backgroundColor: colors.card,
                      shadowColor: colors.shadow,
                    },
                  ]}
                  onLongPress={() => handleLongPressVehicle(vehicle)}
                  delayLongPress={500}
                  activeOpacity={0.9}
                >
                  <View style={styles.requestInfo}>
                    <Text style={[styles.requestTitle, { color: colors.text }]}>
                      {vehicle.vehicleMake} {vehicle.vehicleModel}
                    </Text>
                    <Text
                      style={[
                        styles.requestService,
                        { color: colors.textPlaceholder },
                      ]}
                    >
                      {vehicle.vehicleYear}
                    </Text>
                    <Text
                      style={[
                        styles.requestService,
                        { color: colors.textPlaceholder },
                      ]}
                    >
                      {vehicle.plateNumber}
                    </Text>
                  </View>
                  <View style={styles.actionsContainer}>
                    {/* Delete Button - Top Right */}
                    <TouchableOpacity
                      style={[
                        styles.deleteIconButton,
                        { backgroundColor: colors.errorBg },
                      ]}
                      onPress={() => handleLongPressVehicle(vehicle)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons
                        name="delete"
                        size={16}
                        color={colors.error}
                      />
                    </TouchableOpacity>
                    <View style={styles.requestActions}>
                      <TouchableOpacity
                        style={[
                          styles.washNowButton,
                          { backgroundColor: colors.primary },
                        ]}
                        onPress={() => handleWashNow(vehicle._id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.washNowText}>Wash Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
              : activeTab === "completed"
                ? filteredRequests.map((request) => (
                  <View
                    key={request._id}
                    style={{
                      backgroundColor: colors.card,
                      flexDirection: "row",
                      gap: 12,
                      paddingVertical: 2,
                      borderRadius: 10,
                      marginBottom: 12,
                      shadowColor: colors.shadow,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleViewRequest(request._id)}
                      activeOpacity={0.7}
                      style={{ flex: 1 }}
                    >
                      <View style={styles.requestInfo}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Text
                            style={[
                              styles.requestTitle,
                              { color: colors.text },
                            ]}
                          >
                            {request.vehicleInfo.vehicleMake}{" "}
                            {request.vehicleInfo.vehicleModel} -
                          </Text>
                          <Text style={{ color: colors.primary }}>
                            {" "}
                            {capitalizeFirstLetter(request.serviceType)}
                          </Text>
                        </View>

                        {/*  
                          {capitalizeFirstLetter(request.serviceType)}
                        </Text> */}
                        <Text
                          style={[
                            styles.requestLocation,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {request.outletName}, {request.outletLocation}
                        </Text>
                        <Text
                          style={[
                            styles.requestService,
                            { color: colors.textPlaceholder },
                          ]}
                        >
                          Completed on: {formatDate(request.completedAt || "")}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.requestActions}>
                      {/* Rebook button */}
                      <TouchableOpacity
                        style={{
                          ...styles.viewButton,
                          backgroundColor: colors.divider,
                          width: 42,
                          height: 42,
                          flex: 0,
                          padding: 0,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => handleRebook(request._id)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="reload-outline"
                          size={24}
                          color={colors.iconMuted}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
                : // Render wash requests
                filteredRequests.map((request) => (
                  <TouchableOpacity
                    key={request._id}
                    style={[
                      styles.requestCard,
                      {
                        backgroundColor: colors.card,
                        shadowColor: colors.shadow,
                      },
                    ]}
                    onPress={() => handleViewRequest(request._id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.requestInfo}>
                      <Text
                        style={[styles.requestTitle, { color: colors.text }]}
                      >
                        {request.vehicleInfo.vehicleMake}{" "}
                        {request.vehicleInfo.vehicleModel}
                      </Text>
                      <Text
                        style={[
                          styles.requestService,
                          { color: colors.textPlaceholder },
                        ]}
                      >
                        {capitalizeFirstLetter(request.serviceType)}
                      </Text>
                      <Text
                        style={[
                          styles.requestLocation,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {request.outletLocation}
                      </Text>
                      <Text
                        style={[
                          styles.requestWashCode,
                          { color: colors.primary },
                        ]}
                      >
                        {request.createdAt
                          ? formatDate(request.createdAt)
                          : "N/A"}
                      </Text>
                    </View>
                    <View style={styles.requestActions}>
                      <Text style={[styles.priceText, { color: colors.text }]}>
                        &#8358;{request.price.toLocaleString()}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.viewButton,
                          { backgroundColor: colors.secondary },
                        ]}
                        onPress={() => handleViewRequest(request._id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.viewButtonText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
          </ScrollView>
        )}
      </View>

      {/* Remove from Cart Modal */}
      <Modal
        visible={showRemoveModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelRemove}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: colors.modalOverlay },
          ]}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View
              style={[styles.modalHeader, { backgroundColor: colors.errorBg }]}
            >
              <MaterialIcons name="delete" size={16} color={colors.error} />
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Remove from Cart?
            </Text>
            <Text style={[styles.modalMessage, { color: colors.textMuted }]}>
              Do you want to remove{" "}
              <Text style={[styles.vehicleName, { color: colors.text }]}>
                {selectedVehicle?.vehicleMake} {selectedVehicle?.vehicleModel}
              </Text>{" "}
              from your wash cart?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  { backgroundColor: colors.surface },
                ]}
                onPress={handleCancelRemove}
                disabled={removeFromCartMutation.isPending}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  No
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  { backgroundColor: colors.error },
                ]}
                onPress={handleConfirmRemove}
                disabled={removeFromCartMutation.isPending}
              >
                {removeFromCartMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Yes, Remove</Text>
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
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 2,
    paddingVertical: Platform.OS === "ios" ? 10 : 7,
    columnGap: 4,
    rowGap: 6,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 10,
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === "ios" ? 15 : 11,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {},
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  activeTabText: {},
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  contentArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    minHeight: "100%",
    padding: 20,
  },
  requestCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },

  requestInfo: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 12,
    paddingLeft: 12,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  requestService: {
    fontWeight: "500",
    marginBottom: 4,
    fontSize: 14,
  },
  requestWashCode: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  actionsContainer: {
    flex: 0,

    paddingVertical: 6,
    paddingRight: 8,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  requestDate: {
    fontSize: 11,
    marginTop: 4,
  },
  requestLocation: {
    fontSize: 14,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  requestActions: {
    gap: 8,
    flex: 0,
    justifyContent: "center",
    paddingVertical: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right",
    paddingRight: 10,
  },
  deleteIconButton: {
    width: 22,
    height: 22,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  washNowButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  washNowText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
  },
  viewButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
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
  cancelButton: {},
  confirmButton: {},
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
