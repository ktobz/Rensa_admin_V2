import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import {
  ICategoryDataResponse,
  IEntryResponse,
  IConditionResponse,
  ICondition,
  IAutomatedMessageResponse,
  INotificationDataResponse,
} from "@/types/globalTypes";
import { AxiosPromise } from "axios";
const PATHS = {
  all: "/pushnotification",
  notifications: "/admin/push",
  createNotification: "/admin/push/create-push-notification",
  category: "/admin/cataloguecategory",
  messages: "/admin/automatedmessages",
  conditions: "/admin/cataloguecondition",
  changeVisibility: "/admin/riders/change-status",
};

const NotificationService = {
  create(data: FormData) {
    return HTTP.post(`${PATHS.createNotification}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  update(id: string, data: FormData) {
    return HTTP.put(`${PATHS.notifications}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAll(query?: string): AxiosPromise<INotificationDataResponse> {
    return HTTP.get(`${PATHS.notifications}${query ? query : ""}`, {
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

  sendNotification(data: { message: string; title: string }) {
    return HTTP.post(`${PATHS.all}/admin/send-to-general`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  delete(id: string) {
    return HTTP.delete(`${PATHS.all}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getCategories(query?: string): AxiosPromise<ICategoryDataResponse> {
    return HTTP.get(`${PATHS.category}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  createCategory(data: FormData): AxiosPromise<IEntryResponse> {
    return HTTP.post(`${PATHS.category}`, data, {
      headers: {
        Authorization: getToken(),
        Accept: "multipart/form-data",
      },
    });
  },

  updateCategory(id: string, data: FormData): AxiosPromise<IEntryResponse> {
    return HTTP.put(`${PATHS.category}/${id}`, data, {
      headers: {
        Authorization: getToken(),
        Accept: "multipart/form-data",
      },
    });
  },

  deleteCategory(id: string): AxiosPromise<IEntryResponse> {
    return HTTP.delete(`${PATHS.category}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getConditions(query?: string): AxiosPromise<IConditionResponse> {
    return HTTP.get(`${PATHS.conditions}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  createConditions(data: ICondition): AxiosPromise<IEntryResponse> {
    return HTTP.post(`${PATHS.conditions}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  updateConditions(id: string, data: ICondition): AxiosPromise<IEntryResponse> {
    return HTTP.put(`${PATHS.conditions}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  deleteConditions(id: string): AxiosPromise<IEntryResponse> {
    return HTTP.delete(`${PATHS.conditions}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAutomatedMessages(
    query?: string
  ): AxiosPromise<IAutomatedMessageResponse> {
    return HTTP.get(`${PATHS.messages}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  createAutomatedMessage(data: ICondition): AxiosPromise<IEntryResponse> {
    return HTTP.post(`${PATHS.messages}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  updateAutomatedMessage(
    id: string,
    data: ICondition
  ): AxiosPromise<IEntryResponse> {
    return HTTP.put(`${PATHS.messages}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  deleteAutomatedMessage(id: string): AxiosPromise<IEntryResponse> {
    return HTTP.delete(`${PATHS.messages}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default NotificationService;
