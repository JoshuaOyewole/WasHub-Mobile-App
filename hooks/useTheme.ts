import { useColorScheme } from "react-native";

// Shared colors that don't change between themes
const sharedColors = {
  primary: "#F77C0B",
  primaryLight: "#FF8C00",
  secondary: "#1F2D33",
  black: "#000000",
  white: "#FFFFFF",
  button: "#1F2D33",
  buttonText: "#FFFFFF",
  error: "#FF3B30",
  errorBg: "#FFE5E5",
  success: "#34C759",
  warning: "#FF9500",
  splashBackground: "#1F2D33",
};

export const Colors = {
  light: {
    // Backgrounds
    background: "#F8F8F8",
    card: "#FFFFFF",
    surface: "#F5F5F5",
    surfaceAlt: "#FFF5E6",
    modalOverlay: "rgba(0, 0, 0, 0.5)",

    // Text
    text: "#1F2D33",
    textSecondary: "#666666",
    textMuted: "#7D7D7D",
    textPlaceholder: "#B0B0B0",
    title: "#1C1C1E",
    subtitle: "#4A4A4A",

    // Borders & Dividers
    border: "#E8E8E8",
    borderLight: "#EFEFF0",
    divider: "#E4E4E4",
    inputBorder: "#e7e5e5",

    // Icons
    icon: "#687076",
    iconMuted: "#7D7D7D",
    resolvedIconColor: "#F28B3C",
    // Tab bar
    tabBar: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: "#F77C0B",
    tint: "#F77C0B",
    inactiveTint: "#1F2D33",

    // Shadows
    shadow: "#000000",

    // StatusBar
    statusBarStyle: "dark-content" as "dark-content" | "light-content",

    // Form
    formHeading: "#171433",
    inputBackground: "#F5F5F5",
    link: "#1F2D33",

    // Components
    progressTrack: "#E8E8E8",
    dash: "#D1D5DB",
    dotInactive: "#D1D5DB",
    cardBorderLeft: "#FF8C00",
    stepInactive: "#D3D3D3",
    chevron: "#C7C7CC",
    notificationDot: "#FF3B30",
    switchTrackOff: "#E5E7EB",
    switchTrackOn: "#F39C4C",

    ...sharedColors,
  },
  dark: {
    // Backgrounds
    background: "#1F2D33",
    card: "#1C1C1E",
    surface: "#2C2C2E",
    surfaceAlt: "#2C2215",
    modalOverlay: "rgba(0, 0, 0, 0.7)",

    // Text
    text: "#E5E5E7",
    textSecondary: "#ABABAB",
    textMuted: "#8E8E93",
    textPlaceholder: "#636366",
    title: "#FFFFFF",
    subtitle: "#B0B0B0",

    // Borders & Dividers
    border: "#38383A",
    borderLight: "#2C2C2E",
    divider: "#38383A",
    inputBorder: "#38383A",

    // Icons
    icon: "#8E8E93",
    iconMuted: "#8E8E93",
    resolvedIconColor: "#ffffff",
    // Tab bar
    tabBar: "#1C1C1E",
    tabIconDefault: "#8E8E93",
    tabIconSelected: "#F77C0B",
    tint: "#F77C0B",
    inactiveTint: "#E5E5E7",

    // Shadows
    shadow: "#000000",

    // StatusBar
    statusBarStyle: "light-content" as "dark-content" | "light-content",

    // Form
    formHeading: "#FFFFFF",
    inputBackground: "#2C2C2E",
    link: "#B0B0B0",

    // Components
    progressTrack: "#38383A",
    dash: "#48484A",
    dotInactive: "#48484A",
    cardBorderLeft: "#FF8C00",
    stepInactive: "#48484A",
    chevron: "#48484A",
    notificationDot: "#FF453A",
    switchTrackOff: "#38383A",
    switchTrackOn: "#F39C4C",

    ...sharedColors,
  },
};

export type ThemeColors = typeof Colors.light;

export function useTheme(): ThemeColors {
  const colorScheme = useColorScheme();
  return Colors[colorScheme === "dark" ? "dark" : "light"];
}
