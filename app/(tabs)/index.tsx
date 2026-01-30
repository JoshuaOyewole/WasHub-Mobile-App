import { Entypo, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Image,
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
import { outletsData, statusData } from "@/lib/data";
import { useAuthStore } from "@/store/useAuthStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user, logout } = useAuthStore();
  const colors = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  function handleLogout() {
    logout();
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: "#F8F8F8", marginBottom: -20 },
      ]}
      edges={["top", "bottom"]}
    >
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("@/assets/images/avatar.png")}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.greeting}>Hi, {user?.name?.split(" ")[0]}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#000" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: "#F8F8F8",
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
        <View style={styles.quickActionsCard}>
          {/* Location Header */}
          <View style={styles.locationHeader}>
            <View style={styles.locationLeft}>
              <Ionicons
                name="location-outline"
                size={24}
                color={colors.secondary}
              />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Location</Text>
                <Text
                  style={[styles.locationAddress, { color: colors.secondary }]}
                >
                  Admiralty Way, Lekki Phase 1, Lagos
                </Text>
              </View>
            </View>
            <View style={styles.locationRight}>
              <Ionicons
                name="chevron-down"
                size={24}
                color={colors.secondary}
              />
            </View>
          </View>

          {/* Dashed Divider */}
          <View style={styles.dashedDivider}>
            {[...Array(20)].map((_, i) => (
              <View key={i} style={styles.dash} />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="car" size={32} color={colors.secondary} />
              <Text style={[styles.actionText, { color: colors.secondary }]}>
                Book
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Entypo name="location" size={24} color={colors.secondary} />
              <Text style={[styles.actionText, { color: colors.secondary }]}>
                Outlets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="briefcase" size={28} color={colors.secondary} />
              <Text style={[styles.actionText, { color: colors.secondary }]}>
                Services
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="help-circle" size={32} color={colors.secondary} />
              <Text style={[styles.actionText, { color: colors.secondary }]}>
                Help
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusSection}>
          <Text style={[styles.statusHeading, { color: colors.secondary }]}>
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
                    ? styles.dotActive
                    : styles.dotInactive,
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
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.outletsScrollContent}
          >
            {outletsData.map((outlet) => (
              <Outlet key={outlet.id} outlet={outlet} />
            ))}
          </ScrollView>
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
    color: "#000",
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
    backgroundColor: "#FF3B30",
  },
  slideshowContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  slideshowImage: {
    width: "100%",
    objectFit: "fill",
    height: 80,
    borderRadius: 10,
  },
  quickActionsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: "#FF8C00",
    paddingVertical: 20,
    paddingHorizontal: 2,
    shadowColor: "#000",
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
    color: "#666",
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
    backgroundColor: "#D1D5DB",
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
    marginLeft: 20,
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
    backgroundColor: "#FF8C00",
    width: 24,
  },
  dotInactive: {
    backgroundColor: "#D1D5DB",
  },
  outletsSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  outletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  outletHeading: {
    fontSize: 15,
    fontWeight: "600",
  },
  viewAllText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  outletsScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
});
