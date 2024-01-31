export type ILoginResponse = {
  hasResult: boolean;
  result: {
    token: string;
    refreshToken: string;
    validity: number;
    expires: string;
    isSuperAdmin: boolean;
    userId: string;
  };
  resultType: number;
  message: string;
  validationMessages: any;
  successful: boolean;
  exceptionThrown: false;
  error: any;
  responseCode: string; //200,
};
