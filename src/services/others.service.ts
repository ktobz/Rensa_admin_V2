import { getToken } from "utils/helper-funcs";
import HTTP from "./unAuthHttp";
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
  getLookup() {
    return HTTP.get(`${PATHS.lookup}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default OtherService;
