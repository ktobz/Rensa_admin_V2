import * as React from "react";
import {
  MuiButton,
  MuiCircularProgress,
  MuiIconButton,
  MuiTypography,
  styled,
} from "@/lib/index";
import { IconCopy, IconRetry, IconVerify } from "@/lib/mui.lib.icons";
import { OrderStatus } from "@/components/feedback/OrderStatus";
import { IStatus, IUserPayout } from "@/types/globalTypes";
import { formatCurrency, formatDate, getIdName } from "@/utils/helper-funcs";
import useCachedDataStore from "@/config/store-config/lookup";
import { Link } from "react-router-dom";

type IProps = {
  data: IUserPayout;
  onClick: (
    data: IUserPayout,
    type: "verify" | "retry",
    cb?: () => void
  ) => () => void;
  isSubmitting: boolean;
  actionType: string;
};

export function TransactionDetails({
  data,
  onClick,
  actionType,
  isSubmitting,
}: IProps) {
  const { catalogueTransactionStatus } = useCachedDataStore(
    (state) => state.cache.lookup
  );

  console.log(actionType, isSubmitting);
  const type = getIdName(
    data?.status,
    catalogueTransactionStatus
  )?.toLowerCase() as IStatus;
  const disableRetryBtn = type !== "failed";
  const disableVerifyBtn = type !== "pending";

  return (
    <PageContent>
      <div className="heading">
        <div className="group">
          <MuiTypography variant="body2" className="body">
            Status
          </MuiTypography>
        </div>
        <div className="status">
          <OrderStatus type={type} />
        </div>
      </div>
      <div className="line" />

      <div className="order-section">
        <div className="group">
          <MuiTypography variant="body1" className="header">
            User full name
          </MuiTypography>
          <MuiTypography variant="body2" className="body customer-name">
            <Link className="order-link" to={`/app/users/${data?.userId}`}>
              {data?.accountName}
            </Link>
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Amount
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            ₦
            {formatCurrency({
              amount: Math.abs(data?.amount),
              style: "decimal",
            })}
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Date created
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            {formatDate(data?.creationTime || "")}
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Order ID
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            <Link
              className="order-link"
              to={`/app/orders/${data?.orderNumber}`}>
              #{data?.orderNumber}
            </Link>
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Transaction ref.
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            {data?.transactionReference}
            {/* <MuiIconButton className="copy-btn">
              <IconCopy />
            </MuiIconButton> */}
          </MuiTypography>
        </div>

        <div className="group">
          <MuiTypography variant="body1" className="header">
            Beneficiary account
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            {data?.accountNumber}
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Beneficiary bank
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            {data?.bankName}
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Beneficiary name
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            {data?.accountName}
          </MuiTypography>
        </div>

        <div className="line" />

        <div className="btn-group">
          <MuiButton
            className={`btn ${disableRetryBtn ? "" : "retry-btn"}`}
            disabled={disableRetryBtn}
            startIcon={
              isSubmitting && actionType === "retry" ? (
                <MuiCircularProgress size={12} />
              ) : (
                <IconRetry />
              )
            }
            onClick={onClick(data, "retry")}
            variant="contained">
            Retry payout
          </MuiButton>
          <MuiButton
            className={`btn ${disableVerifyBtn ? "" : "verify-btn"}`}
            onClick={onClick(data, "verify")}
            disabled={disableVerifyBtn}
            startIcon={
              isSubmitting && actionType === "verify" ? (
                <MuiCircularProgress size={12} />
              ) : (
                <IconVerify />
              )
            }
            variant="contained">
            Verify payout
          </MuiButton>
        </div>
      </div>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: calc(100vw - 40px);
  max-width: 500px;
  margin: auto;
  position: relative;
  gap: 20px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-top: 20px;

  & .order-link {
    text-decoration: none;
    color: #1e75bb;

    &:hover {
      text-decoration: underline;
    }
  }

  & .btn-group {
    display: flex;
    gap: 20px;
    justify-content: end;

    & .btn {
      padding: 10px 20px;
      height: fit-content;
    }

    & .verify-btn {
      background-color: #e8fff3;
      color: #45b26b;

      svg {
        path {
          fill: #45b26b;
        }
      }
    }

    & .retry-btn {
      background-color: #fff9f6;
      color: #fb651e;

      svg {
        path {
          stroke: #fb651e;
        }
      }
    }

    & .disabled {
      background-color: #f0f0f0;
      color: #777e90;

      svg {
        path {
          fill: #777e90;
        }
      }
    }
  }

  & .details {
    height: inherit;
    display: flex;
    gap: 20px;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;

    & .content {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      border-bottom: 1px solid #f4f4f4;
      padding-bottom: 15px;

      & .header {
        font-weight: 600;
        font-size: 16px;
      }

      & > svg {
        margin-top: 2px;
        width: 20px;
        height: 20px;
      }

      & .address {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
  }

  & .line {
    width: 100%;
    border-bottom: 1px dashed #e8e8e8;
  }

  & .order-section {
    display: flex;
    flex-direction: column;
    gap: 20px;

    & .group-heading {
      font-weight: 700;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 10px;
    }
    & .group {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      & .header {
        color: #64748b;
      }

      & .body {
        display: flex;
        gap: 5px;
        align-items: center;
        color: #282828;
        font-weight: 500;

        & span {
          font-size: 5px;
        }
      }

      & .customer-name {
        color: #1e75bb;
      }
    }
  }
  & .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    background: #fbfbfb;
    padding: 20px;

    & .group {
      & .header {
        color: #64748b;
        font-size: 12px;
      }

      & .body {
        display: flex;
        gap: 5px;
        align-items: center;
        color: #282828;
        font-weight: 500;
        font-size: 18px;
        font-weight: 600;

        & span {
          font-size: 5px;
        }
      }
    }
  }

  @media screen and (max-width: 760px) {
    flex-direction: column;
  }
`;
