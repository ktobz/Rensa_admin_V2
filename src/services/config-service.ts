import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IServiceFeeReq, IDeliverySettingsReq } from "@/types/globalTypes";
const PATHS = {
  all: "/admin/faqs",
  service: "/admin/service-fees",
  delivery: "/admin/delivery-settings",
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

  getServiceFeeSettings() {
    return HTTP.get(`${PATHS.service}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  getDeliveryFeeSettings() {
    return HTTP.get(`${PATHS.delivery}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  setServiceFeeSettings(data: IServiceFeeReq) {
    return HTTP.post(`${PATHS.service}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  setDeliveryFeeSettings(data: IDeliverySettingsReq) {
    return HTTP.post(`${PATHS.delivery}`, data, {
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
