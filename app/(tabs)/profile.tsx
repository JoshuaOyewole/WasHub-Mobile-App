import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useState, type ReactNode } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { user, logout } = useAuthStore();
  const colors = useTheme();

  const handleLogout = async () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: Platform.OS === "ios" ? 0 : 0,
        },
      ]}
      edges={["top"]}
    >
      <StatusBar barStyle={colors.statusBarStyle} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="subtitle" style={styles.pageTitle}>
          Profile Setting
        </ThemedText>

        <ThemedView
          style={styles.profileCard}
          lightColor={colors.card}
          darkColor={colors.card}
        >
          <Image
            source={{ uri: user?.profileImage ?? "" }}
            style={[styles.avatar, { backgroundColor: colors.border }]}
          />
          <View style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>{user?.name}</ThemedText>
            <ThemedText
              style={styles.profileEmail}
              lightColor={colors.textMuted}
              darkColor={colors.textMuted}
            >
              {user?.email}
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView
          style={styles.sectionCard}
          lightColor={colors.card}
          darkColor={colors.card}
        >
          <ThemedText style={styles.sectionLabel} lightColor={colors.textMuted}>
            General
          </ThemedText>
          <SettingRow
            icon="person"
            title="Edit Profile"
            subtitle="Change profile information"
            onPress={() => router.push("/(screens)/edit-profile")}
          />
          <Divider />
          <SettingRow
            icon="lock"
            title="Change Password"
            subtitle="Update and strengthen account security"
            onPress={() => router.push("/(screens)/change-password")}
          />
          <Divider />
          <SettingRow
            icon="description"
            title="Terms of Use"
            subtitle="Protect your account now"
          />
        </ThemedView>

        <ThemedView
          style={styles.sectionCard}
          lightColor={colors.card}
          darkColor={colors.card}
        >
          <ThemedText style={styles.sectionLabel} lightColor={colors.textMuted}>
            Preferences
          </ThemedText>
          <SettingRow
            icon="notifications"
            title="Notification"
            subtitle="Customize your preference"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: colors.switchTrackOff,
                  true: colors.switchTrackOn,
                }}
                thumbColor={notificationsEnabled ? "#FFFFFF" : "#FFFFFF"}
              />
            }
            hideChevron
          />
          <Divider />
          <SettingRow
            icon="help-outline"
            title="FAQ"
            subtitle="Questions and answers"
          />
          <Divider />
          <SettingRow
            icon="support-agent"
            title="Help"
            subtitle="Reach out to our customer services"
          />
          <Divider />
          <SettingRow
            icon="logout"
            title="Log out"
            subtitle="Securely log out your account"
            titleColor="#E25D5D"
            iconColor="#E25D5D"
            iconBackground={colors.errorBg}
            onPress={handleLogout}
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

type SettingRowProps = {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  rightElement?: ReactNode;
  hideChevron?: boolean;
  titleColor?: string;
  iconColor?: string;
  iconBackground?: string;
};

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  hideChevron,
  titleColor,
  iconColor,
  iconBackground,
}: SettingRowProps) {
  const colors = useTheme();
  //const resolvedIconBackground = iconBackground ?? colors.primaryLight;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View
        style={[styles.iconWrap, { backgroundColor: colors.iconBackground }]}
      >
        <MaterialIcons name={icon as any} size={20} color={colors.iconColor} />
      </View>
      <View style={styles.rowText}>
        <ThemedText
          style={[styles.rowTitle, titleColor && { color: titleColor }]}
        >
          {title}
        </ThemedText>
        <ThemedText
          style={styles.rowSubtitle}
          lightColor="#757171"
          darkColor="#8E8E93"
        >
          {subtitle}
        </ThemedText>
      </View>
      <View style={styles.rowRight}>
        {rightElement ? (
          rightElement
        ) : hideChevron ? null : (
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={colors.chevron}
          />
        )}
      </View>
    </Pressable>
  );
}

function Divider() {
  const colors = useTheme();
  return (
    <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 16,
  },
  pageTitle: {
    textAlign: "center",
    fontFamily: Fonts.rounded,
    fontSize: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionCard: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 14,
  },
  rowPressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  rowRight: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFF0",
    marginLeft: 64,
  },
});
