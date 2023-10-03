import APP_VARS from "@/utils/env";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "utils/helper-funcs";
const URL = APP_VARS.baseApi;

const instance = axios.create({
  baseURL: URL,
  headers: {
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig<any>) => {
    const token = getToken();
    if (token) {
      if (config.headers) {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
