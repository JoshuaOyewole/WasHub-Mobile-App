import CarCard, { Car } from "@/components/ui/car-card";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import { useBooking } from "@/contexts/BookingContext";
import { useTheme } from "@/hooks/useTheme";
import { fetchVehicles, type Vehicle } from "@/lib/api/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectCarScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { setCarId, setOutletId } = useBooking();
  const params = useLocalSearchParams<{ outletId?: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  // If navigating from outlet-details, set the outletId in booking context
  useEffect(() => {
    if (params.outletId) {
      setOutletId(params.outletId);
    }
  }, [params.outletId]);

  const { data: vehiclesResponse, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => fetchVehicles(),
    staleTime: 1000 * 60 * 5,
  });

  const vehicles: Vehicle[] = vehiclesResponse?.data || [];

  const cars: Car[] = vehicles.map((vehicle) => ({
    id: vehicle._id,
    brand: vehicle.vehicleMake,
    model: vehicle.vehicleModel,
    licensePlate: vehicle.plateNumber,
    image: vehicle.image
      ? { uri: vehicle.image }
      : require("@/assets/images/eko_car_wash_otlet.png"),
    washProgress: 0,
    isSelected: false,
  }));

  const filteredCars = cars.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCarSelect = (car: Car) => {
    setCarId(car.id);
    if (params.outletId) {
      // Outlet already selected (came from outlet-details), skip to wash details
      router.push({
        pathname: "/(screens)/car-wash-details",
        params: { outletId: params.outletId },
      });
    } else {
      router.push("/(screens)/car-wash-outlets");
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: Platform.OS === "ios" ? 20 : 0,
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
        <Text style={[styles.title, { color: colors.text }]}>
          Step 1 of 4 - Select car
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Field */}
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for your car"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredCars.length === 0 ? (
          <EmptyState
            image={require("@/assets/images/no-cars.png")}
            title="No cars found"
            description="Add your first car to get started with our wash services"
          />
        ) : (
          <View style={styles.carList}>
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} onPress={handleCarSelect} />
            ))}
          </View>
        )}
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
    width: 35,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  carList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
});
