import { HapticTab } from "@/components/haptic-tab";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.inactiveTint,

        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          // borderTopLeftRadius: 15,
          //borderTopRightRadius: 15,
          backgroundColor: colors.tabBar,
          paddingTop: 5,
          marginBottom: 0,
          paddingBottom: insets.bottom,
          height: (Platform.OS === "ios" ? 60 : 65) + insets.bottom,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.title,
          fontSize: Platform.OS === "ios" ? 14 : 13,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome6
              name="house"
              size={Platform.OS === "ios" ? 22 : 18}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: Platform.OS === "ios" ? 14 : 12,
                color,
                fontFamily: focused ? Fonts.subtitle : Fonts.titleLight,  
              }}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: "Booking",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="car"
              size={Platform.OS === "ios" ? 22 : 18}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: Platform.OS === "ios" ? 14 : 12,
                color,
                fontFamily: focused ? Fonts.subtitle : Fonts.titleLight,  
              }}
            >
              Booking
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: "Request",
          tabBarIcon: ({ color }) => (
            <FontAwesome6
              name="clock"
              size={Platform.OS === "ios" ? 22 : 18}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: Platform.OS === "ios" ? 14 : 12,
                color,
                fontFamily: focused ? Fonts.subtitle : Fonts.titleLight,  
              }}
            >
              Request
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person"
              size={Platform.OS === "ios" ? 22 : 18}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: Platform.OS === "ios" ? 14 : 12,
                color,
                fontFamily: focused ? Fonts.subtitle : Fonts.titleLight, 
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
