export type ISettlementStatus = "accepted" | "pending" | "rejected" | "expired";

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
  baseFee: number;
  pricePerKm: number;
  deliveryPickupMethod?: number;
};

export type IDeliverySettingsData = IDeliverySettingsReq & {
  id: number;
};

export type IServiceFeeReq = {
  buyerServiceFee: number;
  sellerServiceFee: number;
  id?: number;
};
export type IPayoutData = {
  waitTimeInHours: number;
  id?: number;
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
  | "successful"
  | "rejected"
  | "active"
  | "resolved"
  | "reported"
  | "failed"
  | "intransit"
  | "pending_cancellation"
  | "sold"
  | "pending_payment"
  | "pending_delivery"
  | "pending_pickup"
  | "expired"
  | "processing"
  | "queued"
  | "on_hold"
  | "closed"
  | "invalid_account";

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
  // cancellationRequests: {
  //   cancellationReason: string;
  //   comment: string;
  // }[];
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
  username: string;

  phoneNumber: string;
  emailConfirmed: boolean;
  id: string;
  isVerified: boolean;
  isActive: boolean;
  profilePictureUrl: string;
};

export type IUsersResponse = {
  result: IPaginationResponse & {
    data: IUserData[];
  };
};

export type IUserDetailResponse = {
  result: IUserData;
};

export type IUserStatusUpdateResponse = {
  result: {
    message: string;
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

// ORDERS

export type ICancelOrderProps = {
  orderNumber: string;
  cancellationReason: string;
};

export type IRefundOrderPaymentProps = {
  orderNumber: string;
  comment: string;
  approve: boolean;
};

export type IOrderData = {
  orderNumber: string;
  transactionReference: string;
  itemAmount: number;
  serviceFee: number;
  minDeliveryFee: number;
  maxDeliveryFee: number;
  minTotalAmount: number;
  maxTotalAmount: number;
  catalogueId: string;
  catalogue: null;
  catalogueName: string;
  userId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  destinationLongitude: number;
  destinationLatitude: number;
  destinationLocation: string;
  phoneNumber: string;
  deliveryDate: string;
  status: number;
  id: number;
  creatorUserId: string;
  lastModifierUserId: null;
  deleterUserId: null;
  creationTime: string;
  lastModificationTime: null;
  deletionTime: null;
  isDeleted: boolean;
};

export type IOrderFullDetails = {
  id: 2;
  orderNumber: string;
  transactionReference: string;
  buyerInfo: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    username: string;
  };
  sellerInfo: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    username: string;
  };
  buyerPayment: {
    itemAmount: number;
    buyerServiceFee: number;
    maxDeliveryFee: number;
    buyerPayment: number;
  };
  sellerPayment: {
    itemAmount: number;
    sellerServiceFee: number;
    sellerSettlement: number;
  };
  salesRevenue: number;
  pickUpLocation: {
    longitude: number;
    latitude: number;
    location: string;
  };
  dropOffLocation: {
    longitude: number;
    latitude: number;
    location: string;
  };
  catalogueId: string;
  catalogueName: string;
  catalogueCoverPhoto: string;
  deliveryDate: string;
  creationTime: string;
  sellerUserId: string;
  buyerUserId: string;
  pickupMethod: number;
  status: number;
  cancellationRequests: {
    cancellationReason: string;
    comment: string;
  }[];
};

export type IOrderResponse = {
  result: IPaginationResponse & {
    data: IOrderData[];
  };
};

export type ICalendarOrderResponse = {
  result: {
    day: number;
    month: number;
    totalCount: number;
    year: number;
  }[];
};

export type IOrderDetailsResponse = {
  result: IOrderFullDetails;
};

