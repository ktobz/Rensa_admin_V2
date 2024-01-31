import { IAdminData } from "@/types/globalTypes";
import {
  APP_LOCAL_STATE_NAME,
  REFRESH_TOKEN_NAME,
  TOKEN_NAME,
} from "types/actionTypes";
import { create } from "zustand";
import { StorageValue, persist } from "zustand/middleware";
// import merge from "lodash.merge";

export interface PersistStorage<S> {
  getItem: (
    name: string
  ) => StorageValue<S> | null | Promise<StorageValue<S> | null>;
  setItem: (name: string, value: StorageValue<S>) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

type State = {
  user: IAdminData;
  setUser: (data: IAdminData) => void;
  logout: () => void;
  isAuthorized: boolean;
  setIsAuthorized: (status: boolean) => void;
};

const defaultUser: IAdminData = {
  token: "",
  expires: "",
  isSuperAdmin: false,
  refreshToken: "",
  userId: "",
  validity: 0,
};

export const useUserStore = create(
  persist<State>(
    (set) => ({
      user: defaultUser,
      isAuthorized: false,
      setIsAuthorized: (status: boolean) =>
        set((prevState) => ({ ...prevState, isAuthorized: status })),
      setUser: (data: IAdminData) =>
        set((prevState) => ({ ...prevState, user: data, isAuthorized: true })),
      logout: () => {
        sessionStorage.removeItem(TOKEN_NAME);
        sessionStorage.removeItem(REFRESH_TOKEN_NAME);
        sessionStorage.removeItem(APP_LOCAL_STATE_NAME);
        return set((prevState) => ({ ...prevState, user: defaultUser }));
      },
    }),

    {
      name: APP_LOCAL_STATE_NAME,
      getStorage: () => localStorage,
      version: 5,
      // merge: (persisted: any, current) => merge(current, persisted),
    }
  )
);
