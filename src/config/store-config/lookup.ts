import { ILookups } from "@/types/globalTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cache: {
    lookup: ILookups;
  };
  updateLookup: (data: ILookups) => void;
  clearCacheStore: () => void;
}

const defaultLookup: ILookups = {
  automatedMessageCategory: [],
  automatedMessageType: [],
  bidStatus: [],
  bidType: [],
  catalogueStatus: [],
  devicePlatform: [],
  emailType: [],
  mailStatus: [],
  pickupMethod: [],
  userType: [],
  catalogueTransactionStatus: [],
  bankProvider: [],
  catalogueOrderStatus: [],
  deliveryFeePickupMethod: [],
  reportedListingStatus: [],
  serviceFeeType: [],
  verificationStatus: [],
  verificationType: [],
};

const useCachedDataStore = create(
  persist<State>(
    (set) => ({
      cache: {
        lookup: defaultLookup,
      },

      updateLookup: (data: ILookups) =>
        set((prevState) => ({
          ...prevState,
          cache: {
            ...prevState.cache,
            lookup: data,
          },
        })),

      clearCacheStore: () => {
        set((prevState) => ({
          ...prevState,
          cache: {
            lookup: defaultLookup,
          },
        }));
      },
    }),

    {
      name: "re_cache",
      getStorage: () => localStorage,
      version: 3,
      // merge: (persisted: any, current) => merge(current, persisted),
    }
  )
);

export default useCachedDataStore;
