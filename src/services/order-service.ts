import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import {
  IOrderQuery,
  IOrderResponse,
  IOrderStatsResponse,
} from "@/types/globalTypes";
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

  getByDate({
    day,
    month,
    year,
  }: {
    month: number;
    day: number;
    year: number;
  }) {
    return function (query?: string): AxiosPromise<IOrderResponse> {
      return HTTP.get(
        `${PATHS.orders}/get-orders-by-date/${year}/${month}/${day}${
          query ? `${query}` : ""
        }`,
        {
          headers: {
            Authorization: getToken(),
          },
        }
      );
    };
  },

  getByMonthAndYear(query?: string): AxiosPromise<IOrderResponse> {
    return HTTP.get(
      `${PATHS.orders}/summary-by-month${query ? `${query}` : ""}`,

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
  getTotals(): AxiosPromise<IOrderStatsResponse> {
    return HTTP.get(`${PATHS.orders}/summary`, {
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
