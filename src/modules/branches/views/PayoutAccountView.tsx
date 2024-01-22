import * as React from "react";
import { useQuery } from "react-query";

import { styled, MuiCircularProgress } from "@/lib/index";
import InputRowVariant from "@/components/input/InputRowVariant";
import CustomerService from "@/services/customer-service";

export const PayoutAccountView = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useQuery(
    ["account-info", userId],
    () =>
      CustomerService.payoutAccount(userId).then((res) => {
        const data = res?.data?.result;
        return data;
      }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!userId,
    }
  );

  return (
    <StyledSection>
      <div className="view-wrapper">
        <InputRowVariant
          name="bank_name"
          label="Bank Name"
          type="text"
          value={data?.bankName || "Fidelty"}
        />
        <InputRowVariant
          name="account_no"
          label="Account Number"
          type="text"
          value={data?.accountNumber}
        />

        <InputRowVariant
          name="account_name"
          label="Account Name"
          type="text"
          value={data?.accountName}
        />
      </div>
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

  & .MuiInputLabel-root {
    color: #0f172a !important;
  }

  & .MuiInputBase-input {
    color: #64748b;
    -webkit-text-fill-color: #64748b;
  }

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
