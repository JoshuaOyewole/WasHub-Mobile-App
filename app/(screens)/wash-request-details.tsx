import ReviewModal from "@/components/ui/review-modal";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import {
    fetchWashRequestById,
    submitWashReview,
    WashRequest,
} from "@/lib/api/washRequests";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WashRequestDetailsScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["washRequest", id],
    queryFn: () => fetchWashRequestById(id!),
    enabled: !!id,
    refetchInterval: 10000, // Poll every 10 seconds for real-time updates
  });

  const washRequest: WashRequest | undefined = data?.data;

  // Mutation to submit review
  const submitReviewMutation = useMutation({
    mutationFn: ({ rating, review }: { rating: number; review?: string }) =>
      submitWashReview(id!, rating, review),
    onSuccess: () => {
      toast("success", "Review Submitted", "Thank you for your feedback!");
      queryClient.invalidateQueries({ queryKey: ["washRequest", id] });
      queryClient.invalidateQueries({ queryKey: ["washRequests"] });
      setShowReviewModal(false);
    },
    onError: (error: any) => {
      toast(
        "error",
        "Failed",
        error?.error || "Failed to submit review. Please try again.",
      );
    },
  });

  const handleSubmitReview = (rating: number, review?: string) => {
    submitReviewMutation.mutate({ rating, review });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (isCompleted) {
      return (
        <View style={styles.completedIcon}>
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        </View>
      );
    }
    return <View style={styles.pendingIcon} />;
  };

  const getTimelineItemStyle = (index: number) => {
    if (!washRequest) return {};
    const isCompleted = index <= washRequest.currentStep;
    return {
      opacity: isCompleted ? 1 : 0.4,
    };
  };

  const getStatusTime = (status: string) => {
    if (!washRequest) return null;
    const timelineItem = washRequest.statusTimeline.find(
      (item) => item.status === status,
    );
    return timelineItem ? formatTime(timelineItem.timestamp) : null;
  };

  const statusMapping = {
    "Wash Booked Successfully": "scheduled",
    "Wash Order Received": "order_received",
    "Vehicle Checked": "vehicle_checked",
    "Wash in Progress": "in_progress",
    "Drying & Finishing": "drying_finishing",
    "Ready for Pickup": "ready_for_pickup",
    "Wash Completed": "completed",
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F77C0B" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !washRequest) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load wash request details
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {washRequest.status === "scheduled"
            ? "Scheduled Wash"
            : washRequest.status === "completed"
              ? "Completed Wash"
              : "Ongoing Wash"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Wash Info Card */}
        <View style={[styles.infoCard, { backgroundColor: "#FFFFFF" }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="local-car-wash" size={20} color="#F77C0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Service</Text>
              <Text style={styles.infoValue}>
                {washRequest.outletName} - {washRequest.serviceType}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="calendar-outline" size={20} color="#F77C0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {formatDate(washRequest.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="location-outline" size={20} color="#F77C0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{washRequest.outletLocation}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="local-car-wash" size={20} color="#F77C0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Vehicle</Text>
              <Text style={styles.infoValue}>
                {washRequest.vehicleInfo.vehicleMake}{" "}
                {washRequest.vehicleInfo.vehicleModel}
              </Text>
              <Text style={styles.vehicleSubText}>
                {washRequest.vehicleInfo.licensePlate}
              </Text>
            </View>
          </View>
        </View>

        {/* Wash Code */}
        <Text
          style={{
            ...styles.washCodeLabel,
            textAlign: "center",
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          Wash Code
        </Text>
        <View style={[styles.washCodeCard, { backgroundColor: "#fff" }]}>
          <Text style={styles.washCodeText}>{washRequest.washCode}</Text>
          <Text style={styles.washCodeHint}>Show this code at the outlet</Text>
        </View>

        {/* Timeline */}
        <View style={[styles.timelineCard, { backgroundColor: "#FFFFFF" }]}>
          <Text style={styles.sectionTitle}>Wash Status</Text>

          {washRequest.steps.map((step, index) => {
            const statusKey =
              Object.keys(statusMapping).find(
                (key) =>
                  statusMapping[key as keyof typeof statusMapping] ===
                  step.toLowerCase().replace(/ /g, "_"),
              ) || step;
            const time = getStatusTime(
              statusMapping[statusKey as keyof typeof statusMapping],
            );
            const isCompleted = index <= washRequest.currentStep;

            return (
              <View
                key={index}
                style={[styles.timelineItem, getTimelineItemStyle(index)]}
              >
                <View style={styles.timelineIconContainer}>
                  {getStatusIcon(step, isCompleted)}
                  {index < washRequest.steps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: isCompleted ? "#F77C0B" : "#E0E0E0",
                        },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      {
                        color: isCompleted ? "#1F2D33" : "#B0B0B0",
                        fontWeight: isCompleted ? "600" : "400",
                      },
                    ]}
                  >
                    {step}
                  </Text>
                  {time && (
                    <Text style={styles.timelineTime}>
                      {formatDate(
                        washRequest.statusTimeline[index]?.timestamp || "",
                      )}{" "}
                      • {time}
                    </Text>
                  )}
                  {index === 0 && (
                    <Text style={styles.timelineDescription}>
                      Waiting for the vendor to confirm your wash.
                    </Text>
                  )}
                  {index === 1 && isCompleted && (
                    <Text style={styles.timelineDescription}>
                      A car wash agent is confirming your vehicle details.
                    </Text>
                  )}
                  {index === 2 && isCompleted && (
                    <Text style={styles.timelineDescription}>
                      Vehicle details confirmed.
                    </Text>
                  )}
                  {index === 3 && isCompleted && (
                    <Text style={styles.timelineDescription}>
                      Your vehicle is currently being washed.
                    </Text>
                  )}
                  {index === 4 && isCompleted && (
                    <Text style={styles.timelineDescription}>
                      Drying, interior cleaning, and tire polishing in progress.
                    </Text>
                  )}
                  {index === 5 && isCompleted && (
                    <Text style={styles.timelineDescription}>
                      Your car wash is complete, proceed to the pickup area.
                    </Text>
                  )}
                  {index === 6 && isCompleted && (
                    <Text style={styles.timelineDescription}>
                      Thank you for using our service!
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        {/* Review Section - Only show for completed washes that haven't been reviewed */}
        {washRequest.status === "completed" && !washRequest.userRating && (
          <View style={[styles.reviewCard, { backgroundColor: "#FFFFFF" }]}>
            <View style={styles.reviewHeader}>
              <Ionicons name="star" size={28} color="#F77C0B" />
              <Text style={styles.reviewTitle}>How was your wash?</Text>
              <Text style={styles.reviewSubtitle}>
                Share your feedback and help us improve
              </Text>
            </View>

            {/* Star Rating */}

            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={() => setShowReviewModal(true)}
              activeOpacity={0.8}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star-outline"
                  size={32}
                  color="#D1D5DB"
                />
              ))}
            </TouchableOpacity>
          </View>
        )}

        {/* Show review if already submitted */}

        {/* Price */}
        <View style={[styles.priceCard, { backgroundColor: "#FFFFFF" }]}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total Amount</Text>
            <Text style={styles.priceAmount}>
              &#8358;{washRequest.price.toLocaleString()}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Payment Status</Text>
            <View
              style={[
                styles.paymentBadge,
                {
                  backgroundColor:
                    washRequest.paymentStatus === "paid"
                      ? "#E7F7EF"
                      : "#FFF5EB",
                },
              ]}
            >
              <Text
                style={[
                  styles.paymentText,
                  {
                    color:
                      washRequest.paymentStatus === "paid"
                        ? "#067647"
                        : "#F77C0B",
                  },
                ]}
              >
                {washRequest.paymentStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Review Modal */}
      <ReviewModal
        visible={showReviewModal}
        outletName={washRequest?.outletName || ""}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        isSubmitting={submitReviewMutation.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    color: "#D92D20",
    fontWeight: "600",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#F77C0B",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5EB",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#7D7D7D",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2D33",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2D33",
    marginBottom: 12,
  },
  vehicleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2D33",
  },
  vehicleSubText: {
    fontSize: 14,
    color: "#7D7D7D",
    marginTop: 4,
  },
  washCodeCard: {
    margin: 16,
    marginTop: 0,
    paddingBottom: 20,
    paddingTop: 10,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  washCodeHeader: {
    alignItems: "center",
    gap: 2,
    marginBottom: 16,
  },
  washCodeLabel: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  washCodeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F77C0B",
    letterSpacing: 8,
  },
  washCodeHint: {
    fontSize: 12,
    color: "#7D7D7D",
    marginTop: 8,
  },
  timelineCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineItem: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  timelineIconContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  completedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F77C0B",
    justifyContent: "center",
    alignItems: "center",
  },
  pendingIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 12,
    color: "#F77C0B",
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 13,
    color: "#7D7D7D",
    lineHeight: 18,
  },
  priceCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#7D7D7D",
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2D33",
  },
  paymentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: "600",
  },
  reviewCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2D33",
    textAlign: "center",
  },
  reviewSubtitle: {
    fontSize: 13,
    color: "#7D7D7D",
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  reviewButton: {
    backgroundColor: "#F77C0B",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  submittedRatingContainer: {
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  submittedRatingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2D33",
  },
  submittedReviewContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
  },
  submittedReviewLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2D33",
    marginBottom: 8,
  },
  submittedReviewText: {
    fontSize: 14,
    color: "#7D7D7D",
    lineHeight: 20,
  },
});

/* {washRequest.status === "completed" && washRequest.userRating && (
          <View style={[styles.reviewCard, { backgroundColor: "#FFFFFF" }]}>
            <View style={styles.reviewHeader}>
              <Ionicons name="checkmark-circle" size={28} color="#067647" />
              <Text style={styles.reviewTitle}>Review Submitted</Text>
              <Text style={styles.reviewSubtitle}>
                Thank you for your feedback!
              </Text>
            </View>

           // Display submitted rating 
            <View style={styles.submittedRatingContainer}>
              <Text style={styles.submittedRatingLabel}>Your Rating:</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={
                      star <= (washRequest.userRating || 0)
                        ? "star"
                        : "star-outline"
                    }
                    size={24}
                    color={
                      star <= (washRequest.userRating || 0)
                        ? "#F77C0B"
                        : "#D1D5DB"
                    }
                  />
                ))}
              </View>
            </View>

            {washRequest.userReview && (
              <View style={styles.submittedReviewContainer}>
                <Text style={styles.submittedReviewLabel}>Your Review:</Text>
                <Text style={styles.submittedReviewText}>
                  {washRequest.userReview}
                </Text>
              </View>
            )}
          </View>
        )} */
