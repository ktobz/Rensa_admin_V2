import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IOrderQuery, IOrderResponse } from "@/types/globalTypes";
import { AxiosPromise } from "axios";

const PATHS = {
  getSales: "/admin/dashboard/get-sales",
  marketplace: "/admin/dashboard/get-marketplace",
  users: "/admin/dashboard/get-users",
  revenue: "/admin/dashboard/get-revenue",
  orders: "/admin/dashboard/get-orders",
  recentOrders: "/admin/dashboard/recent-orders",
};

const DashboardService = {
  getSales(data: { filter: number }) {
    return HTTP.get(`${PATHS.getSales}`, {
      headers: {
        Authorization: getToken(),
      },
      params: data,
    });
  },

  getMarketplace(data: { filter: number }) {
    return HTTP.get(`${PATHS.marketplace}`, {
      headers: {
        Authorization: getToken(),
      },
      params: data,
    });
  },

  users(data: { filter: number }) {
    return HTTP.get(`${PATHS.users}`, {
      headers: {
        Authorization: getToken(),
      },
      params: data,
    });
  },

  revenue(data: { filter: number }) {
    return HTTP.get(`${PATHS.revenue}`, {
      headers: {
        Authorization: getToken(),
      },
      params: data,
    });
  },

  orders(data: { filter: number }) {
    return HTTP.get(`${PATHS.orders}`, {
      headers: {
        Authorization: getToken(),
      },
      params: data,
    });
  },

  recentOrders(data: { filter: number }) {
    return HTTP.get(`${PATHS.recentOrders}`, {
      headers: {
        Authorization: getToken(),
      },
      params: data,
    });
  },
};

export default DashboardService;
