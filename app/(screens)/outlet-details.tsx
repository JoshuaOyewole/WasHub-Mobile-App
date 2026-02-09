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
      pathname: "/(screens)/select-car",
      params: { outletId: outlet._id },
    });
  };

  if (isLoading) {
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

  if (!outlet) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Outlet not found
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.button }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.retryText, { color: colors.buttonText }]}>
              Go back
            </Text>
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
      <StatusBar barStyle={colors.statusBarStyle} />

      <View style={[styles.heroWrap, { backgroundColor: colors.surface }]}>
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
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.heroContent}>
          <Text style={[styles.heroTitle, { color: colors.white }]}>
            {outlet.name}
          </Text>
          <View style={styles.heroMetaRow}>
            <Ionicons name="location-outline" size={14} color={colors.white} />
            <Text
              style={[styles.heroMetaText, { color: colors.white }]}
              numberOfLines={1}
            >
              {outlet.address}, {outlet.state}
            </Text>
          </View>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={[styles.heroBadgeText, { color: colors.white }]}>
                {(outlet.rating || 0).toFixed(1)}
              </Text>
            </View>
            <View style={styles.heroBadge}>
              <Ionicons name="car-outline" size={14} color={colors.white} />
              <Text style={[styles.heroBadgeText, { color: colors.white }]}>
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
          <View
            style={[
              styles.quickInfoCard,
              styles.phoneCard,
              { backgroundColor: colors.card, shadowColor: colors.shadow },
            ]}
          >
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
              <Text
                style={[styles.quickInfoLabel, { color: colors.textMuted }]}
              >
                Phone
              </Text>
            </View>
            <Text
              style={[styles.quickInfoValue, { color: colors.text }]}
              numberOfLines={2}
            >
              {outlet.phoneNumber || "Not available"}
            </Text>
          </View>

          <View
            style={[
              styles.quickInfoCard,
              styles.emailCard,
              { backgroundColor: colors.card, shadowColor: colors.shadow },
            ]}
          >
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
              <Text
                style={[styles.quickInfoLabel, { color: colors.textMuted }]}
              >
                Email
              </Text>
            </View>
            <Text
              style={[styles.quickInfoValue, { color: colors.text }]}
              numberOfLines={2}
            >
              {outlet.email || "hello@washub.com"}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About this outlet
          </Text>
          <Text style={[styles.sectionBody, { color: colors.textMuted }]}>
            {outlet.description || ""}
          </Text>
          <View
            style={{
              flex: 0,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 5,
              marginTop: 10,
            }}
          >
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text
              style={{
                ...styles.quickInfoLabel,
                marginTop: 0,
                fontSize: 13,
                color: colors.text,
                fontWeight: "600",
              }}
            >
              Working Hours
            </Text>
          </View>
          <Text
            style={{
              ...styles.sectionBody,
              marginTop: 4,
              color: colors.textMuted,
            }}
          >
            {outlet.workingHours || "Mon-Sun: 8am - 8pm"}
          </Text>
        </View>

        {outlet.services && outlet.services.length > 0 && (
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.card, shadowColor: colors.shadow },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Services
            </Text>
            <View style={styles.chipRow}>
              {outlet.services.map((service) => (
                <View
                  key={service}
                  style={[
                    styles.serviceChip,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={[styles.chipText, { color: colors.text }]}>
                    {service}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Pricing
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              Inclusive of standard care
            </Text>
          </View>
          <View style={styles.pricingGrid}>
            {PRICING_KEYS.map((key) => {
              const priceValue = pricing
                ? pricing[key as keyof typeof pricing]
                : null;
              return (
                <View
                  key={key}
                  style={[
                    styles.pricingCard,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Text
                    style={[styles.pricingTitle, { color: colors.textMuted }]}
                  >
                    {key}
                  </Text>
                  <Text style={[styles.pricingAmount, { color: colors.text }]}>
                    NGN {priceValue ? priceValue.toLocaleString() : "-"}
                  </Text>
                  <Text
                    style={[styles.pricingNote, { color: colors.textMuted }]}
                  >
                    Best for everyday upkeep
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Location
            </Text>
            <TouchableOpacity
              style={[styles.mapButton, { backgroundColor: colors.background }]}
            >
              <Ionicons name="map-outline" size={16} color={colors.primary} />
              <Text style={[styles.mapButtonText, { color: colors.text }]}>
                View on map
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.sectionBody, { color: colors.textMuted }]}>
            {outlet.address} {outlet.location}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.button }]}
          onPress={handleBookOutlet}
        >
          <Text
            style={[styles.primaryButtonText, { color: colors.buttonText }]}
          >
            Book at this outlet
          </Text>
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
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 8,
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroMetaText: {
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
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "flex-start",
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
  },
  quickInfoValue: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  },
  sectionHint: {
    fontSize: 12,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
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
  },
  chipText: {
    fontSize: 12,
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
    borderRadius: 14,
    padding: 12,
  },
  pricingTitle: {
    fontSize: 13,
  },
  pricingAmount: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 6,
  },
  pricingNote: {
    fontSize: 11,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  primaryButtonText: {
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
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  retryText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
