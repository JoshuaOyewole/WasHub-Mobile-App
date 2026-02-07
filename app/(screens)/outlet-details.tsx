import { useBooking } from "@/contexts/BookingContext";
import { useTheme } from "@/hooks/useTheme";
import { fetchOutletById, IOutlet } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRICING_KEYS = ["Quick Wash", "Basic", "Premium"];

export default function OutletDetailsScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { setOutletId } = useBooking();
  const params = useLocalSearchParams<{ outletId: string }>();

  const { data: outletData, isLoading } = useQuery({
    queryKey: ["outlet", params.outletId],
    queryFn: () => fetchOutletById(params.outletId!),
    enabled: !!params.outletId,
    staleTime: 1000 * 60 * 5,
  });

  const outlet: IOutlet | undefined = outletData?.data;

  const pricing = useMemo(() => {
    if (!outlet?.pricing) return null;
    return {
      "Quick Wash": outlet.pricing.quickWash,
      Basic: outlet.pricing.basic,
      Premium: outlet.pricing.premium,
    };
  }, [outlet?.pricing]);

  const handleBookOutlet = () => {
    if (!outlet?._id) return;
    setOutletId(outlet._id);
    router.push({
      pathname: "/(screens)/car-wash-details",
      params: { outletId: outlet._id },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "#F8F8F8" }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F77C0B" />
        </View>
      </SafeAreaView>
    );
  }

  if (!outlet) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "#F8F8F8" }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>Outlet not found</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.heroWrap}>
        <Image
          source={
            outlet.image
              ? { uri: outlet.image }
              : require("@/assets/images/eko_car_wash_otlet.png")
          }
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#1F2D33" />
        </Pressable>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{outlet.name}</Text>
          <View style={styles.heroMetaRow}>
            <Ionicons name="location-outline" size={14} color="#FFFFFF" />
            <Text style={styles.heroMetaText} numberOfLines={1}>
              {outlet.address}, {outlet.state}
            </Text>
          </View>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={styles.heroBadgeText}>
                {(outlet.rating || 0).toFixed(1)}
              </Text>
            </View>
            <View style={styles.heroBadge}>
              <Ionicons name="car-outline" size={14} color="#FFFFFF" />
              <Text style={styles.heroBadgeText}>
                {outlet.activeWashes || 0} active
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.quickInfoRow}>
          <View style={[styles.quickInfoCard, styles.phoneCard]}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color="#F77C0B" />
              <Text style={styles.quickInfoLabel}>Phone</Text>
            </View>
            <Text style={styles.quickInfoValue} numberOfLines={2}>
              {outlet.phoneNumber || "Not available"}
            </Text>
          </View>

          <View style={[styles.quickInfoCard, styles.emailCard]}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color="#F77C0B" />
              <Text style={styles.quickInfoLabel}>Email</Text>
            </View>
            <Text style={styles.quickInfoValue} numberOfLines={2}>
              {outlet.email || "hello@washub.com"}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About this outlet</Text>
          <Text style={styles.sectionBody}>{outlet.description || ""}</Text>
          <View
            style={{
              flex: 0,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 5,
              marginTop: 10,
            }}
          >
            <Ionicons name="time-outline" size={18} color="#F77C0B" />
            <Text
              style={{
                ...styles.quickInfoLabel,
                marginTop: 0,
                fontSize: 13,
                color: "#1F2D33",
                fontWeight: "600",
              }}
            >
              Working Hours
            </Text>
          </View>
          <Text style={{ ...styles.sectionBody, marginTop: 4 }}>
            {outlet.workingHours || "Mon-Sun: 8am - 8pm"}
          </Text>
        </View>

        {outlet.services && outlet.services.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.chipRow}>
              {outlet.services.map((service) => (
                <View key={service} style={styles.serviceChip}>
                  <Ionicons name="checkmark-circle" size={14} color="#F77C0B" />
                  <Text style={styles.chipText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <Text style={styles.sectionHint}>Inclusive of standard care</Text>
          </View>
          <View style={styles.pricingGrid}>
            {PRICING_KEYS.map((key) => {
              const priceValue = pricing
                ? pricing[key as keyof typeof pricing]
                : null;
              return (
                <View key={key} style={styles.pricingCard}>
                  <Text style={styles.pricingTitle}>{key}</Text>
                  <Text style={styles.pricingAmount}>
                    NGN {priceValue ? priceValue.toLocaleString() : "-"}
                  </Text>
                  <Text style={styles.pricingNote}>
                    Best for everyday upkeep
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity style={styles.mapButton}>
              <Ionicons name="map-outline" size={16} color="#F77C0B" />
              <Text style={styles.mapButtonText}>View on map</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionBody}>
            {outlet.address} {outlet.location}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleBookOutlet}
        >
          <Text style={styles.primaryButtonText}>Book at this outlet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroWrap: {
    height: 260,
    backgroundColor: "#F8F8F8",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroMetaText: {
    color: "#FFFFFF",
    fontSize: 13,
    flex: 1,
  },
  heroBadgeRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  heroBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "center",
  },
  quickInfoRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 26,
    marginBottom: 16,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "flex-start",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  phoneCard: {
    flex: 0.4,
  },
  emailCard: {
    flex: 0.6,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: "#7D7D7D",
  },
  quickInfoValue: {
    fontSize: 12,
    color: "#1F2D33",
    fontWeight: "600",
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2D33",
  },
  sectionHint: {
    fontSize: 12,
    color: "#7D7D7D",
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7D7D7D",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  serviceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F8F8F8",
  },
  chipText: {
    fontSize: 12,
    color: "#1F2D33",
    fontWeight: "500",
  },
  pricingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  pricingCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: "#F8F8F8",
    borderRadius: 14,
    padding: 12,
  },
  pricingTitle: {
    fontSize: 13,
    color: "#7D7D7D",
  },
  pricingAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2D33",
    marginVertical: 6,
  },
  pricingNote: {
    fontSize: 11,
    color: "#7D7D7D",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F8F8F8",
    borderRadius: 999,
  },
  mapButtonText: {
    fontSize: 12,
    color: "#1F2D33",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#1F2D33",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#7D7D7D",
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#1F2D33",
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
