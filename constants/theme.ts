/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Colors as ThemeColors } from "@/hooks/useTheme";

export const Colors = ThemeColors;

/**
 * Font family tokens.
 * Inter is used for body text; Plus Jakarta Sans is used for headings.
 */
export const Fonts = {
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  subtitle: "PlusJakartaSans_600SemiBold",
  title: "PlusJakartaSans_700Bold",
  titleStrong: "PlusJakartaSans_800ExtraBold",
  titleLight: "PlusJakartaSans_500SemiBold",

  // Backward-compatible aliases
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
} as const;

export type FontFamily = (typeof Fonts)[keyof typeof Fonts];
