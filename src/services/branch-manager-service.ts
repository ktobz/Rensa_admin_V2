import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";

const PATHS = {
  branch: "/admin/partners",
  update: "/branch-managers/update",
  multipleDelete: "/branch-managers/multiple-delete",
  changeVisibility: "/branch-managers/change-status",
  updateMultiple: "/branch-managers/multiple-change-status",
};

const BranchManagerService = {
  create(data: FormData) {
    return HTTP.post(`${PATHS.branch}`, data, {
      headers: {
        Authorization: getToken(),
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update(id: number, data: FormData) {
    return HTTP.post(`${PATHS.update}/${id}`, data, {
      headers: {
        Authorization: getToken(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll(id: string, query?: string) {
    return HTTP.get(
      `${PATHS.branch}/${id}/branch-managers${query ? query : ""}`,
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },

  getBranchManagerDetails(id: number | string) {
    return HTTP.get(`${PATHS.branch}/${id}`, {
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

  multipleVisibilityUpdate(data: { id: number[]; availabilty: boolean }) {
    return HTTP.put(`${PATHS.updateMultiple}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  multipleDelete(data: { id: number[] }) {
    return HTTP.put(`${PATHS.multipleDelete}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  delete(id: number) {
    return HTTP.delete(`${PATHS.branch}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default BranchManagerService;
