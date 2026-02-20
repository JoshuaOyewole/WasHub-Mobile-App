import { ThemedText } from '@/components/themed-text'
import { Fonts } from '@/constants/theme'
import { useBooking } from '@/contexts/BookingContext'
import { useTheme } from '@/hooks/useTheme'
import { shareReceiptAsPdf } from '@/lib/receiptShare'
import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Alert, Platform, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const SERVICE_CHARGE = 100;

export default function TransactionFailed() {
  const colors = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { booking } = useBooking();
  const params = useLocalSearchParams<{ reference?: string; outletName?: string }>();
  const fallbackBookingDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');

  const bookingDate = booking.date
    ? booking.date.toLocaleDateString('en-GB').replace(/\//g, '-')
    : fallbackBookingDate;

  const bookingRef = params.reference || booking.paymentIntent?.reference || '';
  const outletName = params.outletName || booking.paymentIntent?.outletName || 'N/A';
  const washType = booking.washType || 'Basic';
  const washTypeLabel = washType.toLowerCase().includes('wash') ? washType : `${washType} Wash`;
  const basePrice = booking.price || 0;
  const total = basePrice + SERVICE_CHARGE;

  const onShareReceipt = async () => {
    try {
      await shareReceiptAsPdf({
        status: 'Not successful',
        bookingDate,
        bookingRef,
        outletName,
        washType: washTypeLabel,
        basePrice,
        serviceCharge: SERVICE_CHARGE,
        total,
      });
    } catch {
      Alert.alert('Share failed', 'Unable to generate receipt file right now. Please try again.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <StatusBar barStyle={colors.statusBarStyle} />

      <View style={styles.header}>
        <Pressable
          style={[styles.iconBtn, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialIcons name="arrow-back-ios" size={18} color={colors.primary} />
        </Pressable>

        <Pressable
          style={[styles.iconBtn, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
          onPress={onShareReceipt}
          accessibilityRole="button"
          accessibilityLabel="Share receipt"
        >
          <MaterialIcons name="share" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusWrap}>
          <View style={[styles.statusIcon, { backgroundColor: '#DC2626' }]}>
            <MaterialIcons name="close" size={38} color={colors.white} />
          </View>
          <ThemedText style={[styles.title, { color: colors.text }]}>Payment Unsuccessful!</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}> 
            Your payment was not completed. Please try again to confirm your booking.
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <ThemedText style={[styles.metaLabel, { color: colors.textMuted }]}>Booking Date</ThemedText>
              <ThemedText style={[styles.metaValue, { color: colors.text }]}>{bookingDate}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <ThemedText style={[styles.metaLabel, { color: colors.textMuted }]}>Booking Number</ThemedText>
              <ThemedText style={[styles.metaValue, { color: colors.text }]}>{bookingRef}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <ThemedText style={[styles.metaLabel, { color: colors.textMuted }]}>Booking Status</ThemedText>
              <ThemedText style={[styles.metaValue, { color: '#DC2626' }]}>Not successful</ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <ThemedText style={[styles.sectionHeading, { color: colors.textMuted }]}>ORDER SUMMARY</ThemedText>
          <View style={styles.orderRow}>
            <View style={styles.orderImage} />
            <View style={styles.orderTextCol}>
              <ThemedText style={[styles.orderMain, { color: colors.text }]}>Outlet: {outletName}</ThemedText>
              <ThemedText style={[styles.orderSub, { color: colors.textMuted }]}>Wash type: {washTypeLabel}</ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <ThemedText style={[styles.sectionHeading, { color: colors.textMuted }]}>PAYMENT SUMMARY</ThemedText>
          <View style={styles.amountRow}><ThemedText style={[styles.amountLabel, { color: colors.text }]}>{washTypeLabel} :</ThemedText><ThemedText style={[styles.amountValue, { color: colors.text }]}>₦{basePrice.toLocaleString()}</ThemedText></View>
          <View style={styles.amountRow}><ThemedText style={[styles.amountLabel, { color: colors.text }]}>Service Charge :</ThemedText><ThemedText style={[styles.amountValue, { color: colors.text }]}>₦{SERVICE_CHARGE.toLocaleString()}</ThemedText></View>
          <View style={styles.amountRow}><ThemedText style={[styles.amountTotalLabel, { color: colors.text }]}>Total:</ThemedText><ThemedText style={[styles.amountTotalValue, { color: colors.text }]}>₦{total.toLocaleString()}</ThemedText></View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (Platform.OS === 'ios' ? 12 : 10) + insets.bottom }]}>
        <Pressable style={[styles.primaryBtn, { backgroundColor: colors.button }]} onPress={() => router.replace('/(screens)/booking-confirmation')}>
          <ThemedText style={[styles.primaryBtnText, { color: colors.buttonText }]}>Retry</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  content: { paddingHorizontal: 20, paddingBottom: 16 },
  statusWrap: { alignItems: 'center', marginBottom: 14 },
  statusIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 22, fontFamily: Fonts.title, textAlign: 'center' },
  subtitle: { marginTop: 8, fontSize: 16, fontFamily: Fonts.body, textAlign: 'center', lineHeight: 22 },
  card: { borderWidth: 1, borderRadius: 10, padding: 14 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: 11, fontFamily: Fonts.body },
  metaValue: { marginTop: 4, fontSize: 13, fontFamily: Fonts.subtitle },
  divider: { height: 1, marginVertical: 12 },
  sectionHeading: { fontSize: 11, fontFamily: Fonts.subtitle, marginBottom: 10 },
  orderRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10 },
  orderImage: { width: 72, height: 48, borderRadius: 6, backgroundColor: '#2D4A57' },
  orderTextCol: { flex: 1 },
  orderMain: { fontSize: 13, fontFamily: Fonts.subtitle },
  orderSub: { marginTop: 3, fontSize: 12, fontFamily: Fonts.body },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  amountLabel: { fontSize: 13, fontFamily: Fonts.subtitle },
  amountValue: { fontSize: 13, fontFamily: Fonts.subtitle },
  amountTotalLabel: { fontSize: 14, fontFamily: Fonts.title },
  amountTotalValue: { fontSize: 14, fontFamily: Fonts.title },
  footer: { paddingHorizontal: 20, paddingTop: 8 },
  primaryBtn: { height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 17, fontFamily: Fonts.subtitle },
});