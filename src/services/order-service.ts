import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import {
  IOrderQuery,
  IOrderResponse,
  IOrderStatsResponse,
  IOrderDetailsResponse,
  ICancelOrderProps,
  ICalendarOrderResponse,
  IRefundOrderPaymentProps,
} from "@/types/globalTypes";
import { AxiosPromise } from "axios";

const PATHS = {
  orders: "/admin/order",
  dashboardMetrics: "/orders/dashboard",
  assignRider: "/admin/orders",
  period: "/admin/periods",
  cancelOrder: "/admin/cancelledorder/cancel-order",
  confirmOrder: "/admin/order/confirm-order",
  refundPayment: "/admin/cancelledorder/confirm-order-cancellation",
};

const OrderService = {
  getAll(query?: string, signal?: AbortSignal): AxiosPromise<IOrderResponse> {
    return HTTP.get(
      `${PATHS.orders}${query ? `${query}` : ""}`,

      {
        headers: {
          Authorization: getToken(),
        },
        signal: signal || new AbortSignal(),
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

  getByMonthAndYear(query?: string): AxiosPromise<ICalendarOrderResponse> {
    return HTTP.get(
      `${PATHS.orders}/summary-by-month${query ? `${query}` : ""}`,

      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },
  getOrderDetails(id: number | string): AxiosPromise<IOrderDetailsResponse> {
    return HTTP.get(`${PATHS.orders}/id/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getOrderDetailsByTransactionRef(
    id: string
  ): AxiosPromise<IOrderDetailsResponse> {
    return HTTP.get(`${PATHS.orders}/transaction-reference/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  getOrderDetailsByOrderNumber(
    id: string
  ): AxiosPromise<IOrderDetailsResponse> {
    return HTTP.get(`${PATHS.orders}/order-number/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  confirmOrder(orderNumber: string): AxiosPromise<any> {
    return HTTP.put(
      `${PATHS.confirmOrder}/${orderNumber}`,
      {},
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },

  cancelOrder(data: ICancelOrderProps): AxiosPromise<any> {
    return HTTP.post(`${PATHS.cancelOrder}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  acceptRefund(data: IRefundOrderPaymentProps): AxiosPromise<any> {
    return HTTP.post(`${PATHS.refundPayment}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  rejectRefund(data: IRefundOrderPaymentProps): AxiosPromise<any> {
    return HTTP.post(`${PATHS.refundPayment}`, data, {
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
