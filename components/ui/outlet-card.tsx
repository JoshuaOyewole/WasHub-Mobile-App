import { useTheme } from "@/hooks/useTheme";
import { IOutlet } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type Outlet = {
  _id: string;
  name: string;
  location: string;
  address: string;
  image?: string;
  rating?: number;
  activeWashes?: number;
};

type OutletCardProps = {
  outlet: IOutlet;
  onPress?: (outlet: IOutlet) => void;
};

export default function OutletCard({ outlet, onPress }: OutletCardProps) {
  const colors = useTheme();
  const rating = outlet.rating ?? 5;
  const activeWashes = outlet.activeWashes ?? 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, shadowColor: colors.shadow },
      ]}
      onPress={() => onPress?.(outlet)}
      activeOpacity={0.7}
    >
      {/* Outlet Image */}
      <View
        style={[styles.imageContainer, { backgroundColor: colors.surface }]}
      >
        <Image
          source={
            outlet.image
              ? { uri: outlet.image }
              : require("../../assets/images/toyota_prado.png")
          }
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Outlet Details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{outlet.name}</Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.textMuted}
          />
          <Text
            style={[styles.location, { color: colors.textMuted }]}
            numberOfLines={1}
          >
            {outlet.address}, {outlet.state}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="car-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.statusText, { color: colors.textMuted }]}>
            {activeWashes} car{activeWashes !== 1 ? "s" : ""} being washed now
          </Text>
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name="star"
              size={16}
              color={star <= rating ? "#FFC107" : colors.stepInactive}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 120,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    flex: 1,
  },
  statusText: {
    fontSize: 13,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
  },
});
