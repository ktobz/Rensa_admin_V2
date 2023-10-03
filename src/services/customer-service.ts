import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IOrderQuery } from "@/types/globalTypes";

const PATHS = {
  customers: "/admin/customers",
  dashboardMetrics: "/orders/dashboard",
};

const CustomerService = {
  getAll(query?: string) {
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

  getCustomerBalance(id: number | string) {
    return HTTP.get(`${PATHS.customers}/${id}/wallets`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  dashboardMetrics(data: {
    totat_sales_period: string;
    totat_order_period: string;
    top_selling_branch: string;
  }) {
    return HTTP.post(`${PATHS.dashboardMetrics}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default CustomerService;
