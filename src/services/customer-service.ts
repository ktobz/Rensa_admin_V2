import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IOrderQuery, IUsersResponse } from "@/types/globalTypes";
import { AxiosPromise } from "axios";

const PATHS = {
  customers: "/admin/users",
};

const CustomerService = {
  getAll(query?: string): AxiosPromise<IUsersResponse> {
    return HTTP.get(`${PATHS.customers}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getCustomerOrders(id: number | string, query?: IOrderQuery) {
    return HTTP.get(
      `${PATHS.customers}/${id}/orders${
        query?.currentPage ? `?page=${query?.currentPage}` : ""
      }`,
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },

  getCustomerDetails(id: number | string) {
    return HTTP.get(`${PATHS.customers}/${id}`, {
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
