import * as React from "react";
import { MuiIconButton, MuiTypography, styled } from "@/lib/index";
import { IconCopy } from "@/lib/mui.lib.icons";
import { OrderStatus } from "@/components/feedback/OrderStatus";

export function TransactionDetails() {
  return (
    <PageContent>
      <div className="heading">
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Payment Option
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            Refund
          </MuiTypography>
        </div>
        <div className="status">
          <OrderStatus type="completed" />
        </div>
      </div>
      <div className="line" />

      <div className="order-section">
        <div className="group">
          <MuiTypography variant="body1" className="header">
            User full name
          </MuiTypography>
          <MuiTypography variant="body2" className="body customer-name">
            Josh Osazuwa
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Amount
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            ₦32,000.00
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Date created
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            25 Feb. 2023, 12:34 PM
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Transaction ref.
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            EYVV3517616490000080{" "}
            <MuiIconButton className="copy-btn">
              <IconCopy />
            </MuiIconButton>
          </MuiTypography>
        </div>

        <div className="group">
          <MuiTypography variant="body1" className="header">
            Order ID
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            #3028364550
          </MuiTypography>
        </div>

        <div className="group">
          <MuiTypography variant="body1" className="header">
            Beneficiary account
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            3028364550
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Beneficiary bank
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            First Bank plc
          </MuiTypography>
        </div>
        <div className="group">
          <MuiTypography variant="body1" className="header">
            Beneficiary name
          </MuiTypography>
          <MuiTypography variant="body2" className="body">
            Josh Osazuwa
          </MuiTypography>
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
