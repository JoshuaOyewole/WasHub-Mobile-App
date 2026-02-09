import { useTheme } from "@/hooks/useTheme";
import { statusData } from "@/lib/data";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

export default function StatusCard({ item }: { item: (typeof statusData)[0] }) {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const colors = useTheme();

  return (
    <View style={[styles.carouselItemContainer, { width: SCREEN_WIDTH }]}>
      <View
        style={[
          styles.statusCard,
          {
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
            borderLeftColor: colors.cardBorderLeft,
          },
        ]}
      >
        {/* Service Info Row */}
        <View style={styles.serviceInfoRow}>
          <View
            style={[
              styles.serviceIconContainer,
              { backgroundColor: colors.surfaceAlt },
            ]}
          >
            <Ionicons name="car-sport" size={24} color={colors.primaryLight} />
          </View>
          <View style={styles.serviceDetails}>
            <Text style={[styles.serviceName, { color: colors.text }]}>
              {item.serviceName}
            </Text>
            <Text style={[styles.vehicleInfo, { color: colors.textSecondary }]}>
              {item.vehicleInfo}
            </Text>
          </View>

          <Text
            style={[
              styles.washNowText,
              { backgroundColor: colors.primaryLight, color: colors.white },
            ]}
          >
            Wash now
          </Text>
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
                      ? [styles.stepActive, { backgroundColor: colors.primary }]
                      : [
                          styles.stepInactive,
                          { backgroundColor: colors.stepInactive },
                        ],
                  ]}
                >
                  <Text
                    style={[
                      isActive || isCompleted
                        ? styles.stepNumberActive
                        : styles.stepNumberInactive,
                      { color: colors.white },
                    ]}
                  >
                    {stepNumber}
                  </Text>
                </View>
                <Text style={[styles.stepLabel, { color: colors.text }]}>
                  {step}
                </Text>
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
    paddingHorizontal: 10,
  },
  statusCard: {
    borderRadius: 16,
    borderLeftWidth: 6,
    padding: 16,
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
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 13,
  },
  washNowText: {
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
    width: 28,
    height: 28,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: {},
  stepInactive: {},
  stepNumberActive: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepNumberInactive: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
