import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { AxiosPromise } from "axios";
import { ITransactionsResponse, ISalesResponse } from "@/types/globalTypes";

const PATHS = {
  transactions: "/admin/transaction",
  dashboardMetrics: "/orders/dashboard",
  sales: "/admin/sales",
  userTransactions: "/admin/transactions/customers",
};

const TransactionService = {
  getAll(query?: string): AxiosPromise<ITransactionsResponse> {
    return HTTP.get(`${PATHS.transactions}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  getAllSales(query?: string): AxiosPromise<ISalesResponse> {
    return HTTP.get(`${PATHS.sales}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
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
};

export default TransactionService;
