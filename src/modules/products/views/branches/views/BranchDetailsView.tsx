import * as React from "react";
import { MuiButton, MuiCardMedia, MuiTypography, styled } from "@/lib/index";

import { OrderTable } from "@/modules/orders";
import { useNavigate, useParams } from "react-router-dom";
import { TotalCard } from "@/components/index";
import {
  IconDefaultUserImage,
  IconEdit,
  IconLocManager,
  IconLocation,
  IconVisibility,
} from "@/lib/mui.lib.icons";
import { CustomSwitch } from "@/components/input/CustomSwitch";
import VendgramCustomModal from "@/components/modal/Modal";
import { BranchEntryFormView } from "../components/BranchEntryForm";
import { ManagerProfileView } from "../components/ManagerProfileView";
import { BranchVisibilityConfirm } from "../components/BranchVisibilityConfirm";
import { BranchInventory } from "../components/BranchInventory";
import BranchService from "@/services/branches.service";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import OrderService from "@/services/order-service";
import { IOrderMetrics } from "@/types/globalTypes";
import OtherService from "@/services/order-service";
import { useIds } from "@/utils/hooks";

type TShowMode = "branch" | "info" | "inventory" | "visibility";

const productData = {
  id: "43589",
  customer: "Timothy OrbJamesik",
  created_at: new Date().toJSON(),
  scheduled_at: new Date().toJSON(),
  branch: "James Branch",
  amount: 23000,
  status: false,
};

