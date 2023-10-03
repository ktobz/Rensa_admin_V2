import { IAddBankProps } from "types/globalTypes";
import HTTP from "./Http";

const PATHS = {
  allSavedBankAccount: "/user/get-user-bank-accounts",
  banks: "/user/get-all-banks",
  addBankAccount: "/user/add-bank-account",
  deleteBankDetails: "/user/delete-user-bank-account",
};

const UserService = {
  allBanks() {
    return HTTP.get(PATHS.banks);
  },
  getAllSavedBankDetails() {
    return HTTP.get(PATHS.allSavedBankAccount);
  },
  createBankDetails(data: IAddBankProps) {
    return HTTP.post(PATHS.addBankAccount, data);
  },
  deleteBankDetails(id: number) {
    return HTTP.delete(`${PATHS.deleteBankDetails}/${id}`);
  },
};

export default UserService;
