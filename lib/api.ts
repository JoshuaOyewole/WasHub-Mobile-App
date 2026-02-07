import { AxiosRequestConfig } from "axios";
import { makeRequest } from "./request";

export type IUser = {
  userId: string;
  email: string;
  role: string;
  name?: string;
  phoneNumber?: string;
  profileImage?: string | null;
  dob?: string | null;
};

type ILoginResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data?: {
    user: IUser;
    token: string;
  };
  error?: string;
};

type IMeResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data?: {
    user: IUser;
  };
  error?: string;
};

type ISendOTPResponse = {
  status: boolean;
  emailSent: boolean;
  message: string;
};

type IVerifyOTPResponse = {
  status: boolean;
  statusCode: number;
  error: string;
  data: { verificationToken: string };
};

type IRegisterResponse = {
  status: boolean;
  statusCode: number;
  message: string;
};

type ICheckEmailResponse = {
  status: boolean;
  statusCode: number;
  data?: {
    exists: boolean;
    email: string;
  };
  message?: string;
};

type IForgotPasswordResponse = {
  status: boolean;
  statusCode: number;
  data?: {
    emailSent: boolean;
  };
  message?: string;
  error?: string;
};

type IResetPasswordResponse = {
  status: boolean;
  statusCode: number;
  message?: string;
  error?: string;
};

type IUpdateProfileResponse = {
  status: boolean;
  statusCode: number;
  message?: string;
  data?: {
    user: IUser;
  };
  error?: string;
};

type IDeleteAccountResponse = {
  status: boolean;
  statusCode: number;
  message?: string;
  error?: string;
};

type IUploadProfileImageResponse = {
  status: boolean;
  statusCode: number;
  message?: string;
  data?: {
    url: string;
    user: IUser;
  };
  error?: string;
};

type IChangePasswordResponse = {
  status: boolean;
  statusCode: number;
  message?: string;
  error?: string;
};
export type IOutlet = {
  _id: string;
  name: string;
  city: string;
  state: string;
  country?: string;
  address: string;
  image?: string;
  rating: number;
  email: string;
  isActive: boolean;
  activeWashes?: number;
  location: string;
  services?: string[];
  phoneNumber?: string;
  workingHours?: string;
  description?: string;
  pricing?: {
    quickWash: number;
    basic: number;
    premium: number;
  };
};
type IOutletsResponse = {
  status: boolean;
  statusCode: number;
  data?: IOutlet[];
  message?: string;
  error?: string;
};

type IOutletResponse = {
  status: boolean;
  statusCode: number;
  data?: IOutlet;
  message?: string;
  error?: string;
};

export const handleLogin = async (payload: {
  email: string;
  password: string;
}) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `auth/login`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as ILoginResponse;
};

export const fetchUserProfile = async () => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `auth/me`,
  };

  const response = await makeRequest(config);
  return response as IMeResponse;
};

export const sendOTP = async (payload: { email: string }) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `auth/send-otp`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as any;
};

export const verifyOTP = async (payload: { email: string; otp: string }) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `auth/verify-otp`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as IVerifyOTPResponse;
};

export const register = async (
  payload: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phoneNumber: string;
  },
  verificationToken: string,
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `auth/register`,
    data: payload,
    headers: {
      Authorization: `Bearer ${verificationToken}`,
    },
  };

  const response = await makeRequest(config);
  console.log("Register response:", response);
  return response as IRegisterResponse;
};

export const checkEmail = async (payload: { email: string }) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `auth/check-email`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as ICheckEmailResponse;
};

export const forgotPassword = async (payload: { email: string }) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `auth/forgot-password`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as IForgotPasswordResponse;
};

export const resetPassword = async (payload: {
  token: string;
  password: string;
}) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `auth/reset-password`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as IResetPasswordResponse;
};

export const updateUserProfile = async (payload: {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string | null;
  dob?: string | null;
}) => {
  const config: AxiosRequestConfig = {
    method: "PUT",
    url: `auth/profile`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as IUpdateProfileResponse;
};

export const deleteAccount = async (payload?: { reason?: string }) => {
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `auth/delete-account`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as IDeleteAccountResponse;
};

export const uploadProfileImage = async (imageUri: string) => {
  const formData = new FormData();
  const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
  const mimeType = `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`;

  formData.append("image", {
    uri: imageUri,
    type: mimeType,
    name: `profile_${Date.now()}.${fileExtension}`,
  } as any);

  const config: AxiosRequestConfig = {
    method: "POST",
    url: `auth/profile-image`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await makeRequest(config);
  return response as IUploadProfileImageResponse;
};

export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `auth/change-password`,
    data: payload,
  };

  const response = await makeRequest(config);
  return response as IChangePasswordResponse;
};

export const fetchOutlets = async () => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `outlets`,
  };

  const response = await makeRequest(config);
  return response as IOutletsResponse;
};

export const fetchOutletById = async (outletId: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `outlets/${outletId}`,
  };

  const response = await makeRequest(config);
  return response as IOutletResponse;
};

export default {
  handleLogin,
  fetchUserProfile,
  sendOTP,
  verifyOTP,
  register,
  checkEmail,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  deleteAccount,
  uploadProfileImage,
  changePassword,
  fetchOutlets,
  fetchOutletById,
};
