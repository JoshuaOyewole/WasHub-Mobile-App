import { AxiosRequestConfig } from "axios";
import { makeRequest } from "../request";

export type WashRequestStatus =
  | "scheduled"
  | "order_received"
  | "vehicle_checked"
  | "in_progress"
  | "drying_finishing"
  | "ready_for_pickup"
  | "completed"
  | "cancelled";

export type StatusTimelineItem = {
  status: string;
  timestamp: string;
  updatedBy: "user" | "outlet" | "system";
};

export type WashRequest = {
  _id: string;
  userId: string;
  vehicleId: string;
  serviceType: "quick wash" | "premium wash" | "full wash";
  outletId: string;
  outletName: string;
  outletLocation: string;
  status: WashRequestStatus;
  washCode: string;
  currentStep: number;
  steps: string[];
  statusTimeline: StatusTimelineItem[];
  vehicleInfo: {
    vehicleType: string;
    vehicleMake: string;
    licensePlate: string;
    vehicleModel: string;
    vehicleColor: string;
    image?: string;
  };
  price: number;
  paymentStatus: "paid" | "pending";
  completedAt?: string;
  cancelledAt?: string;
  notes?: string;
  userRating?: number | null;
  userReview?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WashRequestsResponse = {
  data: WashRequest[];
  status: boolean;
  statusCode: number;
  message?: string;
  meta?: {
    total: number;
    pending: number;
    ongoing: number;
    completed: number;
  };
};

export type WashRequestResponse = {
  data: WashRequest;
  status: boolean;
  statusCode: number;
  message?: string;
  error?: string;
};

/**
 * Fetch all wash requests for the authenticated user
 * @param status - Optional status filter (pending, ongoing, completed)
 * @returns Promise with wash requests response
 */
export const fetchWashRequests = async (status?: WashRequestStatus) => {
  const queryParam = status ? `?status=${status}` : "";

  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/wash-requests${queryParam}`,
  };

  const response = await makeRequest(config);
  return response as WashRequestsResponse;
};

/**
 * Fetch a single wash request by ID
 * @param id - Wash request ID
 * @returns Promise with wash request response
 */
export const fetchWashRequestById = async (id: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/wash-requests/${id}`,
  };

  const response = await makeRequest(config);
  return response as WashRequestResponse;
};

/**
 * Create a new wash request
 * @param payload - Wash request data
 * @returns Promise with created wash request
 */
export const createWashRequest = async (payload: {
  vehicleId: string;
  serviceType: string;
  outletId: string;
  outletName: string;
  outletLocation: string;
  price: number;
  paymentStatus?: string;
  notes?: string;
}) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/wash-requests`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as WashRequestResponse;
};

/**
 * Update wash request status (for outlets/admins)
 * @param id - Wash request ID
 * @param status - New status (pending -> ongoing -> completed)
 * @returns Promise with updated wash request
 */
export const updateWashRequestStatus = async (
  id: string,
  status: WashRequestStatus,
) => {
  const config: AxiosRequestConfig = {
    method: "PATCH",
    url: `/wash-requests/${id}/status`,
    data: { status },
  };

  const response = await makeRequest(config);
  return response as WashRequestResponse;
};

/**
 * Update wash request
 * @param id - Wash request ID
 * @param payload - Data to update
 * @returns Promise with updated wash request
 */
export const updateWashRequest = async (
  id: string,
  payload: Partial<WashRequest>,
) => {
  const config: AxiosRequestConfig = {
    method: "PATCH",
    url: `/wash-requests/${id}`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as WashRequestResponse;
};

/**
 * Delete/Cancel a wash request
 * @param id - Wash request ID
 * @returns Promise with deleted wash request
 */
export const deleteWashRequest = async (id: string) => {
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `/wash-requests/${id}`,
  };

  const response = await makeRequest(config);
  return response as WashRequestResponse;
};

/**
 * Submit a review for a completed wash
 * @param id - Wash request ID
 * @param rating - Rating from 1-5
 * @param review - Optional review text
 * @returns Promise with updated wash request
 */
export const submitWashReview = async (
  id: string,
  rating: number,
  review?: string,
) => {
  const config: AxiosRequestConfig = {
    method: "PATCH",
    url: `/wash-requests/${id}/review`,
    data: { rating, review },
  };

  const response = await makeRequest(config);
  return response as WashRequestResponse;
};