export type IOrderStatsResponse = {
  result: {
    pending: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
};

// DELIVERY SETTINGS

export type IDeliverySettingsResponse = {
  result: IDeliverySettingsData[];
};
export type IBankDetailsResponse = {
  result: {
    bankName: string | null;
    internalCode: string | null;
    accountName: string | null;
    accountNumber: string | null;
  };
};
// CATALOGUE CATEGORY
export type ICategoryData = {
  name: string;
  file: string;
  id?: string;
  fileUrl?: string;
};

export type ICategoryDataResponse = {
  result: IPaginationResponse & {
    data: ICategoryData[];
  };
};

export type IEntryResponse = IResponse & {
  result: {
    message: string;
  };
};

// AUTOMATED MESSAGE CATEGORY
export type IAutomatedMessage = {
  title: string;
  subject: string;
  message: string;
  id?: string;
};

export type IAutomatedMessageResponse = {
  result: IAutomatedMessage[];
};

export type IServiceFeeResponse = {
  result: IServiceFeeReq[];
};

export type ITermiiResponse = {
  result: {
    user: string;
    balance: number;
    currency: string;
  };
};

export type IPayoutDataResponse = {
  result: IPayoutData[];
};

// ConditionE CATEGORY
export type ICondition = {
  name: string;
  description: string;
  id?: string;
};

export type IConditionResponse = {
  result: IPaginationResponse & {
    data: ICondition[];
  };
};

// Transactions
export type ITransactions = {
  transactionReference: string;
  itemAmount: number;
  serviceFee: number;
  minDeliveryFee: number;
  maxDeliveryFee: number;
  minTotalAmount: number;
  maxTotalAmount: number;
  catalogueId: string;
  catalogue: null;
  catalogueBidId: number;
  userId: string;
  destinationLongitude: number;
  destinationLatitude: number;
  destinationLocation: string;
  phoneNumber: string;
  deliveryDate: string;
  response: null;
  status: number;
  id: number;
  creationTime: string;
  orderNumber: string;
};

export type IUserPayout = {
  id: number;
  creatorUserId: string;
  lastModifierUserId: string;
  deleterUserId: string;
  creationTime: string;
  lastModificationTime: string;
  deletionTime: string;
  isDeleted: true;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  amount: number;
  narration: string;
  transactionReference: string;
  userId: string;
  orderNumber: string;
  response: string;
  statusQueryResponse: string;
  statusQueryCount: number;
  retryCount: number;
  lastStatusQueryDate: string;
  providerTransactionId: string;
  providerTransactionReference: string;
  provider: number;
  status: number;
  transactionType: number;
};

export type ITransactionsResponse = {
  result: IPaginationResponse & {
    data: ITransactions[];
  };
};

export type IPayoutResponse = {
  result: IPaginationResponse & {
    data: IUserPayout[];
  };
};
// SALES

export type ISalesData = {
  id: number;
  orderNumber: string;
  creationTime: string;
  deliveryDate: string;
  itemAmount: number;
  buyerServiceFee: number;
  sellerServiceFee: number;
  minDeliveryFee: number;
  maxDeliveryFee: number;
  minTotalAmount: number;
  maxTotalAmount: number;
  totalCount: number;
  sellerSettlement: number;
  revenue: number;
};

export type ISalesResponse = {
  result: IPaginationResponse & {
    data: ISalesData[];
  };
};

// LISTING

export type ICatalogueBid = {
  id: number;
  catalogueId: string;
  userId: string;
  bidType: number;
  bidPrice: number;
  bidStatus: number;
  bidStatusDescription: string;
  bidTypeDescription: string;
  creationTime: string;
  bidderInfo: IUserData;
};

export type IListingData = {
  name: string;
  coverPhoto: string;
  catalogueCategoryName: string;
  location: string;
  price: number;
  totalBidders: number;
  totalBids: number;
  totalOffers: number;
  durationInHours: number;
  pickupMethod: number;
  catalogueStatus: number;
  catalogueStatusDescription: string;
  pickupMethodDescription: string;
  id: string;
  creatorUserId: string;
  lastModifierUserId: null;

  deleterUserId: null;
  creationTime: string;
  lastModificationTime: null;
  deletionTime: null;
  isDeleted: false;
  catalogueBids: ICatalogueBid[];
  catalogueCategory: ICategoryData;
  catalogueCondition: ICondition;
  catalogueAttachments: {
    cleansedName: string;
    url: string;
  }[];
  description: string;
  sellerInfo: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePictureUrl: string;
    username: string;
  };
  state: string;
  city: string;
};

export type IReportedListingData = {
  catalogue: IListingData;
  catalogueId: string;
  reason: string;
  category: number;
  status: number;
  catalogueCreationTime: string;
  catalogueCreatorUserId: string;
  catalogueLastModificationTime: string;
  catalogueLastModifierUserId: string;
  catalogueCategoryId: number;
  catalogueConditionId: number;
  catalogueStatus: number;
  coverPhoto: string;
  description: string;
  durationInHours: number;
  location: string;
  longitude: string;
  langitude: string;
  name: string;
  pickupMethod: number;
  price: number;
  userId: string;
  totalCount: number;
  catalogueName: string;
};
export type IListingResponse = {
  result: IPaginationResponse & {
    data: IListingData[];
  };
};

export type IReportedListingResponse = {
  result: IPaginationResponse & {
    data: IReportedListingData[];
  };
};

export type IListingStatsResponse = {
  result: {
    pending: number;
    pendingPickup: number;
    pendingPayment: number;
    active: number;
    sold: number;
    processing: number;
    expired: number;
  };
};

export type IReportedListingCommentsResponse = {
  result: {
    comments: {
      id: number;
      reason: string;
      status: number;
      category: number;
      creationTime: string;
    }[];
  };
};

export type IListingDetailsResponse = {
  result: IListingData;
};
export type IAddListingResponse = {
  result: {
    message: string;
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
  bidType: ICategory[];
  catalogueStatus: ICategory[];
  devicePlatform: ICategory[];
  emailType: ICategory[];
  mailStatus: ICategory[];
  pickupMethod: ICategory[];
  userType: ICategory[];
  catalogueTransactionStatus: ICategory[];
  deliveryFeePickupMethod: ICategory[];
  reportedListingStatus: ICategory[];
  serviceFeeType: ICategory[];
  verificationType: ICategory[];
  catalogueOrderStatus: ICategory[];
  verificationStatus: ICategory[];
  bankProvider: ICategory[];
  dashboardFilter: ICategory[];
  durationHours: ICategory[];
  reportedListingCategory: ICategory[];
};

export type IListingProp = {
  name: string;
  id?: number;
  description: string;
  price: number;
  location: string;
  langitude: string;
  longitude: string;
  CatalogueConditionId: number;
  CatalogueCategoryId: number;
  DurationInHours: number;
  PickupMethod: number;
  UserId: string;
  files: any[];
};

export interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
export interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
export interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
  place_id: string;
}
