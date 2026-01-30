import { statusData } from "@/lib/data";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

export default function StatusCard({ item }: { item: (typeof statusData)[0] }) {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  return (
    <View style={[styles.carouselItemContainer, { width: SCREEN_WIDTH }]}>
      <View style={styles.statusCard}>
        {/* Service Info Row */}
        <View style={styles.serviceInfoRow}>
          <View style={styles.serviceIconContainer}>
            <Ionicons name="car-sport" size={24} color="#FF8C00" />
          </View>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>{item.serviceName}</Text>
            <Text style={styles.vehicleInfo}>{item.vehicleInfo}</Text>
          </View>

          {/*TODO: Make more enquire during the meeting*/}
          <Text style={styles.washNowText}>Wash now</Text>
        </View>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          {item.steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === item.currentStep;
            const isCompleted = stepNumber < item.currentStep;

            return (
              <View key={stepNumber} style={styles.progressStep}>
                <View
                  style={[
                    styles.stepCircle,
                    isActive || isCompleted
                      ? styles.stepActive
                      : styles.stepInactive,
                  ]}
                >
                  <Text
                    style={
                      isActive || isCompleted
                        ? styles.stepNumberActive
                        : styles.stepNumberInactive
                    }
                  >
                    {stepNumber}
                  </Text>
                </View>
                <Text style={styles.stepLabel}>{step}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselItemContainer: {
    paddingHorizontal: 20,
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: "#3A3A3A",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 13,
    color: "#666",
  },
  washNowText: {
    color: "#FFFFFF",
    backgroundColor: "#FF8C00",
    fontSize: 12,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontWeight: "700",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressStep: {
    alignItems: "center",
    gap: 8,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: {
    backgroundColor: "#F77C0B",
  },
  stepInactive: {
    backgroundColor: "#D3D3D3",
  },
  stepNumberActive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  stepNumberInactive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  stepLabel: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
});
