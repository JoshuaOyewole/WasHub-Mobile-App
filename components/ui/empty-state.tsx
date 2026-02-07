import React from "react";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View,
} from "react-native";

type EmptyStateProps = {
  image: ImageSourcePropType;
  title?: string;
  description?: string;
};

export default function EmptyState({
  image,
  title,
  description,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      {title && <Text style={styles.title}>{title}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
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
    fontWeight: "600",
    color: "#1F2D33",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#7D7D7D",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
