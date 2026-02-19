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
  variant?: "primary" | "secondary" | "link" | "outline";
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
  const isOutline = variant === "outline";
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary
          ? [styles.primaryButton, { backgroundColor: colors.button }]
          : isLink
            ? styles.linkButton
            : isOutline
              ? [
                  {
                    backgroundColor: "transparent",
                    borderColor: colors.outlineButton,
                    borderWidth: 1,
                  },
                ]
              : [
                  styles.secondaryButton,
                  {
                    backgroundColor: colors.secondaryButtonBackground,
                    borderColor: colors.secondary,
                  },
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
              ? [{ color: colors.buttonText }]
              : isLink
                ? [styles.linkButtonText, { color: colors.text }]
                : isOutline
                  ? [{ color: colors.outlineButtonText }]
                  : [{ color: colors.secondaryButtonText }],
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
  linkButton: {
    backgroundColor: "transparent",
  },
  linkButtonText: {
    fontWeight: "400",
  },
});