export function BranchDetailsView() {
  const { partnerId, branchId } = useIds();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [values, setValues] = React.useState<any>({
    sales: "all_time",
    orders: "all_time",
  });
  const [show, setShow] = React.useState({
    branch: false,
    inventory: false,
    info: false,
    visibility: false,
  });
  const [storeData, setStoreData] = React.useState<any | typeof productData>(
    productData
  );

  const handleToggleShow = (name: TShowMode) => () => {
    setShow((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleClose = () => {
    setShow({
      branch: false,
      inventory: false,
      info: false,
      visibility: false,
    });
  };

  const handleViewMore = () => {
    navigate("orders");
  };
  const handleInitVisibility = () => {
    handleToggleShow("visibility")();
  };

  const handleUpdateData = () => {
    // setStoreData((prev:any) => ({ ...prev, status: !prev.status }));
  };

  const { data, isLoading, isError } = useQuery(
    ["branch-details", branchId, partnerId],
    () =>
      BranchService.getBranchDetails(partnerId, branchId || 0).then((res) => {
        const data = res.data?.data;

        return data;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: !!branchId,
    }
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries(["branch-details", branchId, partnerId]);
    handleClose();
  };

  const handleUpdateVisibility = (callback: () => void) => () => {
    BranchService.changeVisibility(branchId || 0)
      .then((res) => {
        handleRefresh?.();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      })
      .finally(() => {
        callback();
      });
  };

  const { data: periodsData, isSuccess } = useQuery(
    ["periods"],
    () =>
      OtherService.getPeriods().then((res) => {
        const data = res.data?.data;

        return data;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const { data: orderMetrics } = useQuery(
    ["periods", values.branch, values.orders, values.sales],
    () =>
      OrderService.dashboardMetrics({
        top_selling_branch: values.branch,
        totat_order_period: values.orders,
        totat_sales_period: values.sales,
      }).then((res) => {
        const data = res.data?.data;

        return data as IOrderMetrics;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: isSuccess,
      keepPreviousData: true,
    }
  );

  return (
    <PageContent>
      <div className="branch-section">
        <div className="left">
          <div className="header">
            <MuiTypography variant="h3" className="name">
              {data?.name}
            </MuiTypography>

            <MuiButton
              variant="contained"
              onClick={handleToggleShow("branch")}
              startIcon={<IconEdit className="icon edit-icon" />}
              className="edit-btn btn">
              Edit Branch
            </MuiButton>
          </div>
          <div className="outlet-info">
            <div className="location">
              <div className="loc-left">
                <MuiTypography variant="body2" className="title">
                  <IconLocation /> Location
                </MuiTypography>
                <MuiTypography variant="body2" className="body">
                  {data?.location}
                </MuiTypography>
              </div>
              <div className="loc-right">
                <MuiTypography variant="body2" className="body">
                  Availability:
                </MuiTypography>
                <div className="actions">
                  <CustomSwitch
                    color="primary"
                    defaultChecked={data?.availabilty}
                    defaultValue={data?.availabilty}
                    value={data?.availabilty}
                    checked={data?.availabilty}
                    onClick={handleInitVisibility}
                    onChange={(e) => e.preventDefault()}
                  />

                  <span className="label publish-label">
                    {data?.availabilty ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            </div>
            {data?.branch_manager && (
              <div className="manager">
                <MuiTypography variant="body2" className="title">
                  <IconLocManager /> Branch Manager
                </MuiTypography>
                <div className="body">
                  {!data?.branch_manager?.profile_image ? (
                    <MuiCardMedia
                      component="img"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <IconDefaultUserImage className="user-icon" />
                  )}

                  <MuiTypography variant="body2">
                    {data?.branch_manager?.full_name}
                  </MuiTypography>
                </div>

                <MuiButton
                  className="view-profile btn"
                  color="secondary"
                  onClick={handleToggleShow("info")}
                  variant="text">
                  View profile
                </MuiButton>
              </div>
            )}
          </div>
        </div>
        <div className="right">
          <div className="header">
            <MuiTypography variant="h3" className="name">
              Branch summary
            </MuiTypography>

            <MuiButton
              variant="contained"
              onClick={handleToggleShow("inventory")}
              startIcon={<IconVisibility className="icon view-icon" />}
              className="view-btn btn">
              View Inventory
            </MuiButton>
          </div>
          <div className="cards">
            <TotalCard
              title="Total Sales"
              variant="sales"
              defaultOptions={periodsData}
              name="sales"
              value={values.sales}
              defaultValue={orderMetrics?.total_sales}
            />
            <TotalCard
              title="Total Orders"
              variant="order"
              defaultOptions={periodsData}
              name="orders"
              value={values.orders}
              defaultValue={orderMetrics?.total_orders}
            />
          </div>
        </div>
      </div>

      <div className="activities">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Branch Orders
          </MuiTypography>
          <MuiButton
            onClick={handleViewMore}
            className="view-all"
            variant="text">
            View all
          </MuiButton>
        </div>

        <OrderTable variant="section" page="branches" />
      </div>

      <VendgramCustomModal
        handleClose={handleToggleShow("branch")}
        open={show.branch}
        alignTitle="left"
        title={"Edit Branch"}
        showClose>
        <BranchEntryFormView
          mode={"edit"}
          initData={data}
          handleClose={handleClose}
          refreshQuery={handleRefresh}
          partnerId={partnerId}
        />
      </VendgramCustomModal>

      <VendgramCustomModal
        title="Branch Manager"
        handleClose={handleToggleShow("info")}
        open={show.info}
        showClose>
        <ManagerProfileView initData={data?.branch_manager || {}} />
      </VendgramCustomModal>

      <VendgramCustomModal
        handleClose={handleToggleShow("visibility")}
        open={show.visibility}
        showClose={false}>
        <BranchVisibilityConfirm
          data={[data]}
          action={"close"}
          handleClose={handleToggleShow("visibility")}
          handleUpdateData={handleUpdateVisibility}
        />
      </VendgramCustomModal>

      <VendgramCustomModal
        title="Branch Inventory"
        handleClose={handleToggleShow("inventory")}
        open={show.inventory}
        showClose>
        <BranchInventory
          // data={storeData}
          branchId={branchId}
          handleClose={handleToggleShow("inventory")}
          partnerId={partnerId}
        />
      </VendgramCustomModal>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  /* padding: 40px; */
  margin: auto;
  position: relative;

  & .branch-section {
    display: flex;
    gap: 20px;

    & .btn {
      height: 36px;
    }

    & .left,
    .right {
      flex: 1;
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #f4f4f4;
    }

    & .outlet-info {
      & .location {
        display: flex;
        gap: 30px;
        justify-content: space-between;
        margin-bottom: 20px;
        align-items: baseline;
        flex-wrap: wrap;
      }
      & .loc-left {
      }
      & .loc-right {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      & .manager {
        & .user-icon {
          width: 30px;
          height: 30px;
        }

        & .view-profile {
          padding: 0px;
          height: fit-content;
        }
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
      margin-bottom: 20px;
      border-bottom: 1px solid #f4f4f4;

      & .name {
        color: #282828;
        font-weight: 500;
        font-size: 18px;
        text-transform: capitalize;
      }

      & .view-btn {
        background-color: #e8f1f8;
        color: #1e75bb;
      }
      & .edit-btn {
        background-color: #ffc5021a;
        color: #ffc502;
      }
    }

    & .location {
      & .actions {
        display: flex;
        gap: 10px;
        align-items: center;
        font-weight: 500;
      }
    }
  }
  & .page-title {
    font-size: 30px;
    font-family: "Helvetica";
    font-weight: 500;
  }

  & .cards {
    display: grid;
    grid-template-rows: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  & .activities {
    /* max-width: 1160px; */
    width: 100%;
    margin-top: 45px;

    & .top-section {
      display: flex;
      gap: 20px;
      /* justify-content: space-between; */
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
