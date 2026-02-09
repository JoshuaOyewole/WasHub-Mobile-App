import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export const ToastOverlay: React.FC = () => {
  const { isVisible, config, dismiss } = useToast();
  const colors = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isVisible) {
      // Fade in animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, fadeAnim, scaleAnim]);

  if (!isVisible && !config) return null;

  const getToastColor = () => {
    switch (config?.type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "info":
        return "#2196F3";
      default:
        return "#2196F3";
    }
  };

  const getToastIcon = () => {
    switch (config?.type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "info":
        return "information-circle";
      default:
        return "information-circle";
    }
  };

  return (
    <Animated.View
      style={[styles.overlay, { opacity: fadeAnim }]}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      {/* Blur Background */}
      <Pressable style={styles.backdrop} onPress={dismiss}>
        <BlurView intensity={5} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.darkOverlay} />
      </Pressable>

      {/* Toast Container */}
      <Animated.View
        style={[
          styles.toastContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.toast,
            {
              borderLeftColor: getToastColor(),
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={getToastIcon() as any}
              size={28}
              color={getToastColor()}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {config?.title}
            </Text>
            {config?.message && (
              <Text style={[styles.message, { color: colors.textSecondary }]}>
                {config.message}
              </Text>
            )}
          </View>
          <Pressable onPress={dismiss} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999999,
    elevation: 999999,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  toastContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    zIndex: 2,
    maxWidth: 500,
    alignSelf: "center",
  },
  toast: {
    borderRadius: 12,
    borderLeftWidth: 5,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
});
