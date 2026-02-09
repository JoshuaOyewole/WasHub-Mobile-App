import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import { useBooking } from "@/contexts/BookingContext";
import { useTheme } from "@/hooks/useTheme";
import { fetchOutlets, IOutlet } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CarWashOutletsScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { setOutletId, booking } = useBooking();
  const [searchQuery, setSearchQuery] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const preselectedOutletRef = useRef<View>(null);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  console.log("🚗 Booking context in CarWashOutletsScreen:", booking);
  // Check if there's a preselected outlet from rebooking
  const preselectedOutletId = booking.outletId;

  const { data: outletsData, isLoading } = useQuery({
    queryKey: ["outlets"],
    queryFn: fetchOutlets,
    staleTime: 1000 * 60 * 5,
  });

  const outlets: IOutlet[] = outletsData?.data ?? [];

  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (outlet.city?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (outlet.state?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  );

  // Auto-scroll to preselected outlet and trigger highlight animation
  useEffect(() => {
    if (preselectedOutletId && filteredOutlets.length > 0 && !searchQuery) {
      const preselectedIndex = filteredOutlets.findIndex(
        (outlet) => outlet._id === preselectedOutletId,
      );

      if (preselectedIndex !== -1 && preselectedOutletRef.current) {
        // Delay to ensure layout is complete
        const timer = setTimeout(() => {
          preselectedOutletRef.current?.measureLayout(
            scrollViewRef.current as any,
            (x, y) => {
              scrollViewRef.current?.scrollTo({
                y: Math.max(0, y - 100), // Scroll with some offset from top
                animated: true,
              });

              // Trigger highlight animation
              Animated.sequence([
                Animated.timing(highlightAnim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(highlightAnim, {
                  toValue: 0,
                  duration: 300,
                  delay: 1500,
                  useNativeDriver: true,
                }),
              ]).start();
            },
            () => {}, // Error callback
          );
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [preselectedOutletId, filteredOutlets.length, searchQuery]);

  const handleOutletSelect = (outlet: IOutlet) => {
    setOutletId(outlet._id);
    router.push({
      pathname: "/(screens)/car-wash-details",
      params: { outletId: outlet._id },
    });
  };

  const handleContinue = () => {
    if (preselectedOutletId) {
      router.push({
        pathname: "/(screens)/car-wash-details",
        params: { outletId: preselectedOutletId },
      });
    }
  };

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
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.card }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>
          Step 2 of 4 - Select wash Outlet
        </Text>
      </View>

      {/* Search Field with Continue Button */}
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for car wash spot"
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          preselectedOutletId && !searchQuery && { paddingBottom: 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredOutlets.length === 0 ? (
          <EmptyState
            image={require("@/assets/images/no-cars.png")}
            title="No outlets found"
            description="No car wash outlets available in your area"
          />
        ) : (
          <View style={styles.outletList}>
            {filteredOutlets.map((outlet, index) => {
              const isPreselected = outlet._id === preselectedOutletId;

              // Animated scale for pulse effect
              const scale = highlightAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.02],
              });

              const OutletCard = isPreselected ? Animated.View : View;
              const animatedStyle = isPreselected
                ? { transform: [{ scale }] }
                : {};

              return (
                <OutletCard
                  key={outlet._id}
                  ref={isPreselected ? preselectedOutletRef : null}
                  style={animatedStyle}
                >
                  <TouchableOpacity
                    style={[
                      styles.outletCard,
                      {
                        backgroundColor: colors.card,
                        shadowColor: colors.shadow,
                      },
                      isPreselected && styles.preselectedCard,
                      isPreselected && {
                        borderColor: colors.primary,
                        backgroundColor: colors.surfaceAlt,
                      },
                    ]}
                    onPress={() => handleOutletSelect(outlet)}
                    activeOpacity={0.7}
                  >
                    {/* Checkbox for preselected outlet */}
                    {isPreselected && (
                      <View style={styles.checkboxContainer}>
                        <Ionicons
                          name="checkmark-circle"
                          size={28}
                          color={colors.primary}
                        />
                      </View>
                    )}

                    <Image
                      source={
                        outlet.image
                          ? { uri: outlet.image }
                          : require("@/assets/images/eko_car_wash_otlet.png")
                      }
                      style={styles.outletImage}
                      resizeMode="cover"
                    />
                    <View style={styles.outletInfo}>
                      <Text style={[styles.outletName, { color: colors.text }]}>
                        {outlet.name}
                        {isPreselected && (
                          <Text
                            style={[
                              styles.preselectedBadge,
                              { color: colors.primary },
                            ]}
                          >
                            {" "}
                            (Previously Selected)
                          </Text>
                        )}
                      </Text>
                      <View style={styles.outletMeta}>
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.outletLocation,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {outlet.address}, {outlet.state}
                        </Text>
                      </View>
                      <View style={styles.outletMeta}>
                        <Ionicons
                          name="car-outline"
                          size={16}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.outletActivity,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {outlet.activeWashes} cars being washed now
                        </Text>
                      </View>
                      <View style={styles.ratingContainer}>
                        {[...Array(5)].map((_, subIndex) => (
                          <Ionicons
                            key={subIndex}
                            name={
                              subIndex < (outlet.rating || 0)
                                ? "star"
                                : "star-outline"
                            }
                            size={16}
                            color="#FFC107"
                          />
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                </OutletCard>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Continue Button - Absolute at bottom */}
      {preselectedOutletId && !searchQuery && (
        <View
          style={[
            styles.bottomButtonContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: colors.button, shadowColor: colors.shadow },
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.continueButtonText, { color: colors.buttonText }]}
            >
              Continue with Selected Outlet
            </Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
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
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  outletList: {
    gap: 16,
  },
  outletCard: {
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  preselectedCard: {
    borderWidth: 2,
  },
  checkboxContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  outletImage: {
    width: 120,
    height: 110,
    borderRadius: 8,
  },
  outletInfo: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 10,
    justifyContent: "space-between",
  },
  outletName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  preselectedBadge: {
    fontSize: 12,
    fontWeight: "500",
  },
  outletMeta: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  outletLocation: {
    fontSize: 14,
    marginTop: -2,
  },
  outletActivity: {
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
    marginLeft: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
});
