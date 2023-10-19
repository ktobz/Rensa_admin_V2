export interface ILoginReq {
  username: string;
  password: string;
}
export interface ISignupReq extends ILoginReq {
  domain: string;
  password: string;
}
export interface IVerifyOTPReq {
  email: string;
  token: string | number;
}

export interface ICompleteProfileReq {
  email: string;
  countryOfResidence: string;
  address: string;
}

export interface IChangePasswordProp {
  newPassword: string;
  password: string;
}
export interface IResetPasswordProp {
  new_password: string;
  otp: string;
  email?: string;
}

export type IAddBankProps = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  logo?: string;
  _id?: number;
};

export interface IBankConfirmProps {
  account_number: string;
  bank_code: string;
}

export type IPayoutAccountProps = {
  bank_name: string;
  account_name: string;
  account_no: string;
  otp: number;
};

export interface IVerifyOTPReq {
  email: string;
  token: string | number;
}

export interface IChangePasswordProp {
  password: string;
  old_password: string;
  password_confirmation: string;
}

export interface ICreatePasswordProp {
  password: string;
  email: string;
  password_confirmation: string;
}

export interface IResetPasswordProp {
  new_password: string;
  otp: string;
  email?: string;
}

export type IBranchEntryProps = {
  name: string;
  location: string;
  branch_manager_id: string;
  availabilty: boolean;
  id?: number;
};

export type IBranchManagerData = {
  phone: string;
  email: string;
  id: string;
  full_name: boolean;
  profile_image: string;
};

export type IBranchDataProps = {
  name: string;
  location: string;
  availabilty: boolean;
  id?: number;
  branch_manager: IBranchManagerData;
  total_managers: number;
  total_orders: number;
  total_sales: number;
  total_sales_amount: number;
  created_at: string;
};

export type IBranchData = IBranchEntryProps & {
  total_managers: number;
  total_orders: number;
  total_sales: number;
  total_sales_amount: number;
  updated_at: string;
  created_at: string;
  id: number;
};
export type IPartnerEntryProps = {
  id?: number;
  email: string;
  contact_phone: string;
  service_charge: number;
};

export type IPartnerStatsQuery = {
  totat_sales_period: string;
  totat_count_period: string;
};

export type IPartnerStatsData = {
  total_sales: number;
  total_orders: number;
  total_branches: number;
  total_branch_managers: number;
};

export type IPartnerDataProps = {
  name: string;
  id: string;
  email: string;
  contact_phone: string;
  service_charge: number;
  status: boolean;
  total_products: number;
  total_branches: number;
  total_branch_managers: number;
  created_at: string;
  updated_at: string;
  profile_image: string;
};

// RIDER
export type IRiderEntryProps = {
  id?: number;
  email: string;
  full_name: string;
  phone: number;
};

export type IRiderData = {
  id: string;
  full_name: string;
  phone: string;
  user_id: string;
  profile_image: string;
  status: boolean;
  created_at: string;
  updated_at: string;
};

// CUSTOMER DATA
export type ICustomerData = {
  id: string;
  full_name: string;
  phone: string;
  user_id: string;
  profile_image: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  email: string;
  orders: any[];
  wallet_balance: number;
};

export type IOrderTotalStats = {
  total_orders: number;
  new_orders: number;
  pickup_orders: number;
  on_going_orders: number;
  confirmed_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
};

