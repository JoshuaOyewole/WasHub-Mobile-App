import { useTheme } from "@/hooks/useTheme";
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
  const colors = useTheme();
  const isPrimary = variant === "primary";
  const isLink = variant === "link";
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary
          ? [styles.primaryButton, { backgroundColor: colors.button }]
          : isLink
            ? styles.linkButton
            : [
                styles.secondaryButton,
                { backgroundColor: colors.card, borderColor: colors.secondary },
              ],
        (disabled || loading) && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.buttonText : colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            isPrimary
              ? [styles.primaryButtonText, { color: colors.buttonText }]
              : isLink
                ? [styles.linkButtonText, { color: colors.text }]
                : [styles.secondaryButtonText, { color: colors.secondary }],
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
  primaryButton: {},
  secondaryButton: {
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {},
  secondaryButtonText: {},
  linkButton: {
    backgroundColor: "transparent",
  },
  linkButtonText: {
    fontWeight: "400",
  },
});
