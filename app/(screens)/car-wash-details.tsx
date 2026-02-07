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
import { SafeAreaView } from "react-native-safe-area-context";

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
      <SafeAreaView style={[styles.container, { backgroundColor: "#F8F8F8" }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F77C0B" />
        </View>
      </SafeAreaView>
    );
  }

  if (!outlet) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "#F8F8F8" }]}>
        <View style={styles.loadingContainer}>
          <Text>Outlet not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: "#F8F8F8",
          paddingBottom: Platform.OS === "ios" ? 20 : 0,
        },
      ]}
      edges={["top"]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1F2D33" />
        </Pressable>
        <Text style={styles.title}>Step 3 of 4 - Wash Details</Text>
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
          <Text style={styles.outletName}>{outlet.name}</Text>
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
            <Text style={styles.sectionTitle}>Service</Text>
            <View style={styles.servicesGrid}>
              {outlet.services.map((service: string, index: number) => (
                <View key={index} style={styles.serviceItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#F77C0B" />
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            A vehicle cleaning service focused on providing fast, high quality
            washes that restore shine, preserve appearance, and protect your car
            using modern equipment and eco-friendly practices.
          </Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity>
              <Text style={styles.viewMap}>View Map</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.locationText}>
            {outlet.address}, {outlet.state}
          </Text>
        </View>

        {/* Wash Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wash options</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowWashOptions(!showWashOptions)}
          >
            <Text style={styles.dropdownText}>
              {booking.washType || "Select wash option"}
            </Text>
            <Ionicons
              name={showWashOptions ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
          {showWashOptions && (
            <View style={styles.dropdownMenu}>
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
                      <Text style={styles.dropdownItemText}>{option}</Text>
                      <Text style={styles.dropdownPriceText}>
                        ₦{priceMap[option].toLocaleString()}
                      </Text>
                    </View>
                    {booking.washType === option && (
                      <Ionicons name="checkmark" size={20} color="#F77C0B" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {booking.washType && booking.price > 0 && (
            <View style={styles.priceDisplay}>
              <Text style={styles.priceLabel}>Selected Price:</Text>
              <Text style={styles.priceValue}>
                ₦{booking.price.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Calendar
            onDayPress={(day) => handleDateSelect(day.dateString)}
            markedDates={{
              [selectedDate || ""]: {
                selected: true,
                selectedColor: "#F77C0B",
              },
            }}
            theme={{
              backgroundColor: "#FFFFFF",
              calendarBackground: "#FFFFFF",
              textSectionTitleColor: "#666",
              selectedDayBackgroundColor: "#F77C0B",
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: "#F77C0B",
              dayTextColor: "#1F2D33",
              textDisabledColor: "#D3D3D3",
              dotColor: "#F77C0B",
              selectedDotColor: "#FFFFFF",
              arrowColor: "#F77C0B",
              monthTextColor: "#1F2D33",
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
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeSlotsGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot,
                ]}
                onPress={() => handleTimeSelect(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.selectedTimeSlotText,
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
            !isBookingValid() && styles.proceedButtonDisabled,
          ]}
          onPress={handleProceed}
          disabled={!isBookingValid()}
        >
          <Text style={styles.proceedButtonText}>Proceed</Text>
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
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  placeholder: {
    width: 35,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2D33",
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
    fontWeight: "600",
    color: "#1F2D33",
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
    fontWeight: "600",
    color: "#1F2D33",
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
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  viewMap: {
    fontSize: 14,
    color: "#F77C0B",
    fontWeight: "500",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dropdownText: {
    fontSize: 14,
    color: "#1F2D33",
  },
  dropdownMenu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
    color: "#1F2D33",
    fontWeight: "500",
  },
  dropdownPriceText: {
    fontSize: 14,
    color: "#F77C0B",
    fontWeight: "600",
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
    color: "#666",
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 18,
    color: "#F77C0B",
    fontWeight: "700",
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
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  selectedTimeSlot: {
    backgroundColor: "#F77C0B",
    borderColor: "#F77C0B",
  },
  timeSlotText: {
    fontSize: 14,
    color: "#1F2D33",
  },
  selectedTimeSlotText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  proceedButton: {
    backgroundColor: "#1F2D33",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  proceedButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
