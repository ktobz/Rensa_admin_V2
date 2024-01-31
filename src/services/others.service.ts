import { getToken } from "utils/helper-funcs";
import HTTP from "./unAuthHttp";
import { AxiosPromise } from "axios";
import { ILookups } from "@/types/globalTypes";
const PATHS = {
  period: "/admin/periods",
  status: "/admin/statuses",
  lookup: "/admin/lookups/enums",
};

const OtherService = {
  getPeriods() {
    return HTTP.get(`${PATHS.period}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getStatuses() {
    return HTTP.get(`${PATHS.status}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  getLookup(): AxiosPromise<{ result: ILookups }> {
    return HTTP.get(`${PATHS.lookup}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default OtherService;
