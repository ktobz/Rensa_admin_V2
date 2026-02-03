import HTTP from "./unAuthHttp";
import { getToken } from "utils/helper-funcs";

const PATH = "/admin/market-data";

const MarketDataService = {
  getUploadHistory(pageNumber = 1, pageSize = 10) {
    return HTTP.get(
      `${PATH}/upload-history?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },

  uploadAsync(file: File, mode: string) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("mode", mode);

    return HTTP.post(`${PATH}/upload-async`, fd, {
      headers: {
        Authorization: getToken(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getUploadStatus(id: string) {
    return HTTP.get(`${PATH}/upload-status/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  cancelUpload(id: string) {
    return HTTP.delete(`${PATH}/cancel-upload/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default MarketDataService;
