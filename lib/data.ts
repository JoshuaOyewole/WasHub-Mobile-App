// Mock data for multiple statuses

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

export { outletsData, statusData };

