import AddVehicleModal from "@/components/ui/add-vehicle-modal";
import CarActionsModal from "@/components/ui/car-actions-modal";
import CarCard, { Car } from "@/components/ui/car-card";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import { useBooking } from "@/contexts/BookingContext";
import { useTheme } from "@/hooks/useTheme";
import { fetchVehicles, type Vehicle } from "@/lib/api/vehicles";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Booking() {
  const colors = useTheme();
  const router = useRouter();
  const { setCarId, clearBooking } = useBooking();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isActionsModalVisible, setIsActionsModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Use React Query for fetching vehicles with automatic caching and refetching
  const {
    data: vehiclesResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => fetchVehicles(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Refetch on screen focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const vehicles: Vehicle[] = vehiclesResponse?.data || [];

  // Map vehicles to Car format for CarCard component
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

  // Filter cars based on search query
  const filteredCars = cars.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCarPress = (selectedCar: Car) => {
    // Prevent selection if actions modal is already open
    if (isActionsModalVisible) return;

    setSelectedCar(selectedCar);
    setIsActionsModalVisible(true);
  };

  const handleWashCar = (car: Car) => {
    // Clear any previous booking data
    clearBooking();
    // Set the selected vehicle ID in booking context
    setCarId(car.id);
    // Close the actions modal
    setIsActionsModalVisible(false);
    setSelectedCar(null);
    // Navigate to car wash outlets screen (Step 2 of 4)
    router.push("/(screens)/car-wash-outlets");
  };

  const handleViewCarDetails = (car: Car) => {
    console.log("View car details:", car);
    // Navigate to car details modal
    router.push({
      pathname: "/(modals)/car-details",
      params: { vehicleId: car.id },
    });
  };

  const closeActionsModal = () => {
    // Reset selection when modal is closed without choosing an action
    setIsActionsModalVisible(false);
    setSelectedCar(null);
  };

  const openAddVehicleModal = () => {
    setIsModalVisible(true);
  };

  const closeAddVehicleModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveVehicle = async (vehicleData: any) => {
    // Refresh vehicles list after saving
    refetch();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: "#F8F8F8",
          paddingBottom: Platform.OS === "ios" ? 0 : 0,
        },
      ]}
      edges={["top"]}
    >
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dottedButton}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color="#BCBCBC"
          />
        </View>
        <View>
          <Text style={styles.title}>Your Car</Text>
        </View>
        <TouchableOpacity
          style={styles.addCarButton}
          onPress={openAddVehicleModal}
        >
          <FontAwesome6 name="plus" size={24} color={"#F77C0B"} />
        </TouchableOpacity>
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
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor="#F77C0B"
          />
        }
      >
        {/* Car List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F77C0B" />
          </View>
        ) : filteredCars.length <= 0 ? (
          <EmptyState
            image={require("@/assets/images/no-cars.png")}
            title="No cars found"
            description="Add your first car to get started with our wash services"
          />
        ) : (
          <View style={styles.carList}>
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} onPress={handleCarPress} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        visible={isModalVisible}
        onClose={closeAddVehicleModal}
        onSave={handleSaveVehicle}
      />

      {/* Car Actions Modal */}
      <CarActionsModal
        visible={isActionsModalVisible}
        onClose={closeActionsModal}
        car={selectedCar}
        onWashCar={handleWashCar}
        onViewDetails={handleViewCarDetails}
      />
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
  dottedButton: {
    width: 35,
    height: 35,
    backgroundColor: "#FFFFFF",
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  addCarButton: {
    width: 35,
    height: 35,
    backgroundColor: "#FFFFFF",
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    // Box shadow: 0px 4px 4px 0px #00000026 (bottom only)
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2D33",
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
