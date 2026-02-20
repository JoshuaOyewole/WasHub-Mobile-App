import { Fonts } from "@/constants/theme";
import { useBooking, WashType } from "@/contexts/BookingContext";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { fetchOutletById, IOutlet } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const WASH_OPTIONS: WashType[] = ["Quick Wash", "Basic", "Premium"];

const TIME_SLOTS = [
  "09:00 am",
  "10:00 am",
  "11:00 am",
  "12:00 am",
  "01:00 pm",
  "02:00 pm",
  "03:00 pm",
  "04:00 pm",
  "05:00 pm",
];

export default function CarWashDetailsScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const inset = useSafeAreaInsets();
  const params = useLocalSearchParams<{ outletId: string }>();
  const { booking, setWashType, setDateTime, isBookingValid, setPrice } =
    useBooking();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showWashOptions, setShowWashOptions] = useState(false);

  const { data: outletData, isLoading } = useQuery({
    queryKey: ["outlet", params.outletId],
    queryFn: () => fetchOutletById(params.outletId!),
    enabled: !!params.outletId,
    staleTime: 1000 * 60 * 5,
  });

  const outlet: IOutlet | undefined = outletData?.data;

  // Restore existing booking data on mount
  useEffect(() => {
    if (booking.date) {
      const dateStr = booking.date.toISOString().split("T")[0];
      setSelectedDate(dateStr);
    }
    if (booking.time) {
      setSelectedTime(booking.time);
    }
    // Restore price based on selected wash type
    if (booking.washType && outlet?.pricing) {
      const priceMap = {
        "Quick Wash": outlet.pricing.quickWash,
        Basic: outlet.pricing.basic,
        Premium: outlet.pricing.premium,
      };
      setPrice(priceMap[booking.washType] || 0);
    }
  }, [booking.washType, outlet]);

  const handleWashOptionSelect = (option: WashType) => {
    setWashType(option);
    setShowWashOptions(false);

    // Set price based on selected wash type
    if (outlet?.pricing) {
      const priceMap = {
        "Quick Wash": outlet.pricing.quickWash,
        Basic: outlet.pricing.basic,
        Premium: outlet.pricing.premium,
      };
      setPrice(priceMap[option] || 0);
    }
  };
  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
    const date = new Date(dateString);
    if (selectedTime) {
      setDateTime(date, selectedTime);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const date = new Date(selectedDate);
      setDateTime(date, time);
    }
  };

  const handleProceed = () => {
    if (!isBookingValid()) {
      toast(
        "error",
        "Incomplete Booking",
        "Please fill in all required fields",
      );
      return;
    }

    // Log booking data for verification
    console.log("Booking Data:", {
      carId: booking.carId,
      outletId: booking.outletId,
      washType: booking.washType,
      date: booking.date?.toISOString(),
      time: booking.time,
      price: booking.price,
    });

    // Navigate to confirmation or payment screen
    router.push("/(screens)/booking-confirmation");
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background, paddingBottom: Platform.OS === "ios" ? 20 : 0 + inset.bottom }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!outlet) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background, paddingBottom: Platform.OS === "ios" ? 20 : 0 + inset.bottom }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Outlet not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: inset.bottom,
        },
      ]}
      edges={["top"]}
    >
      <StatusBar barStyle={colors.statusBarStyle} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.card }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Step 3 of 4 - Wash Details
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Outlet Image */}
        <Image
          source={
            outlet.image
              ? { uri: outlet.image }
              : require("@/assets/images/eko_car_wash_otlet.png")
          }
          style={styles.outletImage}
          resizeMode="cover"
        />

        {/* Outlet Info */}
        <View style={styles.outletHeader}>
          <Text style={[styles.outletName, { color: colors.text }]}>
            {outlet.name}
          </Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < (outlet.rating || 0) ? "star" : "star-outline"}
                size={16}
                color="#FFC107"
              />
            ))}
          </View>
        </View>

        {/* Services */}
        {outlet.services && outlet.services.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Service
            </Text>
            <View style={styles.servicesGrid}>
              {outlet.services.map((service: string, index: number) => (
                <View key={index} style={styles.serviceItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.primary}
                  />
                  <Text
                    style={[
                      styles.serviceText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {service}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            A vehicle cleaning service focused on providing fast, high quality
            washes that restore shine, preserve appearance, and protect your car
            using modern equipment and eco-friendly practices.
          </Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <View style={styles.locationHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Location
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewMap, { color: colors.primary }]}>
                View Map
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
            {outlet.address}, {outlet.state}
          </Text>
        </View>

        {/* Wash Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Wash options
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdown,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => setShowWashOptions(!showWashOptions)}
          >
            <Text style={[styles.dropdownText, { color: colors.text }]}>
              {booking.washType || "Select wash option"}
            </Text>
            <Ionicons
              name={showWashOptions ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          {showWashOptions && (
            <View
              style={[
                styles.dropdownMenu,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {WASH_OPTIONS.map((option) => {
                const priceMap = {
                  "Quick Wash": outlet?.pricing?.quickWash || 2500,
                  Basic: outlet?.pricing?.basic || 5000,
                  Premium: outlet?.pricing?.premium || 8500,
                };
                return (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => handleWashOptionSelect(option)}
                  >
                    <View style={styles.dropdownItemContent}>
                      <Text
                        style={[
                          styles.dropdownItemText,
                          { color: colors.text },
                        ]}
                      >
                        {option}
                      </Text>
                      <Text
                        style={[
                          styles.dropdownPriceText,
                          { color: colors.primary },
                        ]}
                      >
                        ₦{priceMap[option].toLocaleString()}
                      </Text>
                    </View>
                    {booking.washType === option && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {booking.washType && booking.price > 0 && (
            <View style={styles.priceDisplay}>
              <Text
                style={[styles.priceLabel, { color: colors.textSecondary }]}
              >
                Selected Price:
              </Text>
              <Text style={[styles.priceValue, { color: colors.primary }]}>
                ₦{booking.price.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Select Date
          </Text>
          <Calendar
            onDayPress={(day) => handleDateSelect(day.dateString)}
            markedDates={{
              [selectedDate || ""]: {
                selected: true,
                selectedColor: colors.primary,
              },
            }}
            theme={{
              backgroundColor: colors.card,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.white,
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.textPlaceholder,
              dotColor: colors.primary,
              selectedDotColor: colors.white,
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              textDayFontWeight: "400",
              textMonthFontWeight: "600",
              textDayHeaderFontWeight: "500",
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
            style={styles.calendar}
            minDate={new Date().toISOString().split("T")[0]}
            enableSwipeMonths={true}
          />
        </View>

        {/* Select Time */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Select Time
          </Text>
          <View style={styles.timeSlotsGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  { borderColor: colors.border, backgroundColor: colors.card },
                  selectedTime === time && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => handleTimeSelect(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    { color: colors.text },
                    selectedTime === time && {
                      color: colors.white,
                      fontFamily: Fonts.bodyMedium,
                    },
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          style={[
            styles.proceedButton,
            { backgroundColor: colors.button },
            !isBookingValid() && { backgroundColor: colors.textPlaceholder },
          ]}
          onPress={handleProceed}
          disabled={!isBookingValid()}
        >
          <Text
            style={[styles.proceedButtonText, { color: colors.buttonText }]}
          >
            Proceed
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  placeholder: {
    flex: 0.5,
     // This is just to take up space and center the title, can be removed if not needed
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.subtitle,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  outletImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  outletHeader: {
    marginBottom: 16,
  },
  outletName: {
    fontSize: 20,
    fontFamily: Fonts.subtitle,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.subtitle,
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "48%",
  },
  serviceText: {
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.body,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  viewMap: {
    fontSize: 14,
    fontFamily: Fonts.bodyMedium,
  },
  locationText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.body,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  dropdownMenu: {
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  dropdownItemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 8,
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: Fonts.bodyMedium,
  },
  dropdownPriceText: {
    fontSize: 14,
    fontFamily: Fonts.subtitle,
  },
  priceDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
    //backgroundColor: "#FFF5ED",
    //borderRadius: 8,
    //borderWidth: 1,
    //borderColor: "#F77C0B",
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: Fonts.bodyMedium,
  },
  priceValue: {
    fontSize: 18,
    fontFamily: Fonts.title,
  },
  calendar: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeSlot: {
    width: "30%",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: "center",
  },
  selectedTimeSlot: {},
  timeSlotText: {
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  selectedTimeSlotText: {
    fontFamily: Fonts.bodyMedium,
  },
  proceedButton: {
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  proceedButtonDisabled: {},
  proceedButtonText: {
    fontSize: 16,
    fontFamily: Fonts.subtitle,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
