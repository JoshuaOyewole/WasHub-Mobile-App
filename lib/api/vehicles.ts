import { AxiosRequestConfig } from "axios";
import { makeRequest } from "../request";

export type Vehicle = {
  _id: string;
  userId: string;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor?: string;
  plateNumber: string;
  image?: string;
  inWishlist: boolean;
  wishlistAddedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type VehiclesResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: Vehicle[];
};

type VehicleResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: Vehicle;
  error: string;
};

export const fetchVehicles = async (inWishlist?: boolean) => {
  const queryParam =
    inWishlist !== undefined ? `?inWishlist=${inWishlist}` : "";

  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/vehicles${queryParam}`,
  };

  const response = await makeRequest(config);
  return response as VehiclesResponse;
};

export const fetchVehicleById = async (id: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/vehicles/${id}`,
  };

  const response = await makeRequest(config);
  return response as VehicleResponse;
};

export const createVehicle = async (payload: {
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor?: string;
  plateNumber: string;
  image?: string;
}) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/vehicles`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as VehicleResponse;
};

export const updateVehicle = async (id: string, payload: Partial<Vehicle>) => {
  const config: AxiosRequestConfig = {
    method: "PATCH",
    url: `/vehicles/${id}`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as VehicleResponse;
};

export const deleteVehicle = async (id: string) => {
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `/vehicles/${id}`,
  };

  const response = await makeRequest(config);
  return response as VehicleResponse;
};

export const addVehicleToWash = async (id: string) => {
  const config: AxiosRequestConfig = {
    method: "PATCH",
    url: `/vehicles/${id}/add-to-wash`,
  };

  const response = await makeRequest(config);
  return response as VehicleResponse;
};

export const removeVehicleFromWash = async (id: string) => {
  const config: AxiosRequestConfig = {
    method: "PATCH",
    url: `/vehicles/${id}/remove-from-wash`,
  };

  const response = await makeRequest(config);
  return response as VehicleResponse;
};

export const uploadVehicleImage = async (
  imageUri: string,
  oldImageUrl?: string,
): Promise<string> => {
  const formData = new FormData();
  const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
  const mimeType = `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`;

  formData.append("image", {
    uri: imageUri,
    type: mimeType,
    name: `vehicle_${Date.now()}.${fileExtension}`,
  } as any);

  if (oldImageUrl) {
    formData.append("oldImageUrl", oldImageUrl);
  }

  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/vehicles/upload-image`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = (await makeRequest(config)) as {
    status: boolean;
    data: { imageUrl: string };
    message: string;
  };

  if (!response.status) {
    throw new Error("Failed to upload vehicle image");
  }

  return response.data.imageUrl;
};
