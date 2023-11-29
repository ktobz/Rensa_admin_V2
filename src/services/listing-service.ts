import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import {
  IOrderQuery,
  IListingResponse,
  IListingDetailsResponse,
  IReportedListingResponse,
} from "@/types/globalTypes";
import { AxiosPromise } from "axios";

const PATHS = {
  orders: "/admin/catalogue",
  dashboardMetrics: "/orders/dashboard",
  period: "/admin/periods",
  listing: "/admin/reportedlisting/reported-listing",
  listingComments: "/admin/reportedlisting",
};

const ListingService = {
  getAll(query?: string): AxiosPromise<IListingResponse> {
    return HTTP.get(
      `${PATHS.orders}${query ? `${query}` : ""}`,

      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },

  getDetails(id: number | string): AxiosPromise<IListingDetailsResponse> {
    return HTTP.get(`${PATHS.orders}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAllReportedListing(
    query?: string
  ): AxiosPromise<IReportedListingResponse> {
    return HTTP.get(
      `${PATHS.listing}${query ? `${query}` : ""}`,

      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },
  getListingReportComments(
    id: string,
    query?: string
  ): AxiosPromise<IReportedListingResponse> {
    return HTTP.get(
      `${PATHS.listingComments}/${id}${query ? `${query}` : ""}`,
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },
  getReportedListingDetails(
    id: number | string
  ): AxiosPromise<IListingDetailsResponse> {
    return HTTP.get(`${PATHS.listing}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default ListingService;
