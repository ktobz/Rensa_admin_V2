import {
  IAddListingResponse,
  IListingDetailsResponse,
  IListingResponse,
  IListingStatsResponse,
  IReportedListingCommentsResponse,
  IReportedListingResponse
} from "@/types/globalTypes";
import { AxiosPromise } from "axios";
import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";

const PATHS = {
  orders: "/admin/catalogue",
  isFeatured: "/admin/catalogue/toggle-isfeatured",
  dashboardMetrics: "/orders/dashboard",
  period: "/admin/periods",
  listing: "/admin/reportedlisting/reported-listing",
  listingComments: "/admin/reportedlisting",
};

const ListingService = {
  getAll(query?: string, signal?: AbortSignal): AxiosPromise<IListingResponse> {
    return HTTP.get(
      `${PATHS.orders}${query ? `${query}` : ""}`,

      {
        headers: {
          Authorization: getToken(),
        },
        signal,
      }
    );
  },

  create(data: FormData): AxiosPromise<IAddListingResponse> {
    return HTTP.post(`${PATHS.orders}`, data, {
      headers: {
        Authorization: getToken(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update(id:string,data: FormData): AxiosPromise<IAddListingResponse> {
    return HTTP.put(`${PATHS.orders}/${id}`, data, {
      headers: {
        Authorization: getToken(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getDetails(id: number | string): AxiosPromise<IListingDetailsResponse> {
    return HTTP.get(`${PATHS.orders}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  toggleIsFeatured(id: number | string): AxiosPromise<IListingDetailsResponse> {
    return HTTP.put(`${PATHS.isFeatured}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAllReportedListing(
    query?: string,
    signal?: AbortSignal
  ): AxiosPromise<IReportedListingResponse> {
    return HTTP.get(
      `${PATHS.listing}${query ? `${query}` : ""}`,

      {
        headers: {
          Authorization: getToken(),
        },
        signal,
      }
    );
  },
  getUserListing(id: string) {
    return function (query?: string): AxiosPromise<IListingResponse> {
      return HTTP.get(`${PATHS.orders}/user/${id}${query ? `${query}` : ""}`, {
        headers: {
          Authorization: getToken(),
        },
      });
    };
  },
  getListingReportComments(
    id: string,
    query?: string
  ): AxiosPromise<IReportedListingCommentsResponse> {
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

  closeListing(id: number | string): AxiosPromise<IListingDetailsResponse> {
    return HTTP.put(`${PATHS.orders}/close/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getTotals(): AxiosPromise<IListingStatsResponse> {
    return HTTP.get(`${PATHS.orders}/summary`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default ListingService;
