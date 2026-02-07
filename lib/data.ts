// Mock data for multiple statuses

import { WashRequest } from "@/app/(tabs)/request";
import { Car } from "@/components/ui/car-card";

const statusData = [
  {
    id: "1",
    serviceName: "Basic Car Wash",
    vehicleInfo: "Toyota - LX207AF2",
    currentStep: 1,
    steps: ["Received", "Washing", "Finishing", "Ready"],
  },
  {
    id: "2",
    serviceName: "Premium Detail",
    vehicleInfo: "Honda - ABC123",
    currentStep: 2,
    steps: ["Received", "Washing", "Finishing", "Ready"],
  },
  {
    id: "3",
    serviceName: "Full Service",
    vehicleInfo: "Mercedes - XYZ789",
    currentStep: 3,
    steps: ["Received", "Washing", "Finishing", "Ready"],
  },
];

// Mock data for outlets
const outletsData = [
  {
    id: "1",
    name: "Eko Car Wash",
    location: "Lekki phase 1, lagos",
    info: "3 cars being washed now",
    rating: 4,
    image: require("@/assets/images/eko_car_wash_otlet.png"),
  },
  {
    id: "2",
    name: "Levels Car Wash",
    location: "Lekki phase 1, lagos",
    info: "5 minutes away",
    rating: 3,
    image: require("@/assets/images/levels_car_wash_outlet.png"),
  },
];

// Mock data - replace with actual data from your backend/state management
const MOCK_CARS: Car[] = [
  {
    id: "1",
    image: require("@/assets/images/eko_car_wash_otlet.png"),
    brand: "Toyota",
    model: "Prado",
    licensePlate: "LX207AF2",
    washProgress: 75,
    isSelected: false,
  },
  {
    id: "2",
    image: require("@/assets/images/eko_car_wash_otlet.png"),
    brand: "Toyota",
    model: "Prado",
    licensePlate: "LX207AF2",
    washProgress: 45,
    isSelected: false,
  },
  {
    id: "3",
    image: require("@/assets/images/eko_car_wash_otlet.png"),
    brand: "Toyota",
    model: "Prado",
    licensePlate: "LX207AF2",
    washProgress: 90,
    isSelected: false,
  },
];
// Mock data for demonstration
const MOCK_WASH_REQUESTS: WashRequest[] = [
  {
    id: "1",
    title: "Eko car wash - Basic Wash",
    date: "12th Sep, 2025. 10:14 - Ajah Lekki",
    location: "Ajah Lekki",
    status: "pending",
  },
];
export { MOCK_CARS, MOCK_WASH_REQUESTS, outletsData, statusData };

