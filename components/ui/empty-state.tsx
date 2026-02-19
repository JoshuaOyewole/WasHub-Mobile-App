
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type EmptyStateProps = {
  image: ImageSourcePropType;
  title?: string;
  description?: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
};

export default function EmptyState({
  image,
  title,
  description,
  buttonTitle,
  onButtonPress

}: EmptyStateProps) {
  const colors = useTheme();
  const router = useRouter();


  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      )}
      {description && (
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {description}
        </Text>
      )}
      {buttonTitle && (
        <TouchableOpacity onPress={onButtonPress} style={{ marginTop: 16, backgroundColor:colors.secondaryButtonBackground, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
          <Text style={{ color: colors.secondaryButtonText }}>{buttonTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.subtitle,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.body,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
