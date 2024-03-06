import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";

import { styled, MuiButton, MuiCircularProgress } from "@/lib/index";
import AppInput from "@/components/input";
import { toast } from "react-toastify";
import AppVirtualizedCountriesSelect from "@/components/select/test";
import { useQuery, useQueryClient } from "react-query";
import AuthService from "@/services/auth.service";
import AppCustomModal from "@/components/modal/Modal";
import OTPLayout from "@/components/layout/otp/OTPLayout";
import InputRowVariant from "@/components/input/InputRowVariant";
import CustomerService from "@/services/customer-service";

const SCHEMA = Yup.object().shape({
  accountNumber: Yup.string().required("required"),
  accountName: Yup.string().required("required"),
  bankName: Yup.string().required("required"),
  internalCode: Yup.string(),
});

type IViewProps = {
  mode: "new" | "edit";
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const PayoutAccountView = ({ userId }: { userId: string }) => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const [mode, setMode] = React.useState("view");

  const queryClient = useQueryClient();

  const refreshQuery = () => {
    queryClient.invalidateQueries(["payout-account-info", userId]);
    setMode("view");
  };

  const initialData = {
    accountName: "",
    accountNumber: "",
    bankName: "",
    internalCode: "",
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreateCard = async (formValues: any) => {
    setIsSubmitting(true);

    CustomerService.setCustomerPayoutAccount(userId, formValues)
      .then((res) => {
        refreshQuery();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      })
      .finally(() => setIsSubmitting(false));
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: (values: any) => {
      handleCreateCard(values);
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

  const branches = useQuery(
    ["all-banks"],
    () =>
      AuthService.allBanks(`?PageNumber=${1}&PageSize=${100}&searchText=`).then(
        (res) => {
          return res.data.result?.data;
        }
      ),
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );

  useQuery(
    ["verify-bank-nme", values.accountNumber, values.internalCode],
    () =>
      AuthService.confirmBankAccount({
        accountnumber: values.accountNumber,
        internalcode: values.internalCode,
      })
        .then((res) => {
          const data = res?.data?.result;
          setFieldValue("accountName", data?.accountName);
          return data;
        })
        .catch((err) => {
          setFieldValue("accountName", "");
          setFieldError("accountName", err?.response?.data?.message);
        }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!(values.accountNumber?.length >= 10 && values.internalCode),
    }
  );

  const { data, isLoading } = useQuery(
    ["payout-account-info", userId],
    () =>
      CustomerService.getCustomerPayoutAccount(userId).then((res) => {
        const data = res?.data?.result;
        setFieldValue("accountName", data?.accountName);
        setFieldValue("accountNumber", data?.accountNumber);
        setFieldValue("bankName", data?.bankName);
        setFieldValue("internalCode", data?.internalCode);

        return data;
      }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      // enabled: !!,
    }
  );
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const validatedValue = value?.trim();
    setFieldValue(name, validatedValue);
  };

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

      {mode === "edit" ? (
        <FormikProvider value={formik}>
          <StyledForm onSubmit={handleSubmit}>
            <div className="wrapper">
              <AppVirtualizedCountriesSelect
                label="Bank Name"
                // name="bank_name"
                placeholder="Select bank  "
                value={values.bankName}
                // helperText={errors.bank}
                error={!!errors.bankName}
                // onBlur={handleBlur}
                options={branches.data || []}
                optionValue="name"
                optionTitle="name"
                updateFieldValue={(value: {
                  id: number;
                  internalCode: string;
                  name: string;
                }) => {
                  setFieldValue("internalCode", value.internalCode);
                  setFieldValue("bankName", value.name);
                }}
                selectedValue={values.bankName}
                wrapperStyle={{ width: "auto" }}
                showCheck={false}
                showPills={false}
                required
                hasImage
                iconName="bank"
              />
              <AppInput
                id="accountNumber"
                name="accountNumber"
                label="Account Number"
                placeholder="Enter account number"
                type="string"
                value={values.accountNumber}
                onChange={handleCustomChange}
                helperText={errors.accountNumber}
                error={!!errors.accountNumber}
                required
              />

              <AppInput
                id={errors.accountName ? "account_name" : ""}
                name="accountName"
                label="Account Name"
                placeholder="Enter account name"
                type="accountName"
                value={values.accountName}
                onChange={handleChange}
                helperText={errors.accountName}
                error={!!errors.accountName}
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
            {/* <AppCustomModal
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
            </AppCustomModal> */}
          </StyledForm>
        </FormikProvider>
      ) : (
        <div className="view-wrapper">
          <InputRowVariant
            name="bankName"
            label="Bank Name"
            type="text"
            value={data?.bankName}
          />
          <InputRowVariant
            name="accountNumber"
            label="Account Number"
            type="text"
            value={data?.accountNumber}
          />

          <InputRowVariant
            name="accountName"
            label="Account Name"
            type="text"
            value={data?.accountName}
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
  /* max-width: 450px; */

  width: 100%;
  min-height: 600px;
  position: relative;

  /* overflow: hidden; */
  background-color: #fff;
  border: 1px solid #f4f4f4;
  border-radius: 6px;
  padding: 40px 20px 20px;

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
