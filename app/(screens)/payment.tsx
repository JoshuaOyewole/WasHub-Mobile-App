import { ThemedText } from '@/components/themed-text'
import { Fonts } from '@/constants/theme'
import { useBooking } from '@/contexts/BookingContext'
import { useTheme } from '@/hooks/useTheme'
import { verifyPayment } from '@/lib/api/transactions'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { usePaystack } from 'react-native-paystack-webview'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Payment() {
    const colors = useTheme();
    const router = useRouter();
    const inset = useSafeAreaInsets();
    const { booking } = useBooking();
    const { popup } = usePaystack();
    const email = booking.paymentIntent?.email || "";
    const reference = booking.paymentIntent?.reference || "";
    const amount = booking.paymentIntent?.amount || 0;
    const authorizationUrl = booking.paymentIntent?.authorizationUrl || "";
    const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

    const extractReferenceFromPaystackResponse = (response: any): string => {
        const directReference = response?.reference;
        const transactionRef = response?.transactionRef;
        const nestedReference = response?.data?.reference;
        const nestedTransactionRef = response?.data?.transactionRef;

        return (
            directReference ||
            transactionRef ||
            nestedReference ||
            nestedTransactionRef ||
            ""
        );
    };

    const handleInitiatePaystack = async () => {
        if (!email || !reference || !amount || !authorizationUrl) {
            console.log("Missing payment context", { email, reference, amount });
            router.replace('/(screens)/booking-confirmation');
            return;
        }
        console.log("Opening backend-initialized Paystack checkout", {
            email,
            reference,
            amount,
            authorizationUrl,
        });
      
        popup.checkout({
            email: email||'',
            amount: amount||0,
            reference: reference||'',
            onSuccess: async (response: any) => {
                console.log('Payment successful!', response);
                setIsVerifyingPayment(true);
                try {
                    const paymentReference = extractReferenceFromPaystackResponse(response);

                    if (!paymentReference) {
                        setIsVerifyingPayment(false);
                        Alert.alert('Verification failed', 'No payment reference returned from gateway.');
                        router.replace("/(screens)/transaction-failed");
                        return;
                    }

                    if (paymentReference !== reference) {
                        console.log('Reference mismatch:', { expected: reference, received: paymentReference });
                        setIsVerifyingPayment(false);
                        Alert.alert('Verification failed', 'Payment reference mismatch.');
                        router.replace("/(screens)/transaction-failed");
                        return;
                    }

                    const verification = await verifyPayment(paymentReference);

                    console.log('Payment verification response:', verification);
                    
                    if (!verification?.status || verification?.data?.status !== 'success') {
                        console.log('Payment verification failed:', verification);
                        setIsVerifyingPayment(false);
                        Alert.alert('Verification failed', verification?.message || verification?.error || 'Unable to verify payment.');
                        router.replace("/(screens)/transaction-failed");
                        return;
                    }

                    router.replace({
                        pathname: "/(screens)/transaction-success",
                        params: {
                            reference: paymentReference,
                        },
                    });
                } catch (error: any) {
                    console.log('Payment verification error:', error);
                    setIsVerifyingPayment(false);
                    Alert.alert('Verification failed', error?.message || 'Unable to verify payment.');
                    router.replace("/(screens)/transaction-failed");
                }
            },
            onError: (err: any) => {
                console.log('Payment error:', err);
                setIsVerifyingPayment(false);
                router.replace("/(screens)/transaction-failed");
            },
            onCancel: () => {
                console.log('Payment cancelled by user.');
                setIsVerifyingPayment(false);
                router.replace("/(screens)/transaction-failed");
            },

        })


    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
            edges={["top"]}
        >
            <StatusBar barStyle={colors.statusBarStyle} />

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
                    Payment
                </ThemedText>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={[
                        styles.paystackCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.primary,
                            shadowColor: colors.shadow,
                        },
                    ]}
                    accessible
                    accessibilityRole="summary"
                    accessibilityLabel="Paystack is the selected payment method"
                >
                    <View style={styles.paystackCardHeader}>
                        <View style={styles.paystackLeft}>
                            <View style={[styles.paystackLogo, { backgroundColor: colors.secondary }]}>
                                <ThemedText style={[styles.paystackLogoText, { color: colors.white }]}>P</ThemedText>
                            </View>
                            <View>
                                <ThemedText style={[styles.paystackTitle, { color: colors.text }]}>Pay with Paystack</ThemedText>
                                <ThemedText style={[styles.paystackSubtitle, { color: colors.textMuted }]}>
                                    Secure card, transfer, and bank payment checkout
                                </ThemedText>
                            </View>
                        </View>
                        <MaterialIcons name="verified-user" size={18} color={colors.primary} />
                    </View>

                    <View style={[styles.badgeRow, { borderTopColor: colors.border }]}>
                        <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
                            <MaterialIcons name="lock-outline" size={14} color={colors.primary} />
                            <ThemedText style={[styles.badgeText, { color: colors.textSecondary }]}>Encrypted</ThemedText>
                        </View>
                        <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
                            <MaterialIcons name="bolt" size={14} color={colors.primary} />
                            <ThemedText style={[styles.badgeText, { color: colors.textSecondary }]}>Fast checkout</ThemedText>
                        </View>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <ThemedText style={[styles.infoTitle, { color: colors.text }]}>Important information</ThemedText>
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <ThemedText style={[styles.infoText, { color: colors.textMuted }]}>
                        You’ll be redirected to Paystack to complete payment securely.
                    </ThemedText>
                    <ThemedText style={[styles.infoText, { color: colors.textMuted }]}>
                        Make sure you check your email for your payment receipt after checkout.
                    </ThemedText>
                </View>
            </ScrollView>

            <View
                style={[
                    styles.footer,
                    {
                        backgroundColor: colors.background,
                        paddingBottom: (Platform.OS === 'ios' ? 12 : 10) + inset.bottom,
                    },
                ]}
            >
                <Pressable
                    onPress={handleInitiatePaystack}
                    style={[
                        styles.payButton,
                        { backgroundColor: colors.button },
                        isVerifyingPayment && styles.payButtonDisabled,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Initiate Paystack payment"
                    accessibilityHint="Opens secure Paystack checkout"
                    disabled={isVerifyingPayment}
                >
                    <View style={styles.payButtonContent}>

                        <Image source={require('@/assets/images/Paystack.png')} style={{ width: 72, height: 32 }} />

                        <ThemedText style={[styles.payButtonText, { color: colors.buttonText }]}>
                            Continue with Paystack
                        </ThemedText>
                    </View>
                </Pressable>
            </View>

            {isVerifyingPayment ? (
                <View style={[styles.verifyingOverlay, { backgroundColor: colors.background }]}> 
                    <ActivityIndicator size="large" color={colors.primary} />
                    <ThemedText style={[styles.verifyingTitle, { color: colors.text }]}>Verifying payment...</ThemedText>
                    <ThemedText style={[styles.verifyingSubtitle, { color: colors.textMuted }]}>Please wait while we confirm your transaction</ThemedText>
                </View>
            ) : null}

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
        paddingBottom: 24,
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
        flex: 0,
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
    paystackCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    paystackCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    paystackLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        flex: 1,
    },
    paystackLogo: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paystackLogoText: {
        fontSize: 16,
        fontFamily: Fonts.title,
    },
    paystackTitle: {
        fontSize: 15,
        fontFamily: Fonts.subtitle,
    },
    paystackSubtitle: {
        fontSize: 12,
        marginTop: 2,
        fontFamily: Fonts.body,
    },
    badgeRow: {
        marginTop: 12,
        borderTopWidth: 1,
        paddingTop: 10,
        flexDirection: 'row',
        columnGap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 999,
    },
    badgeText: {
        fontSize: 12,
        fontFamily: Fonts.body,
    },
    divider: {
        marginTop: 18,
        marginBottom: 18,
        height: 1,
        width: '100%',
    },
    infoTitle: {
        fontSize: 22,
        fontFamily: Fonts.subtitle,
        marginBottom: 10,
    },
    infoCard: {
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 14,
        rowGap: 6,
    },
    infoText: {
        fontSize: 14,
        fontFamily: Fonts.body,
        lineHeight: 20,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    payButton: {
        height: 52,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButtonDisabled: {
        opacity: 0.7,
    },
    payButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
    },
    payButtonLogo: {
        width: 42,
        height: 42,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButtonLogoText: {
        fontSize: 12,
        fontFamily: Fonts.title,
    },
    payButtonText: {
        fontSize: 16,
        fontFamily: Fonts.subtitle,
    },
    verifyingOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        zIndex: 20,
    },
    verifyingTitle: {
        marginTop: 14,
        fontSize: 18,
        fontFamily: Fonts.subtitle,
        textAlign: 'center',
    },
    verifyingSubtitle: {
        marginTop: 6,
        fontSize: 14,
        fontFamily: Fonts.body,
        textAlign: 'center',
    },

})