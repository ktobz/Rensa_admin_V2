import { IAppReleaseData, IAppReleaseResponse } from "@/types/globalTypes";
import { AxiosPromise } from "axios";
import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
const PATHS = {
  all: "/admin/appreleases",
};

const AppReleaseService = {
  create(data: FormData) {
    return HTTP.post(`${PATHS.all}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  update(id: string, data: FormData) {
    return HTTP.put(`${PATHS.all}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAll(query?: string): AxiosPromise<IAppReleaseResponse> {
    return HTTP.get(`${PATHS.all}${query ? query : ""}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  delete(id: string) {
    return HTTP.delete(`${PATHS.all}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  updateActiveStatus(id: string, data: IAppReleaseData) {
    return HTTP.put(`${PATHS.all}/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default AppReleaseService;
