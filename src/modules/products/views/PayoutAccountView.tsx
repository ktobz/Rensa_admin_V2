import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";

import { styled, MuiButton, MuiCircularProgress } from "@/lib/index";
import VendgramInput from "@/components/input";
import { toast } from "react-toastify";
import VendgramVirtualizedCountriesSelect from "@/components/select/test";
import { useQuery, useQueryClient } from "react-query";
import { useUserStore } from "@/config/store-config/store.config";
import AuthService from "@/services/auth.service";
import VendgramCustomModal from "@/components/modal/Modal";
import OTPLayout from "@/components/layout/otp/OTPLayout";
import InputRowVariant from "@/components/input/InputRowVariant";

const SCHEMA = Yup.object().shape({
  bank_name: Yup.string().required("required"),
  account_name: Yup.string().required("required"),
  account_no: Yup.string().required("required"),
  otp: Yup.string(),
});

type IViewProps = {
  mode: "new" | "edit";
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const PayoutAccountView = ({ partnerId }: { partnerId: string }) => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const [mode, setMode] = React.useState("view");
  const { email } = useUserStore((state) => state.user);
  const queryClient = useQueryClient();

  const initialData = {
    bank_name: "",
    bank: "",
    account_name: "",
    account_no: "",
    otp: "",
    bank_code: "",
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreateCard = (formValues: any) => {
    setIsSubmitting(true);

    //  AuthService.setPayoutAccount(bodyData)
    //    .then((res) => {
    //      refreshQuery?.();
    //      toast.success(res.data?.message || "");
    //    })
    //    .catch((err) => {
    //      toast.error(err?.response?.data?.message || "");
    //    })
    //    .finally(() => setIsSubmitting(false));
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      setIsSubmitting(true);
      AuthService.sendOTP({
        email,
      })
        .then((res) => {
          setShow(true);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
  });

  const {
    errors,
    handleSubmit,
    handleChange,
    values,
    setFieldValue,
    setFieldError,
  } = formik;

  const handleCloseModal = () => {
    setShow(false);
  };

  // const handleCustomChange = (name: string, value: string | number) => {
  //   setFieldValue(name, value);
  // };

  const branches = useQuery(
    ["all-banks"],
    () =>
      AuthService.allBanks().then((res) => {
        return res.data.data;
      }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );

  useQuery(
    ["verify-bank-name", values.account_no, values.bank_code],
    () =>
      AuthService.confirmBankAccount({
        account_number: values.account_no,
        bank_code: values.bank_code,
      })
        .then((res) => {
          setFieldValue("account_name", res?.data?.data?.account_name);
          setFieldError("account_name", "");

          return res.data.data;
        })
        .catch((err) => {
          setFieldValue("account_name", "");
          setFieldError("account_name", err?.response?.data?.message);
        }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!(values.account_no?.length >= 10 && values.bank_code),
    }
  );

  const { data, isLoading } = useQuery(
    ["account-info", partnerId],
    () =>
      AuthService.payoutAccount(partnerId).then((res) => {
        const data = res?.data?.data;
        setFieldValue("account_name", data?.account_name);
        setFieldValue("account_no", data?.account_no);
        setFieldValue("bank_name", data?.bank_name);
        setFieldValue("bank", data?.bank_name);

        return data;
      }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!partnerId,
    }
  );
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const validatedValue = value?.trim();
    setFieldValue(name, validatedValue);
  };

  function handleVerifyOTP(otp: string, callback: () => void) {
    AuthService.setPayoutAccount({
      account_name: values.account_name,
      account_no: values?.account_no,
      bank_name: values?.bank_name,
      otp: +otp,
    })
      .then((res) => {
        toast.success(res?.data?.data?.message);
        queryClient.invalidateQueries(["account-info"]);
        handleCloseModal();
        setMode("view");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      })
      .finally(() => callback());
  }

  function resendOTP(callback: () => void) {
    AuthService.sendOTP({
      email,
    })
      .then((res) => {
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      })
      .finally(() => callback());
  }

  const handleEdit = () => {
    setMode("edit");
  };

  return (
    <StyledSection>
      {data && (
        <div className="action">
          <MuiButton
            // variant="contained"
            className="update-btn"
            onClick={handleEdit}>
            Update Payout Account
          </MuiButton>
        </div>
      )}

      {mode === "edit" || !data ? (
        <FormikProvider value={formik}>
          <StyledForm onSubmit={handleSubmit}>
            <div className="wrapper">
              <VendgramVirtualizedCountriesSelect
                label="Bank Name"
                // name="bank_name"
                placeholder="Select bank  "
                value={values.bank}
                // helperText={errors.bank}
                error={!!errors.bank}
                // onBlur={handleBlur}
                options={branches.data || []}
                optionValue="name"
                optionTitle="name"
                updateFieldValue={(value: {
                  id: number;
                  code: string;
                  name: string;
                }) => {
                  setFieldValue("bank_code", value.code);
                  setFieldValue("bank_name", value.name);
                }}
                selectedValue={values.bank_name}
                wrapperStyle={{ width: "auto" }}
                showCheck={false}
                showPills={false}
                required
                hasImage={false}
              />
              <VendgramInput
                id="account_no"
                name="account_no"
                label="Account Number"
                placeholder="Enter account number"
                type="string"
                value={values.account_no}
                onChange={handleCustomChange}
                helperText={errors.account_no}
                error={!!errors.account_no}
                required
              />

              <VendgramInput
                id={errors.account_name ? "account_name" : ""}
                name="account_name"
                label="Account Name"
                placeholder="Account name shows automatically"
                type="account_name"
                value={values.account_name}
                onChange={handleChange}
                helperText={errors.account_name}
                error={!!errors.account_name}
                disabled
              />

              <div className="btn-group">
                <MuiButton
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  color="primary"
                  className="btn">
                  {isSubmitting ? (
                    <MuiCircularProgress size={16} />
                  ) : (
                    "Add Account"
                  )}
                </MuiButton>
              </div>
            </div>
            <VendgramCustomModal
              handleClose={handleCloseModal}
              open={show}
              alignTitle="left"
              title={"Confirm Changes"}
              showClose>
              <StyledWrapper>
                <OTPLayout
                  onVerify={handleVerifyOTP}
                  resendOTP={resendOTP}
                  buttonText="Submit"
                  email={email}
                  title=" "
                  subtitle="For security reasons, we have sent a 6-digit OTP code to your email to confirm account changes"
                  variant="payout"
                  contentId="payout-layout"
                />
              </StyledWrapper>
            </VendgramCustomModal>
          </StyledForm>
        </FormikProvider>
      ) : (
        <div className="view-wrapper">
          <InputRowVariant
            name="bank_name"
            label="Bank Name"
            type="text"
            value={data?.bank_name}
          />
          <InputRowVariant
            name="account_no"
            label="Account Number"
            type="text"
            value={data?.account_no}
          />

          <InputRowVariant
            name="account_name"
            label="Account Name"
            type="text"
            value={data?.account_name}
          />
        </div>
      )}
    </StyledSection>
  );
};

const StyledSection = styled.section`
  width: 100%;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  max-width: 450px;

  & .action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: end;
  }
  & .update-btn {
    width: 100%;
    max-width: fit-content;
    background-color: #f05b2a1a;
    color: #f05b2a;
    border-radius: 30px;
    font-size: 12px;
    padding: 8px 10px;
    min-height: fit-content;
    height: fit-content;
  }

  & .view-wrapper {
    max-width: 450px;
    width: 100%;
    display: flex;
    gap: 15px;
    flex-direction: column;
  }
`;

const StyledWrapper = styled.section`
  width: 100%;

  #payout-layout {
    padding: 20px 0 0 0;
    max-width: 400px;
  }
`;

const StyledForm = styled.form`
  width: 100%;

  & .wrapper {
    max-width: 450px;
    width: 100%;
  }

  & .flex-wrapper {
    display: flex;
    gap: 30px;
    align-items: self-end;
  }

  & .btn {
    width: 100%;
    margin-top: 45px;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  & .btn-group {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;

    & .cancel-btn {
      background-color: #fbfbfb;
      color: #363636;
    }
  }

  & .image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding-top: 27px;
    position: relative;

    & .image-loader {
      position: absolute;
      margin: auto 0;
      left: 40%;
      right: 50%;
      top: 29%;
    }

    & .info {
      margin-top: 10px;
      color: #64748b;
      font-size: 13px;
    }

    & .change-image {
      min-height: fit-content;
      height: fit-content;
      padding: 5px;
      display: block;
      cursor: pointer;
      color: #f05b2a;
      font-size: 13px;
      background: #f05b2a1a;
      border-radius: 30px;
      padding: 10px 20px;
    }
  }
  & .user-image {
    border-radius: 50%;
    overflow: hidden;
    width: 160px;
    height: 160px;
    text-align: center;
    border: 1px solid #f1f2f5;
  }

  & .MuiTextField-root {
    background-color: transparent;
    margin-top: 0;
  }

  & .MuiOutlinedInput-root {
    & .Mui-disabled {
      -webkit-text-fill-color: rgba(0, 0, 0, 0.68) !important;
    }
  }
  & .Mui-disabled {
    color: #0f172a;
    margin-bottom: 0;
  }

  & #account_name {
    & .MuiOutlinedInput-root {
      & .Mui-disabled {
        -webkit-text-fill-color: rgba(0, 0, 0, 0.68) !important;
      }
    }

    .MuiFormHelperText-root {
      margin-top: 0px;
      -webkit-text-fill-color: tomato !important;
    }
  }
`;
