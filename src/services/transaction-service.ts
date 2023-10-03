import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";

const PATHS = {
  transactions: "/admin/transactions/index",
  dashboardMetrics: "/orders/dashboard",
  userTransactions: "/admin/transactions/customers",
};

const TransactionService = {
  getAll(query?: string, customerId?: string) {
    return HTTP.post(
      `${
        customerId
          ? `${PATHS.userTransactions}/${customerId}`
          : PATHS.transactions
      }${query ? query : ""}`,
      {
        statuses: [],
      },
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
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
