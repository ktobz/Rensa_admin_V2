import { ILookups, IOTPLogResponse } from "@/types/globalTypes";
import { AxiosPromise } from "axios";
import { getToken } from "utils/helper-funcs";
import HTTP from "./unAuthHttp";
const PATHS = {
  period: "/admin/periods",
  status: "/admin/statuses",
  lookup: "/lookups/enums",
  otpLog: "/admin/smslogs",
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
  otpLog(query?: string): AxiosPromise<IOTPLogResponse> {
    return HTTP.get(`${PATHS.otpLog}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

};

export default OtherService;
