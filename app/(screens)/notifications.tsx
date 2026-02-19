import { ThemedText } from '@/components/themed-text'
import EmptyState from '@/components/ui/empty-state'
import { Fonts } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Notifications() {
    const colors = useTheme();
    const router = useRouter();
    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
            edges={["top"]}
        >
            <StatusBar barStyle={colors.statusBarStyle} />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.header}>
                    <Pressable
                        style={[
                            styles.backButton,
                            { backgroundColor: colors.card, shadowColor: colors.shadow },
                        ]}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons
                            name="arrow-back-ios"
                            size={18}
                            color={colors.primary}
                        />
                    </Pressable>
                    <ThemedText style={[styles.headerTitle, { color: colors.title }]}>
                        Notifications
                    </ThemedText>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        [].length === 0 ?
                            <EmptyState
                                description='We’ll let you know when there will be something to update you.'
                                image={require("@/assets/images/emptyNotification.png")}
                                title={"No Notifications"}
                            />
                            : <ThemedText style={{ color: colors.text, fontFamily: Fonts.title }}>You have 5 notifications</ThemedText>
                    }
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 32,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 8,
    },
    backButton: {
        width: 36,
        height: 36,
        flex:0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 2,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontFamily: Fonts.subtitle,
    },
    flex: {
        flex: 1,
    },
    headerSpacer: {
        width: 36, // Same width as back button to center the title
    },

})