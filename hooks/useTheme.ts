import { useColorScheme } from "react-native";

// Shared colors across themes
const sharedColors = {
  secondary: "#1F2D33",
  black: "#000000",
  gray500: "#A6A6A6",
  gray200: "#E8E8E8",
  button: "#1F2D33",
  buttonText: "#FFFFFF",
  secondaryButton: "#1F2D33",
};

export const Colors = {
  light: {
    background: "#FFFFFF",
    title: "#1C1C1E",
    subtitle: "#4A4A4A",
    text: "#4A4A4A",
    border: "#17143375",
    link: "#1F2D33",
    formHeading: "#171433",
    ...sharedColors,
  },
  dark: {
    background: "#000000",
    title: "#FFFFFF",
    subtitle: "#B0B0B0",
    text: "#B0B0B0",
    border: "#FFFFFF30",
    link: "#B0B0B0",
    formHeading: "#FFFFFF",
    ...sharedColors,
  },
};

export function useTheme() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? "light"];
}
