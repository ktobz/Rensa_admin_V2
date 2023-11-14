import * as React from "react";
import { format } from "date-fns";
import { useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { MuiButton, MuiTypography, styled } from "@/lib/index";
import { OrderTable } from "@/modules/orders";
import { TotalCard } from "@/components/index";
import CustomSearch from "@/components/input/CustomSearch";
import CustomerService from "@/services/customer-service";
import { IUserData } from "@/types/globalTypes";
import { useIds } from "@/utils/hooks";
import { VerificationStatus } from "@/components/feedback/VerfiedStatus";
import VendgramCustomModal from "@/components/modal/Modal";
import { BlockUserConfirm } from "../components/BlockUserConfirm";
import CustomTabs from "@/components/other/CustomTabs";
import CustomTab from "@/components/other/CustomTab";
import CustomTabPanel from "@/components/other/CustomTabPanel";
import { CustomerTransactionsView } from "./CustomerTransactionsView";
import { TransactionTable } from "@/modules/branches copy/components/TransactionTable";

export function CustomerDetailsView() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { customerId } = useIds();

  const [show, setShow] = React.useState(false);

  const [current, setCurrent] = React.useState(() => {
    return 0;
  });

  const handleChangeIndex = (index: number) => () => {
    setCurrent(index);
  };

  const handleViewTransactions = () => {
    navigate("transactions");
  };

  const { data, isLoading, isError } = useQuery(
    ["user", customerId],
    () =>
      CustomerService.getCustomerDetails(customerId || "").then((res) => {
        const data = res.data?.data;
        return data as IUserData;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: !!customerId,
      initialData: state as IUserData,
    }
  );

  const { data: walletBalance } = useQuery(
    ["customers-wallet", customerId],
    () =>
      CustomerService.getCustomerBalance(customerId || "").then((res) => {
        const data = res.data?.data;
        return data as number;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: !!customerId,
    }
  );

  const handleToggleShow = () => {
    setShow((prev) => !prev);
  };

  const handleUpdateStatus = (callback: () => void) => () => {
    // const ids = updateData.map((data) => data?.id);
    // RiderService.changeVisibility(ids?.[0] || 0)
    //   .then((res) => {
    //     handleRefresh?.();
    //     toast.success(res.data?.message || "");
    //   })
    //   .catch((err) => {
    //     toast.error(err?.response?.data?.message || "");
    //   })
    //   .finally(() => {
    //     callback();
    //   });
  };

  return (
    <PageContent>
      <div className="branch-section">
        <div className="left">
          <div className="header">
            <MuiTypography variant="h3" className="name">
              {data?.firstName || "-"} {data?.lastName || "-"}
            </MuiTypography>
          </div>
          <div className="outlet-info">
            <div className="info-detail">
              <MuiTypography variant="body2" className="title">
                Phone number
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.phoneNumber}
              </MuiTypography>
            </div>
            <div className="info-detail">
              <MuiTypography variant="body2" className="title">
                Email
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.email}
              </MuiTypography>
            </div>
            <div className="info-detail">
              <MuiTypography variant="body2" className="title">
                Username
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.userName}
              </MuiTypography>
            </div>
            <div className="info-detail">
              <MuiTypography variant="body2" className="title">
                Date joined
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.creationTime
                  ? format(new Date(data?.creationTime || ""), "LL MMMM, yyyy")
                  : ""}
              </MuiTypography>
            </div>
            <div className="info-detail">
              <MuiTypography variant="body2" className="title">
                Verified
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                <VerificationStatus
                  style={{
                    padding: "5px 12px",
                    borderRadius: "5px",
                    fontSize: "12px",
                  }}
                  type={data?.emailConfirmed ? "true" : "false"}
                />
              </MuiTypography>
            </div>
          </div>
        </div>
        {/* <TotalCard
          title="Wallet Balance"
          variant="sales"
          className="wallet"
          showFilter={false}
          subAction={{
            name: "view transactions",
            action: handleViewTransactions,
          }}
          defaultValue={walletBalance}
        /> */}
      </div>

      {/* <div className="tab-section">
        <CustomTabs variant="scrollable" value={current || 0} className="tabs">
          <CustomTab
            onClick={handleChangeIndex(0)}
            value={0}
            label="Orders"
            current={current}
          />
          <CustomTab
            onClick={handleChangeIndex(1)}
            value={1}
            label="Products"
            current={current}
          />
          <CustomTab
            onClick={handleChangeIndex(2)}
            value={2}
            label="Branches"
            current={current}
          />
        </CustomTabs>
      </div> */}

      <div className="activities">
        <div className="top-section">
          <CustomTabs
            variant="scrollable"
            value={current || 0}
            className="tabs">
            <CustomTab
              onClick={handleChangeIndex(0)}
              value={0}
              label="Orders"
              current={current}
            />
            <CustomTab
              onClick={handleChangeIndex(1)}
              value={1}
              label="Products"
              current={current}
            />
            <CustomTab
              onClick={handleChangeIndex(2)}
              value={2}
              label="Transactions"
              current={current}
            />
          </CustomTabs>

          <div className="action-section">
            <MuiButton
              color="inherit"
              variant="contained"
              className="btn"
              onClick={handleToggleShow}>
              Block User
            </MuiButton>
          </div>
        </div>
      </div>
      {/* <CustomTabPanel index={current} value={0}>
        <OrderTable
          variant="section"
          page="branches"
          apiFunc={CustomerService.getCustomerOrders}
          id={customerId}
          queryKey="all-customer-orders"
        />
      </CustomTabPanel>
      <CustomTabPanel index={current} value={1}>
        <OrderTable
          variant="section"
          page="branches"
          apiFunc={CustomerService.getCustomerOrders}
          id={customerId}
          queryKey="all-customer-orders"
        />
      </CustomTabPanel>
      <CustomTabPanel index={current} value={2}>
        <TransactionTable
          variant="customer"
          showActionTab={false}
          customerId={customerId}
        />
      </CustomTabPanel> */}

      <VendgramCustomModal
        handleClose={handleToggleShow}
        open={show}
        showClose
        closeOnOutsideClick={false}>
        <BlockUserConfirm
          data={[data]}
          handleAction={handleUpdateStatus}
          handleClose={handleToggleShow}
          action="unblock"
        />
      </VendgramCustomModal>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;

  & .action-section {
    flex: 1;
    max-width: 300px;
    & .btn {
      padding: 10px 20px;
      height: fit-content;
      min-height: fit-content;
      white-space: nowrap;
    }
  }

  & .branch-section {
    display: flex;
    gap: 20px;

    & .btn {
      height: 36px;
    }

    & .left {
      flex: 1;
      width: 100%;
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #f4f4f4;
    }

    & .wallet {
      flex: 1;
      max-width: 300px;
    }

    & .outlet-info {
      display: flex;
      gap: 5px 20px;
      flex-wrap: wrap;

      & .info-detail {
        flex: 1;
      }

      & .body {
        color: #282828;
        font-weight: 500;
        display: flex;
        gap: 10px;
        align-items: center;
      }
      & .title {
        color: #64748b;
        font-weight: 400;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 5px;
      }
    }

    & .header {
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: space-between;
      padding-bottom: 20px;
      /* margin-bottom: 20px; */

      & .name {
        color: #282828;
        font-weight: 500;
        font-size: 18px;
        text-transform: capitalize;
      }
    }
  }
  & .page-title {
    font-size: 30px;
    font-family: "Helvetica";
    font-weight: 500;
  }

  & .activities {
    /* max-width: 1160px; */
    width: 100%;
    margin-top: 45px;

    & .top-section {
      display: flex;
      gap: 20px;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      & .heading {
        font-weight: 600;
        font-size: 18px;
      }

      & .view-all {
        height: fit-content;
        min-height: fit-content;
      }
    }
  }

  @media screen and (max-width: 768px) {
    & .cards {
      flex-direction: column;
    }

    .branch-section {
      flex-direction: column;
    }
  }

  @media screen and (max-width: 596px) {
    & .page-title {
      font-size: calc(12px + 2vw);
    }
    & .subtitle-section {
      flex-direction: column;
      align-items: baseline !important;
    }
  }
`;
