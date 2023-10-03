import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IOrderQuery } from "@/types/globalTypes";

const PATHS = {
  orders: "/admin/orders",
  dashboardMetrics: "/orders/dashboard",
  assignRider: "/admin/orders",
  period: "/admin/periods",
};

const OrderService = {
  getAll(id?: string | number, query?: IOrderQuery) {
    return HTTP.post(
      `${PATHS.orders}/index${
        query?.currentPage ? `?page=${query?.currentPage}` : ""
      }`,
      {
        statuses: query?.status ? query?.status : [],
      },
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
