// import { IUserData } from "providers/contexts";
import {
  APP_LOCAL_STATE_NAME,
  REFRESH_TOKEN_NAME,
  TOKEN_NAME,
} from "types/actionTypes";
import { create } from "zustand";
import { StorageValue, persist } from "zustand/middleware";
// import merge from "lodash.merge";

export type IBankDetailsProps = {
  _id: string;
  account_number: string;
  account_name: string;
  owner: string;
  brexId: string;
  balance: number;
  created_at: string | Date;
  updated_at: string | Date;
};

export type IUserData = {
  token: string;
  email: string;
  fullName: string;
};

export interface PersistStorage<S> {
  getItem: (
    name: string
  ) => StorageValue<S> | null | Promise<StorageValue<S> | null>;
  setItem: (name: string, value: StorageValue<S>) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

type State = {
  user: IUserData;
  setUser: (data: IUserData) => void;
  setUserCardBalance: (balance: number) => void;
  logout: () => void;
};

const defaultUser: IUserData = {
  token: "",
  email: "",
  fullName: "",
};

export const useUserStore = create(
  persist<State>(
    (set) => ({
      user: defaultUser,
      setUser: (data: IUserData) =>
        set((prevState) => ({ ...prevState, user: data })),
      logout: () => {
        sessionStorage.removeItem(TOKEN_NAME);
        sessionStorage.removeItem(REFRESH_TOKEN_NAME);
        sessionStorage.removeItem(APP_LOCAL_STATE_NAME);
        return set((prevState) => ({ ...prevState, user: defaultUser }));
      },
      setUserCardBalance: (balance: number) =>
        set((prevState: State) => ({
          ...prevState,
          user: {
            ...prevState.user,
            bankDetails: {
              // ...prevState.user.bankDetails,
              balance,
            },
          },
        })),
    }),

    {
      name: APP_LOCAL_STATE_NAME,
      getStorage: () => localStorage,
      version: 4,
      // merge: (persisted: any, current) => merge(current, persisted),
    }
  )
);
