import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://127.0.0.1:9092";
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hook for HTTP requests
export const useHttp = <T>() => {
  const request = async (
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: T,
    config?: any,
  ) => {
    try {
      axiosInstance.interceptors.request.use((request) => {
        request.headers["Content-Type"] = "application/json";
        return request;
      });
      const response = await axiosInstance.request({
        method,
        url,
        data,
        ...config,
      });
      return { ...response.data, status: response.status };
    } catch (error: any) {
      console.error("HTTP Request Error:", error);
      throw error.response?.data || error.message;
    }
  };

  return { request };
};

export default axiosInstance;
