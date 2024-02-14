import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { AxiosPromise } from "axios";
import {
  ITransactionsResponse,
  ISalesResponse,
  IPayoutResponse,
} from "@/types/globalTypes";

const PATHS = {
  transactions: "/admin/transaction",
  payout: "/admin/payout",
  dashboardMetrics: "/orders/dashboard",
  sales: "/admin/sales",
  userTransactions: "/admin/transactions/customers",
};

const TransactionService = {
  getAll(
    query?: string,
    signal?: AbortSignal
  ): AxiosPromise<ITransactionsResponse> {
    return HTTP.get(`${PATHS.transactions}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
      signal,
    });
  },

  getAllPayouts(
    query?: string,
    signal?: AbortSignal
  ): AxiosPromise<IPayoutResponse> {
    return HTTP.get(`${PATHS.payout}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
      signal,
    });
  },

  getAllSales(
    query?: string,
    signal?: AbortSignal
  ): AxiosPromise<ISalesResponse> {
    return HTTP.get(`${PATHS.sales}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
      signal,
    });
  },

  getUserTransactions(id: string) {
    return function (query?: string): AxiosPromise<ITransactionsResponse> {
      return HTTP.get(`${PATHS.transactions}/${id}${query ? query : ""}`, {
        headers: {
          Authorization: getToken(),
        },
      });
    };
  },

  getOrderDetails(id: number | string) {
    return HTTP.get(`${PATHS.transactions}/${id}`, {
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

  salesCount(data: { filter: number }) {
    return HTTP.get(`${PATHS.sales}/count`, {
      headers: {
        Authorization: getToken(),
      },
      params: data,
    });
  },
  salesRevenue(data: { filter: number }) {
    return HTTP.get(`${PATHS.sales}/revenue`, {
      headers: {
        Authorization: getToken(),
      },
      params: data,
    });
  },
  salesAmount(data: { filter: number }) {
    return HTTP.get(`${PATHS.sales}/amount`, {
      headers: {
        Authorization: getToken(),
      },
      params: data,
    });
  },

  verifyTransaction(id: string) {
    return HTTP.get(`${PATHS.transactions}/verify/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  retryTransaction(id: string) {
    return HTTP.get(`${PATHS.transactions}/retry/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  verifyPayout(id: string) {
    return HTTP.get(`${PATHS.payout}/verify/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default TransactionService;
