import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import {
  IPartnerEntryProps,
  IPartnerStatsQuery,
  IOrderQuery,
} from "@/types/globalTypes";
const PATHS = {
  partners: "/admin/partners",
  metric: "/admin/dashboards/partner",
  changeVisibility: "/branches/change-visibility",
};

const PartnerService = {
  create(data: IPartnerEntryProps) {
    return HTTP.post(`${PATHS.partners}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  update(id: string, data: IPartnerEntryProps) {
    return HTTP.put(`${PATHS.partners}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAll(query: string) {
    return HTTP.get(`${PATHS.partners}${query}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getOne(id: string) {
    return HTTP.get(`${PATHS.partners}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getBranchDetails(id: number) {
    return HTTP.get(`${PATHS.partners}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  changeVisibility(id: number) {
    return HTTP.put(`${PATHS.changeVisibility}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  delete(id: string) {
    return HTTP.delete(`${PATHS.partners}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getMetrics(id: string, query: IPartnerStatsQuery) {
    return HTTP.post(`${PATHS.metric}/${id}`, query, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  branchManagers(partnerId: string) {
    return HTTP.get(`${PATHS.partners}/${partnerId}/branch-managers`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  branch(partnerId: string) {
    return HTTP.get(`${PATHS.partners}/${partnerId}/branches`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  orders(partnerId: string, query: IOrderQuery) {
    return HTTP.post(
      `${PATHS.partners}/${partnerId}/orders/index${
        query?.currentPage ? `?page=${query?.currentPage}` : ""
      }`,
      {
        statuses: query?.status || [],
      },
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },
};

export default PartnerService;
