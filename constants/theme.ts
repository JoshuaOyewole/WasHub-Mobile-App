/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Colors as ThemeColors } from "@/hooks/useTheme";

export const Colors = ThemeColors;

/**
 * Poppins font family mapped by weight.
 * Use these constants with `fontFamily` instead of `fontWeight`
 * to avoid synthetic bolding on Android.
 */
export const Fonts = {
  thin: "Poppins_100Thin",
  thinItalic: "Poppins_100Thin_Italic",
  extraLight: "Poppins_200ExtraLight",
  extraLightItalic: "Poppins_200ExtraLight_Italic",
  light: "Poppins_300Light",
  lightItalic: "Poppins_300Light_Italic",
  regular: "Poppins_400Regular",
  regularItalic: "Poppins_400Regular_Italic",
  medium: "Poppins_500Medium",
  mediumItalic: "Poppins_500Medium_Italic",
  semiBold: "Poppins_600SemiBold",
  semiBoldItalic: "Poppins_600SemiBold_Italic",
  bold: "Poppins_700Bold",
  boldItalic: "Poppins_700Bold_Italic",
  extraBold: "Poppins_800ExtraBold",
  extraBoldItalic: "Poppins_800ExtraBold_Italic",
  black: "Poppins_900Black",
  blackItalic: "Poppins_900Black_Italic",
} as const;

export type FontFamily = (typeof Fonts)[keyof typeof Fonts];
