import { useTheme } from "@/hooks/useTheme";
import { ActivityIndicator, View } from "react-native";

export default function LoadingScreen() {
  const colors = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
