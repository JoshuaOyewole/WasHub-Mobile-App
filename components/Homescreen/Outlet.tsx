import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Outlet({
  outlet,
}: {
  outlet: {
    id: string;
    name: string;
    location: string;
    info: string;
    rating: number;
    image: any;
  };
}) {
  return (
    <TouchableOpacity
      style={styles.outletCard}
      onPress={() =>
        router.push({
          pathname: "/(screens)/outlet-details",
          params: { outletId: outlet.id },
        })
      }
    >
      <Image source={outlet.image} style={styles.outletImage} />
      <View style={styles.outletCardContent}>
        <Text style={styles.outletName}>{outlet.name}</Text>
        <View style={styles.outletInfoRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.outletLocation}>{outlet.location}</Text>
        </View>
        <View style={styles.outletInfoRow}>
          <Ionicons name="car-outline" size={14} color="#666" />
          <Text style={styles.outletInfo}>{outlet.info}</Text>
        </View>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name="star"
              size={16}
              color={star <= outlet.rating ? "#FF8C00" : "#E0E0E0"}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outletCard: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outletImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  outletCardContent: {
    padding: 12,
  },
  outletName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  outletInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  outletLocation: {
    fontSize: 13,
    color: "#666",
  },
  outletInfo: {
    fontSize: 13,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
  },
});
