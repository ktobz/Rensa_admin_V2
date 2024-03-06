import { AxiosPromise, AxiosRequestConfig } from "axios";

import {
  ILoginReq,
  ISignupReq,
  ICreatePasswordProp,
  IChangePasswordProp,
  IBankConfirmProps,
  IPayoutAccountProps,
  ILoginResponse,
  IBanksResponse,
} from "types/globalTypes";

import { getToken } from "utils/helper-funcs";
import HTTP from "./unAuthHttp";
const PATHS = {
  // login: "/login",
  login: "/token/login",
  logout: "/token/logout",
  sendOTP: "/send-otp",
  verifyOTP: "/verify-otp",
  banks: "/admin/bank",
  updateBankStatus: "/admin/bank/toggle-active",
  confirmBankAccount: "/admin/bank/resolve-name",
  signup: "/signup",
  setPassword: "/change-password",
  changePassword: "/change-password",
  updateImage: "/profiles/update-image",
  payoutAccount: "/admin/partners",
  createPassword: "/create-password",
};

const AuthService = {
  signUp(data: ISignupReq) {
    return HTTP.post(PATHS.signup, data);
  },
  login(data: ILoginReq): AxiosPromise<ILoginResponse> {
    return HTTP.post(PATHS.login, data);
  },

  setNewPassword(data: {
    password: string;
    password_confirmation: string;
    email: string;
  }) {
    return HTTP.post(`${PATHS.setPassword}`, data);
  },
  changePassword(data: IChangePasswordProp) {
    return HTTP.post(`${PATHS.setPassword}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  createPassword(data: ICreatePasswordProp) {
    return HTTP.post(`${PATHS.createPassword}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  allBanks(query: string): AxiosPromise<IBanksResponse> {
    return HTTP.get(`${PATHS.banks}${query}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  updateBankStatus(id: string) {
    return HTTP.put(`${PATHS.updateBankStatus}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  confirmBankAccount(data: IBankConfirmProps) {
    return HTTP.get(
      `${PATHS.confirmBankAccount}?accountnumber=${data?.accountnumber}&internalcode=${data?.internalcode}`,
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },
  setPayoutAccount(data: IPayoutAccountProps) {
    return HTTP.post(PATHS.payoutAccount, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  payoutAccount(partnerId: string) {
    return HTTP.get(`${PATHS.payoutAccount}/${partnerId}/payout-accounts`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  updateImage(data: any, option: AxiosRequestConfig) {
    return HTTP.post(PATHS.updateImage, data, {
      headers: {
        Authorization: getToken(),
      },
      ...option,
    });
  },
  verifyOTP(data: { email: string; otp: string }) {
    return HTTP.post(PATHS.verifyOTP, data);
  },

  sendOTP(data: { email: string }) {
    return HTTP.post(PATHS.sendOTP, data);
  },
};

export default AuthService;
