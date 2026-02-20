import { AxiosRequestConfig } from "axios";
import { makeRequest } from "../request";

interface InitiatePaymentResponse {
    status: boolean;
    message: string;
    data: {
        status: boolean,
        message: string,
        data: {
            authorization_url: string,
            access_code: string,
            reference: string
        }
    }
}

interface VerifyPaymentResponse {
    status: boolean;
    message?: string;
    error?: string;
    data?: {
        reference?: string;
        amount?: number;
        status?: string;
    };
}

export const initiatePayment = async (
    data: { email: string, amount: number }
): Promise<InitiatePaymentResponse | null> => {

    const config: AxiosRequestConfig = {
        method: "POST",
        url: `/transaction/initiate`,
        data: data,
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = (await makeRequest(config)) as InitiatePaymentResponse;

    if (!response.status) {
        throw new Error("Failed to initiate payment: " + response.message);
    }

    return response;
};

export const verifyPayment = async (
    reference: string
): Promise<VerifyPaymentResponse> => {
    const config: AxiosRequestConfig = {
        method: "GET",
        url: `/transaction/verify/${reference}`,
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = (await makeRequest(config)) as VerifyPaymentResponse;
    return response;
};


