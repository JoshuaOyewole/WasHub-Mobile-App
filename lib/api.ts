import { AxiosRequestConfig } from "axios";
import { makeRequest } from "./request";

export type IUser = {
  userId: string;
  email: string;
  role: string;
  name?: string;
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

export default { handleLogin, fetchUserProfile };
