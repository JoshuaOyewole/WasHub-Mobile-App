import { ThemedText } from '@/components/themed-text'
import { Fonts } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const INTRO_PARAGRAPHS = [
    'This Privacy Policy explains how WASHUB collects, uses, shares, and protects your personal information while you use our platform.',
    'By using WASHUB, you acknowledge and agree to the data practices described below.',
];

const PRIVACY_SECTIONS = [
    {
        title: '11. Privacy & Data Protection',
        clauses: [
            '11.1 Data Collection: WASHUB collects personal information necessary to provide services, process payments, and improve user experience. Details are in our Privacy Policy.',
            '11.2 Data Usage: We use your data to: (a) Process bookings and payments, (b) Communicate about services, (c) Improve platform features, (d) Comply with legal requirements, (e) Prevent fraud.',
            '11.3 Third-Party Sharing: We do not sell your personal data. We may share data with: Service Providers (to fulfill bookings), Payment processors, Insurance partners, Legal authorities (when required by law).',
            '11.4 Data Security: We employ industry-standard security measures including encryption, secure servers, and access controls to protect your information.',
            '11.5 User Rights: You have the right to access, correct, or delete your personal data subject to legal and operational requirements. Contact privacy@washub.ng for data requests.',
            '11.6 Nigeria Data Protection Regulation (NDPR): WASHUB complies with the Nigeria Data Protection Regulation 2019 and maintains lawful bases for data processing.',
        ],
    },
] as const;

export default function Privacy() {
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
                      Privacy Policy
                    </ThemedText>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {INTRO_PARAGRAPHS.map((paragraph) => (
                        <ThemedText
                            key={paragraph}
                            style={[styles.paragraph, { color: colors.text }]}
                        >
                            {paragraph}
                        </ThemedText>
                    ))}

                    {PRIVACY_SECTIONS.map((section) => (
                        <View key={section.title} style={styles.sectionWrap}>
                            <ThemedText style={[styles.sectionTitle, { color: colors.title }]}>
                                {section.title}
                            </ThemedText>
                            {section.clauses.map((clause) => (
                                <ThemedText
                                    key={clause}
                                    style={[styles.clauseText, { color: colors.text }]}
                                >
                                    {clause}
                                </ThemedText>
                            ))}
                        </View>
                    ))}
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
        rowGap: 10,
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
    paragraph: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: Fonts.body,
    },
    sectionWrap: {
        marginTop: 6,
    },
    sectionTitle: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: Fonts.subtitle,
        marginBottom: 8,
    },
    clauseText: {
        fontSize: 13,
        lineHeight: 21,
        fontFamily: Fonts.body,
        marginBottom: 8,
    },

})