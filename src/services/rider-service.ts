import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IOrderQuery } from "@/types/globalTypes";
const PATHS = {
  riders: "/admin/riders",
  changeVisibility: "/admin/riders/change-status",
};

const RiderService = {
  create(data: FormData) {
    return HTTP.post(`${PATHS.riders}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  update(id: string, data: FormData) {
    return HTTP.post(`${PATHS.riders}/update/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAll(query?: string) {
    return HTTP.get(`${PATHS.riders}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getOrders(id: string | number, query?: IOrderQuery) {
    return HTTP.get(
      `${PATHS.riders}/${id}/orders${
        query?.currentPage ? `?page=${query?.currentPage}` : ""
      }`,
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },

  getBranchDetails(id: number) {
    return HTTP.get(`${PATHS.riders}/${id}`, {
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
    return HTTP.delete(`${PATHS.riders}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default RiderService;
