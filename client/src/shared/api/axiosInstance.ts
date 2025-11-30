import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  sent?: boolean;
}

const { VITE_API, VITE_TARGET } = import.meta.env;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${VITE_TARGET}${VITE_API}`,
  withCredentials: true,
});

let accessToken = "";

export const setAccessToken = (token: string) => {
  accessToken = token;
};

axiosInstance.interceptors.request.use((config: ExtendedAxiosRequestConfig) => {
  if (config.headers && !config.headers.Authorization && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const prevRequest = error.config as ExtendedAxiosRequestConfig;
    if (error.response?.status === 403 && prevRequest && !prevRequest.sent) {
      try {
        const { data } = await axiosInstance.get("/auth/refresh");
        accessToken = data.accessToken;

        prevRequest.sent = true;
        if (prevRequest.headers) prevRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(prevRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
