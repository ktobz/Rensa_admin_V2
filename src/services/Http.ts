import { useUserStore } from "@/config/store-config/store.config";
import APP_VARS from "@/utils/env";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "utils/helper-funcs";
const userStore = useUserStore.getState();
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

instance.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    return res;
  },
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      userStore.setIsAuthorized(false);
    }

    return Promise.reject(error);
  }
);

export default instance;
