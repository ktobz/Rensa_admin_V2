import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IOrderQuery, IOrderResponse } from "@/types/globalTypes";
import { AxiosPromise } from "axios";

const PATHS = {
  orders: "/admin/order",
  dashboardMetrics: "/orders/dashboard",
  assignRider: "/admin/orders",
  period: "/admin/periods",
};

const OrderService = {
  getAll(query?: string): AxiosPromise<IOrderResponse> {
    return HTTP.get(
      `${PATHS.orders}${query ? `${query}` : ""}`,

      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },

  getOrderDetails(id: number | string) {
    return HTTP.get(`${PATHS.orders}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  assignRider(id: number | string, data: any) {
    return HTTP.put(`${PATHS.orders}/${id}/assign-rider`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  getTotals() {
    return HTTP.get(`${PATHS.orders}/total`, {
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

  getPeriods() {
    return HTTP.get(`${PATHS.period}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default OrderService;
