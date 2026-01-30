import { makeRequest } from "@/lib/request";
import { AxiosRequestConfig } from "axios";

type IUser = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export const loginUser = async (body: { email: string; password: string }) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: "auth/login",
    data: body,
  };

  const response = await makeRequest<IUser>(config);

  return response;
};

export const resetPassword = async (body: { email: string }) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: "auth/reset-password",
    data: body,
  };

  const response = await makeRequest(config);

  return response;
};

export const verifyUserEmail = async (body: { email: string }) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: "auth/verify-user-email",
    data: body,
  };

  const response = await makeRequest(config);

  return response;
};

export const sendOtp = async (body: { email: string }) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: "auth/send-otp",
    data: body,
  };

  const response = await makeRequest(config);

  return response;
};

export const verifyOtp = async (payload: { email: string; otp: string }) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: "auth/verify-otp",
    data: payload,
  };

  const response = await makeRequest(config);

  return response;
};
export const createUser = async (payload: IUser) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: "auth/register",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await makeRequest<{ token: string }>(config);

  return response;
};
