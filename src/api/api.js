import { getAccessToken, removeAuthData } from "@/utils/tokenStorage";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.skipAuth) {
            console.log("[API] Skipping auth for:", config.url);
            return config;
        }

        const token = getAccessToken();

        if (!token) {
            console.log("[API] No access token found");
            return config;
        }
        config.headers = config.headers || {};

        if (token && typeof token === "string" && token.trim() !== "") {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (res) => {
        return res;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.warn("[API] Unauthorized");
            removeAuthData();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

const baseRequest = async ({
    url,
    method = "GET",
    body = null,
    params = null,
    skipAuth = false,
    contentType = "application/json",
}) => {
    const requestConfig = {
        method,
        url,
        data: body,
        params,
        skipAuth,
        headers: {},
    };

    if (body && contentType) {
        requestConfig.headers["Content-Type"] = contentType;
    }

    try {
        const response = await axiosInstance(requestConfig);

        return {
            data: response.data,
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText,
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                data: error.response.data,
                ok: false,
                status: error.response.status,
                statusText: error.response.statusText,
            };
        }

        if (axios.isAxiosError(error)) {
            return {
                data: null,
                ok: false,
                status: 0,
                statusText: error.message,
            };
        }

        throw error;
    }
};

export default axiosInstance;
