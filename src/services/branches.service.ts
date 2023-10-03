import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IBranchEntryProps } from "@/types/globalTypes";
const PATHS = {
  branch: "/admin/partners",
  changeVisibility: "/admin/branches/change-availability",
  multipleVisibility: "/admin/branches/multiple-bracnches/change-availability",
  inventory: "/admin/inventory",
};

const BranchService = {
  create(partnerId: string, data: IBranchEntryProps) {
    return HTTP.post(`${PATHS.branch}/${partnerId}/branches`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  update(partnerId: string, id: number, data: IBranchEntryProps) {
    return HTTP.put(`${PATHS.branch}/${partnerId}/branches/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAll(partnerId: string, query?: string) {
    return HTTP.get(
      `${PATHS.branch}/${partnerId}/branches${query ? query : ""}`,
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },

  getBranchDetails(partnerId: string, id: number) {
    return HTTP.get(`${PATHS.branch}/${partnerId}/branches/${id}`, {
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

  delete(partnerId: string, id: number) {
    return HTTP.delete(`${PATHS.branch}/${partnerId}/branches/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  changeBranchProductVisibility(id: number) {
    // return HTTP.put(
    //   `${PATHS.branchProductVisibility}/${id}/change-status`,
    //   {},
    //   {
    //     headers: {
    //       Authorization: getToken(),
    //     },
    //   }
    // );
  },
  multipleVisibilityUpdate(data: {
    branch_id: number[];
    availabilty: boolean;
  }) {
    return HTTP.put(`${PATHS.multipleVisibility}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  inventory(partnerId: string, data: { branchId: number; productCat: number }) {
    return HTTP.get(
      `${PATHS.inventory}/${data?.productCat}/branch/${data?.branchId}`,
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },
};

export default BranchService;
