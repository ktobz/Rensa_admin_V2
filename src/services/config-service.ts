import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import {
  IServiceFeeReq,
  IDeliverySettingsReq,
  IDeliverySettingsResponse,
  IServiceFeeResponse,
  IPayoutDataResponse,
  IPayoutData,
  ITermiiResponse,
} from "@/types/globalTypes";
import { AxiosPromise } from "axios";
const PATHS = {
  all: "/admin/faqs",
  service: "/admin/configuration/service-fee",
  delivery: "/admin/configuration/delivery-fee",
  payout: "/admin/configuration/payout",
  balance: "/admin/termii/balance",
};

const ConfigService = {
  createFAQ(data: any) {
    return HTTP.post(`${PATHS.all}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  updateFAQ(id: string, data: any) {
    return HTTP.put(`${PATHS.all}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAllFAQs(query?: string) {
    return HTTP.get(`${PATHS.all}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getServiceFeeSettings(): AxiosPromise<IServiceFeeResponse> {
    return HTTP.get(`${PATHS.service}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getTermiBalance(): AxiosPromise<ITermiiResponse> {
    return HTTP.get(`${PATHS.balance}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  getDeliveryFeeSettings(): AxiosPromise<IDeliverySettingsResponse> {
    return HTTP.get(`${PATHS.delivery}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  getPayoutSettings(): AxiosPromise<IPayoutDataResponse> {
    return HTTP.get(`${PATHS.payout}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  setPayoutSettings(id: number, data: IPayoutData) {
    return HTTP.put(`${PATHS.payout}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  setServiceFeeSettings(id: number, data: IServiceFeeReq) {
    return HTTP.put(`${PATHS.service}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  setDeliveryFeeSettings(id: number, data: IDeliverySettingsReq) {
    return HTTP.put(`${PATHS.delivery}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  deleteFAQ(id: string) {
    return HTTP.delete(`${PATHS.all}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default ConfigService;
