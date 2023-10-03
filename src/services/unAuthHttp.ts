import axios from "axios";
import APP_VARS from "@/utils/env";

const URL = APP_VARS.baseApi;

const unAuthHTTP = axios.create({
  baseURL: URL,
  headers: {
    Accept: "application/json",
  },
});

export default unAuthHTTP;
