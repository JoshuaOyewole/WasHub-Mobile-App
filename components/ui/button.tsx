import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "link";
  loading?: boolean;
  disabled?: boolean;
} & Omit<TouchableOpacityProps, "onPress">;

export default function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isLink = variant === "link";
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary
          ? styles.primaryButton
          : isLink
            ? styles.linkButton
            : styles.secondaryButton,
        (disabled || loading) && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#FFFFFF" : "#F77C0B"} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            isPrimary
              ? styles.primaryButtonText
              : isLink
                ? styles.linkButtonText
                : styles.secondaryButtonText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  primaryButton: {
    backgroundColor: "#1F2D33",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#1F2D33",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#1F2D33",
  },
  linkButton: {
    backgroundColor: "transparent",
  },
  linkButtonText: {
    color: "#1F2D33",
    fontWeight: "400",
  },
});