export type ITransactionData = {
  id: string;
  user: {
    full_name: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    profile_image: null;
    phone_verified: boolean;
  };
  description: string;
  amount: number;
  reference: string;
  transfer_code: string;
  transaction_type: string;
  transaction_source: string;
  status: IStatus;
  card_transaction: null;
  wallet_transaction: {
    id: string;
    user: {
      full_name: string;
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
      profile_image: null;
      phone_verified: boolean;
    };
    description: string;
    amount: number;
    reference: string;
    transfer_code: string;
    transaction_type: string;
    transaction_source: string;
    status: IStatus; //"NEW"
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
};

// NOTIFICATION
export type INotificationData = {
  id: number;
  title: string;
  description: string;
  last_sent: string;
  scheduled: string;
  status: boolean;
};

export type IFAQData = Omit<INotificationData, "last_sent" | "scheduled">;

export type IDeliverySettingsReq = {
  base_fare: number;
  per_kilometer: number;
  order_proximity_radius: number;
};

export type IDeliverySettingsData = IDeliverySettingsReq & {
  id: number;
  status: boolean;
};

export type IServiceFeeReq = {
  percentage: number;
  cap_price: number;
};

export type IServiceFeeData = IServiceFeeReq & {
  id: number;
  status: boolean;
};

export type IPagination = {
  pageSize: number;
  page: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
};

export type IStatus =
  | "new"
  | "pick-up"
  | "cancelled"
  | "confirmed"
  | "delivered"
  | "pending"
  | "declined"
  | "abandoned"
  | "completed"
  | "failed";

export type IVerifyStatus = "true" | "false";

export type IUser = {
  full_name: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_image: string | null;
  phone_verified: boolean;
};

export type IOrderQuery = {
  status: number[];
  page?: number;
  currentPage: number;
};

export type IPaymentOption = {
  id: number;
  name: string;
};

export type IOpeningDays = {
  id: number;
  day: string;
  status: boolean;
};

export type IAddress = {
  id: number;
  user: IUser;
  physical_location: string;
  map_location: string;
  town: string;
  state: string;
  country: string;
  longitude: string;
  latitude: string;
  status: boolean;
  is_current: boolean;
};

export type IProductCategory = {
  id: number;
  name: string;
  image: string;
  status: boolean;
};

export type IProductData = {
  id: string;
  name: string;
  productId: number;
  price_litre: number;
  sale_quantity: number;
  gross_price: number;
  publish: boolean;
  product_category: IProductCategory;
  partner: IPartnerDataProps;
  created_at: string;
  updated_at: string;
};

export type IOrderItem = {
  product: IProductData;
  unit_price: number;
  quantity: number;
  total_price: number;
  status: IStatus;
};

export type IOrderDetails = {
  id: string;
  order_id: number;
  contact_number: string;
  delivery_pickup_note: string;
  delivery_pickup_time: string;
  delivery_pickup_date: string;
  delivery_fee: number;
  service_fee: number;
  user: IUser;
  status: IStatus;
  delivery_option: string;
  payment_option: IPaymentOption;
  branch: IBranchData & { opening_days: IOpeningDays[] };
  address: IAddress;
  partner: IPartnerDataProps;
  total_product_price: number;
  total_price: number;
  payment_reference: string;
  scheduled: number;
  order_items: IOrderItem[];
  rider: IRiderData;
  created_at: string;
  updated_at: string;
};

export type IOrderMetrics = {
  total_sales: number;
  total_orders: number;
  top_selling_branch: IBranchData;
};

export type IAdminData = {
  token: string;
  refreshToken: string;
  validity: number;
  expires: string;
  isSuperAdmin: boolean;
  userId: string;
};

export type IResponse = {
  hasResult: boolean;
  resultType: number;
  message: string;
  validationMessages: any;
  successful: boolean;
  exceptionThrown: false;
  error: any;
  responseCode: string; //200,
};

export type ILoginResponse = {
  result: IAdminData;
};

export type IPaginationResponse = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
};

export type IUserData = {
  creationTime: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  id: string;
};

export type IUsersResponse = {
  result: IPaginationResponse & {
    data: IUserData[];
  };
};

// APP RELEASE
export type IAppReleaseData = {
  versionNumber: string;
  releaseNotes: string;
  forceUpdate: boolean;
  devicePlatform: number;
  id?: string;
  creationTime?: string;
};

export type IAppReleaseResponse = {
  result: IPaginationResponse & {
    data: IAppReleaseData[];
  };
};

// CATALOGUE CATEGORY
export type ICategoryData = {
  name: string;
  image: string;
};

export type ICategoryDataResponse = {
  result: IPaginationResponse & {
    data: ICategoryData[];
  };
};

// AUTOMATED MESSAGE CATEGORY
export type IAutomatedMessage = {
  title: string;
  subject: string;
  message: string;
};

export type IAutomatedMessageResponse = {
  result: IPaginationResponse & {
    data: IAutomatedMessage[];
  };
};

// ConditionE CATEGORY
export type ICondition = {
  name: string;
  description: string;
};

export type IConditionResponse = {
  result: IPaginationResponse & {
    data: ICondition[];
  };
};

// LOOKUPS

export type ILookupGroupName =
  | "automatedMessageCategory"
  | "automatedMessageType"
  | "bidStatus"
  | "bidType"
  | "catalogueStatus"
  | "devicePlatform"
  | "emailType"
  | "mailStatus"
  | "pickupMethod"
  | "userType";

export type IAutomatedMessageCategory = {
  name: string;
  id: number;
};

export type ICategory = {
  name: string;
  id: number;
};

export type ILookups = {
  automatedMessageCategory: ICategory[];
  automatedMessageType: ICategory[];
  bidStatus: ICategory[];
  bidType: ICategory;
  catalogueStatus: ICategory[];
  devicePlatform: ICategory[];
  emailType: ICategory[];
  mailStatus: ICategory[];
  pickupMethod: ICategory[];
  userType: ICategory[];
};
