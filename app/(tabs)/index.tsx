import { Entypo, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

import Outlet from "@/components/Homescreen/Outlet";
import StatusCard from "@/components/Homescreen/StatusCard";
import { useTheme } from "@/hooks/useTheme";
import { fetchOutlets, IOutlet } from "@/lib/api";
import { statusData } from "@/lib/data";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  // Fetch outlets from API
  const { data: outletsData, isLoading: outletsLoading } = useQuery({
    queryKey: ["outlets"],
    queryFn: fetchOutlets,
  });

  const outlets = outletsData?.data ?? [];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: Platform.OS === "ios" ? -50 : -109,
        },
      ]}
      edges={["top", "bottom"]}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user?.profileImage
                  ? { uri: user?.profileImage }
                  : require("@/assets/images/avatar.png")
              }
              style={styles.avatar}
            />
          </View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Hi, {user?.name?.split(" ")[0]}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color={colors.text} />
          <View
            style={[
              styles.notificationDot,
              { backgroundColor: colors.notificationDot },
            ]}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: colors.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Slideshow */}
        <View style={styles.slideshowContainer}>
          <Image
            source={require("@/assets/images/slideshow.png")}
            style={styles.slideshowImage}
            resizeMode="cover"
          />
        </View>

        {/* Quick Actions Card */}
        <View
          style={[
            styles.quickActionsCard,
            {
              backgroundColor: colors.card,
              borderLeftColor: colors.cardBorderLeftPrimary,
              shadowColor: colors.shadow,
            },
          ]}
        >
          {/* Location Header */}
          <View style={styles.locationHeader}>
            <View style={styles.locationLeft}>
              <Ionicons name="location-outline" size={24} color={colors.text} />
              <View style={styles.locationTextContainer}>
                <Text
                  style={[
                    styles.locationLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Location
                </Text>
                <Text
                  style={[
                    styles.locationAddress,
                    { color: colors.textSecondary },
                  ]}
                >
                  Admiralty Way, Lekki Phase 1, Lagos
                </Text>
              </View>
            </View>
            <View style={styles.locationRight}>
              <Ionicons
                name="chevron-down"
                size={24}
                color={colors.textSecondary}
              />
            </View>
          </View>

          {/* Dashed Divider */}
          <View style={styles.dashedDivider}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[styles.dash, { backgroundColor: colors.dash }]}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(screens)/select-car")}
            >
              <Ionicons name="car" size={32} color={colors.textSecondary} />
              <Text
                style={[styles.actionText, { color: colors.textSecondary }]}
              >
                Book
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(screens)/outlets")}
            >
              <Entypo name="location" size={24} color={colors.textSecondary} />
              <Text
                style={[styles.actionText, { color: colors.textSecondary }]}
              >
                Outlets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="briefcase"
                size={28}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.actionText, { color: colors.textSecondary }]}
              >
                Services
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="help-circle"
                size={32}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.actionText, { color: colors.textSecondary }]}
              >
                Help
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusSection}>
          <Text style={[styles.statusHeading, { color: colors.textSecondary }]}>
            Status
          </Text>
          <Carousel
            width={SCREEN_WIDTH}
            height={180}
            data={statusData}
            renderItem={({ item }) => <StatusCard item={item} />}
            mode="horizontal-stack"
            modeConfig={{
              snapDirection: "left",
              stackInterval: 18,
            }}
            pagingEnabled
            snapEnabled
            style={{ marginBottom: -8 }}
            onSnapToItem={(index) => setCurrentIndex(index)}
          />

          {/* Dot Indicators */}
          <View style={styles.dotIndicatorContainer}>
            {statusData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex
                    ? [
                        styles.dotActive,
                        { backgroundColor: colors.primaryLight },
                      ]
                    : [
                        styles.dotInactive,
                        { backgroundColor: colors.dotInactive },
                      ],
                ]}
              />
            ))}
          </View>
        </View>

        {/* Outlet near you */}
        <View style={styles.outletsSection}>
          <View style={styles.outletHeader}>
            <Text style={[styles.outletHeading, { color: colors.secondary }]}>
              Outlets near you
            </Text>
            <TouchableOpacity onPress={() => router.push("/(screens)/outlets")}>
              <Text
                style={[styles.viewAllText, { color: colors.textSecondary }]}
              >
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {outletsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#F77C0B" />
            </View>
          ) : outlets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No outlets available
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.outletsScrollContent}
            >
              {outlets.slice(0, 5).map((outlet: IOutlet) => (
                <Outlet
                  key={outlet._id}
                  outlet={{
                    id: outlet._id,
                    name: outlet.name,
                    location: `${outlet.address},  ${outlet.location}`,
                    info: `${outlet.activeWashes || 0} car${outlet.activeWashes !== 1 ? "s" : ""} being washed now`,
                    rating: outlet.rating || 5,
                    image: outlet.image
                      ? { uri: outlet.image }
                      : require("@/assets/images/eko_car_wash_otlet.png"),
                  }}
                />
              ))}
            </ScrollView>
          )}
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
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 24,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    fontSize: 16,
    fontWeight: "600",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  slideshowContainer: {
    paddingHorizontal: 10,
    marginTop: 8,
  },
  slideshowImage: {
    width: "100%",
    objectFit: "fill",
    height: 80,
    borderRadius: 10,
  },
  quickActionsCard: {
    marginHorizontal: 10,
    marginTop: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    paddingVertical: 20,
    paddingHorizontal: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
  },
  locationRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 8,
  },

  dashedDivider: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  dash: {
    width: 12,
    height: 2,
    borderRadius: 1,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: 4,
    width: 70,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  helpText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  statusSection: {
    marginTop: 20,
  },
  statusHeading: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 10,
  },
  dotIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  dotInactive: {},
  outletsSection: {
    marginTop: 24,
    marginBottom: 20,
    paddingBottom: Platform.OS === "android" ? 40 : 10,
  },
  outletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  outletHeading: {
    fontSize: 15,
    fontWeight: "600",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  outletsScrollContent: {
    paddingHorizontal: 10,
    gap: 16,
    paddingBottom: Platform.OS === "android" ? 10 : 5,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
});
