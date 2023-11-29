import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IUserDetailResponse, IUsersResponse } from "@/types/globalTypes";
import { AxiosPromise } from "axios";

const PATHS = {
  customers: "/admin/users",
  findUser: "/admin/find-user",
  userOrders: "/admin/order",
};

const CustomerService = {
  getAll(query?: string): AxiosPromise<IUsersResponse> {
    return HTTP.get(`${PATHS.customers}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getCustomerOrders(id: number | string) {
    return function (query?: string) {
      return HTTP.get(`${PATHS.userOrders}/${id}${query ? query : ""}`, {
        headers: {
          Authorization: getToken(),
        },
      });
    };
  },

  getCustomerDetails(id: number | string): AxiosPromise<IUserDetailResponse> {
    return HTTP.get(`${PATHS.findUser}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getCustomerProducts(id: number | string) {
    return HTTP.get(`${PATHS.customers}/${id}/products`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  blockUser(id: number | string) {
    return HTTP.put(`${PATHS.customers}/blockuser/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  unblockUser(id: number | string) {
    return HTTP.put(`${PATHS.customers}/unblockuser/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getCustomerTransactions(id: number | string) {
    return HTTP.get(`${PATHS.customers}/${id}/transactions`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default CustomerService;
