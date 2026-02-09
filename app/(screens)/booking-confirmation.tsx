import Button from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { fetchOutletById, IOutlet } from "@/lib/api";
import {
    fetchVehicleById,
    removeVehicleFromWash,
    Vehicle,
} from "@/lib/api/vehicles";
import { createWashRequest } from "@/lib/api/washRequests";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingConfirmationScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const { booking, clearBooking } = useBooking();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { data: vehicleData, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicle", booking.carId],
    queryFn: () => fetchVehicleById(booking.carId!),
    enabled: !!booking.carId,
  });

  const { data: outletData, isLoading: isLoadingOutlet } = useQuery({
    queryKey: ["outlet", booking.outletId],
    queryFn: () => fetchOutletById(booking.outletId!),
    enabled: !!booking.outletId,
  });

  const vehicle: Vehicle | undefined = vehicleData?.data;
  const outlet: IOutlet | undefined = outletData?.data;

  // Mutation for creating wash request
  const createWashRequestMutation = useMutation({
    mutationFn: createWashRequest,
    onSuccess: async () => {
      // Remove vehicle from cart after successful booking
      // Only remove if the vehicle is actually in the wishlist
      if (booking.carId && vehicle?.inWishlist) {
        try {
          await removeVehicleFromWash(booking.carId);
          console.log("✅ Vehicle removed from cart after successful booking");
        } catch (error) {
          console.error("Error removing vehicle from cart:", error);
          // Don't block the success flow if removal fails
        }
      }

      toast(
        "success",
        "Booking Successful!",
        "Your car wash has been scheduled",
      );
      clearBooking();
      // Navigate to requests tab to see the new booking
      router.replace("/(tabs)/request");
    },
    onError: (error: any) => {
      toast(
        "error",
        "Booking Failed",
        error?.error || "Failed to create wash request. Please try again.",
      );
      setIsProcessingPayment(false);
    },
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Helper to format service type to match backend enum
  // Valid backend enum: ["quick wash", "premium wash", "full wash"]
  const formatServiceType = (washType: string): string => {
    const type = washType.toLowerCase().trim();

    // Map frontend wash types to backend enum values
    if (type === "quick wash") return "quick wash";
    if (type === "basic") return "full wash";
    if (type === "premium") return "premium wash";

    // Fallback: ensure it has "wash" at the end
    if (type.includes("wash")) {
      return type;
    }
    return `${type} wash`;
  };

  const handlePayment = async () => {
    if (!vehicle || !outlet || !booking.carId || !booking.outletId) {
      toast("error", "Invalid Booking", "Missing booking information");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Mock successful payment (Paystack integration will be added later)
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast("success", "Payment Successful", "Processing your booking...");

      // Create wash request after successful payment
      const washRequestData = {
        vehicleId: booking.carId,
        serviceType: formatServiceType(booking.washType), // Ensure correct format: "quick wash", "premium wash", or "full wash"
        outletId: booking.outletId,
        outletName: outlet.name,
        outletLocation: `${outlet.address}, ${outlet.city}, ${outlet.state}`,
        price: booking.price + 100, // Include service charge
        paymentStatus: "paid", // Mock successful payment
        notes: `Scheduled for ${formatDate(booking.date)} at ${booking.time}`,
      };

      await createWashRequestMutation.mutateAsync(washRequestData);
    } catch (error: any) {
      setIsProcessingPayment(false);
      console.error("Payment/Booking error:", error);
      toast("error", "Payment Failed", error?.message || "Please try again");
    }
  };

  const handleEditBooking = () => {
    router.back();
  };

  if (isLoadingVehicle || isLoadingOutlet) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle || !outlet) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Booking information not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.replace("/(tabs)")}
            variant="secondary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: Platform.OS === "ios" ? 20 : 0,
        },
      ]}
      edges={["top"]}
    >
      <StatusBar barStyle={colors.statusBarStyle} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.card }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>
          Confirm Booking
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Text
            style={[styles.successSubtitle, { color: colors.textSecondary }]}
          >
            Review your booking details below
          </Text>
        </View>

        {/* Booking Summary Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Booking Summary
          </Text>

          {/* Vehicle Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons name="car-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoHeaderText, { color: colors.text }]}>
                Vehicle
              </Text>
            </View>
            <View style={styles.vehicleInfo}>
              {vehicle.image && (
                <Image
                  source={{ uri: vehicle.image }}
                  style={[
                    styles.vehicleImage,
                    { backgroundColor: colors.surfaceAlt },
                  ]}
                  resizeMode="cover"
                />
              )}
              <View style={styles.vehicleDetails}>
                <Text style={[styles.vehicleName, { color: colors.text }]}>
                  {vehicle.vehicleMake} {vehicle.vehicleModel}
                </Text>
                <Text
                  style={[styles.vehiclePlate, { color: colors.textSecondary }]}
                >
                  {vehicle.plateNumber}
                </Text>
                {vehicle.vehicleColor && (
                  <Text
                    style={[
                      styles.vehicleColor,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {vehicle.vehicleColor}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Outlet Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.infoHeaderText, { color: colors.text }]}>
                Wash Location
              </Text>
            </View>
            <Text style={[styles.infoText, { color: colors.text }]}>
              {outlet.name}
            </Text>
            <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
              {outlet.address}, {outlet.city}, {outlet.state}
            </Text>
          </View>

          {/* Wash Type */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons name="water-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoHeaderText, { color: colors.text }]}>
                Wash Type
              </Text>
            </View>
            <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
              {booking.washType} Car wash
            </Text>
          </View>

          {/* Date & Time */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.infoHeaderText, { color: colors.text }]}>
                Date & Time
              </Text>
            </View>
            <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
              {formatDate(booking.date)}
            </Text>
            <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
              {booking.time}
            </Text>
          </View>

          {/* Price */}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.priceSection}>
            <Text style={[styles.priceLabel, { color: colors.text }]}>
              {booking.washType} Wash:
            </Text>
            <Text style={[styles.subPrice, { color: colors.primary }]}>
              ₦{booking.price.toLocaleString()}
            </Text>
          </View>
          <View style={styles.priceSection}>
            <Text style={[styles.priceLabel, { color: colors.text }]}>
              Service Charge:
            </Text>
            <Text style={[styles.subPrice, { color: colors.primary }]}>
              ₦100
            </Text>
          </View>
          <View style={styles.priceSection}>
            <Text style={[styles.priceLabel, { color: colors.text }]}>
              Total Amount
            </Text>
            <Text style={[styles.priceValue, { color: colors.primary }]}>
              ₦{(booking.price + 100).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={isProcessingPayment ? "Processing..." : "Proceed to Payment"}
            onPress={handlePayment}
            variant="primary"
            loading={isProcessingPayment}
            disabled={isProcessingPayment}
          />
          <Button
            title="Edit Booking"
            onPress={handleEditBooking}
            variant="secondary"
            disabled={isProcessingPayment}
          />
        </View>

        {/* Payment Info */}
        <View
          style={[styles.paymentInfo, { backgroundColor: colors.surfaceAlt }]}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color="#4CAF50" />
          <Text
            style={[styles.paymentInfoText, { color: colors.textSecondary }]}
          >
            Secure payment powered by Paystack
          </Text>
        </View>
      </ScrollView>
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
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  placeholder: {
    width: 35,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  successSubtitle: {
    fontSize: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    rowGap: 8,
    columnGap: 4,
    marginBottom: 12,
  },
  infoHeaderText: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
  },
  vehicleInfo: {
    flexDirection: "row",
    gap: 12,
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  vehicleDetails: {
    flex: 1,
    justifyContent: "center",
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    marginBottom: 2,
  },
  vehicleColor: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  subPrice: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 8,
  },
  paymentInfoText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
