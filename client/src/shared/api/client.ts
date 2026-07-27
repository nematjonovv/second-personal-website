import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "./types";
import { clearToken, getToken } from "./token";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const http = axios.create({ baseURL: API_BASE_URL });

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<null>>) => {
    if (error.response?.status === 401) {
      clearToken();
    }

    const message =
      error.response?.data?.message ??
      (error.code === "ERR_NETWORK" ? "Serverga ulanib bo'lmadi" : error.message);

    return Promise.reject(new ApiError(message, error.response?.status));
  },
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    http.get<ApiResponse<T>>(url, config).then((response) => response.data.data),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    http.post<ApiResponse<T>>(url, body, config).then((response) => response.data.data),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    http.patch<ApiResponse<T>>(url, body, config).then((response) => response.data.data),

  delete: <T = null>(url: string, config?: AxiosRequestConfig) =>
    http.delete<ApiResponse<T>>(url, config).then((response) => response.data.data),
};
