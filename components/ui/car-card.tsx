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
  const progressColor = car.washProgress < 50 ? "#F77C0B" : "#9ACD32";
  // const progressColor = "#9ACD32";

  return (
    <TouchableOpacity
      style={[styles.container, car.isSelected && styles.selectedContainer]}
      onPress={() => onPress?.(car)}
      activeOpacity={0.7}
    >
      {/* Car Image */}
      <View style={styles.imageContainer}>
        <Image
          //  source={{uri:car.image ?? require("../../assets/images/toyota_prado.png")}}
          source={require("../../assets/images/toyota_prado.png")}
          style={styles.image}
          resizeMode="cover"
        />
        {car.isSelected && (
          <View style={styles.checkmarkContainer}>
            <Feather name="check" size={20} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Car Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.brand}>{car.brand}</Text>

        <View style={styles.infoRow}>
          <Feather name="navigation" size={14} color="#7D7D7D" />
          <Text style={styles.model}>{car.model}</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="credit-card" size={14} color="#7D7D7D" />
          <Text style={styles.licensePlate}>{car.licensePlate}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedContainer: {
    backgroundColor: "#f6f6f6",
  },
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
    backgroundColor: "#F77C0B",
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
    color: "#1F2D33",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  model: {
    fontSize: 13,
    color: "#7D7D7D",
    marginLeft: 6,
  },
  licensePlate: {
    fontSize: 13,
    color: "#7D7D7D",
    marginLeft: 6,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#E8E8E8",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 4,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
