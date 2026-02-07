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
  const rating = outlet.rating ?? 5;
  const activeWashes = outlet.activeWashes ?? 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(outlet)}
      activeOpacity={0.7}
    >
      {/* Outlet Image */}
      <View style={styles.imageContainer}>
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
        <Text style={styles.name}>{outlet.name}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#7D7D7D" />
          <Text style={styles.location} numberOfLines={1}>
            {outlet.address}, {outlet.state}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="car-outline" size={14} color="#7D7D7D" />
          <Text style={styles.statusText}>
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
              color={star <= rating ? "#FFC107" : "#E0E0E0"}
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000000",
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
    backgroundColor: "#F5F5F5",
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
    color: "#1F2D33",
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
    color: "#7D7D7D",
    flex: 1,
  },
  statusText: {
    fontSize: 13,
    color: "#7D7D7D",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
  },
});
