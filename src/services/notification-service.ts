import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IRiderEntryProps } from "@/types/globalTypes";
const PATHS = {
  all: "/admin/push-notifications",
  changeVisibility: "/admin/riders/change-status",
};

const NotificationService = {
  create(data: FormData) {
    return HTTP.post(`${PATHS.all}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  update(id: string, data: FormData) {
    return HTTP.put(`${PATHS.all}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAll(query?: string) {
    return HTTP.get(`${PATHS.all}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getNotification(id: number) {
    return HTTP.get(`${PATHS.all}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  sendNotification(id: number) {
    return HTTP.post(
      `${PATHS.all}/send/${id}`,
      {},
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },

  delete(id: string) {
    return HTTP.delete(`${PATHS.all}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default NotificationService;
