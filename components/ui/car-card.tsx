import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type Car = {
  id: string;
  image: ImageSourcePropType;
  brand: string;
  model: string;
  licensePlate: string;
  washProgress: number; // 0-100
  isSelected?: boolean;
};

type CarCardProps = {
  car: Car;
  onPress?: (car: Car) => void;
};

export default function CarCard({ car, onPress }: CarCardProps) {
  const colors = useTheme();
  const progressColor = car.washProgress < 50 ? "#F77C0B" : "#9ACD32";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, shadowColor: colors.shadow },
        car.isSelected && [
          styles.selectedContainer,
          { backgroundColor: colors.surface },
        ],
      ]}
      onPress={() => onPress?.(car)}
      activeOpacity={0.7}
    >
      {/* Car Image */}
      <View style={styles.imageContainer}>
        <Image source={car.image} style={styles.image} resizeMode="cover" />
        {car.isSelected && (
          <View
            style={[
              styles.checkmarkContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <Feather name="check" size={20} color={colors.white} />
          </View>
        )}
      </View>

      {/* Car Details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.brand, { color: colors.text }]}>{car.brand}</Text>

        <View style={styles.infoRow}>
          <Feather name="navigation" size={14} color={colors.textMuted} />
          <Text style={[styles.model, { color: colors.textMuted }]}>
            {car.model}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="credit-card" size={14} color={colors.textMuted} />
          <Text style={[styles.licensePlate, { color: colors.textMuted }]}>
            {car.licensePlate}
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={[
            styles.progressBarContainer,
            { backgroundColor: colors.progressTrack },
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                //  width: `${car.washProgress}%`,
                width: `100%`,
                backgroundColor: progressColor,
              },
            ]}
          />
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
    borderWidth: 2,
    borderColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedContainer: {},
  imageContainer: {
    width: 120,
    height: 90,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  checkmarkContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  brand: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  model: {
    fontSize: 13,
    marginLeft: 6,
  },
  licensePlate: {
    fontSize: 13,
    marginLeft: 6,
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 4,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
