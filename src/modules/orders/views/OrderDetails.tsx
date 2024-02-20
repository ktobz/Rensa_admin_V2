import * as React from "react";
import {
  MuiButton,
  MuiCardMedia,
  MuiIconButton,
  MuiTooltip,
  MuiTypography,
  styled,
} from "@/lib/index";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IconBike,
  IconCopyFilled,
  IconEarning,
  IconTicket,
  IconVan,
} from "@/lib/mui.lib.icons";
import { useQuery, useQueryClient } from "react-query";
import OrderService from "@/services/order-service";
import { IStatus } from "@/types/globalTypes";

import AppCustomModal from "@/components/modal/Modal";

import { OrderStatus } from "@/components/feedback/OrderStatus";
import { formatCurrency, formatDate, getIdName } from "@/utils/helper-funcs";
import useCachedDataStore from "@/config/store-config/lookup";
import { OrderConfirmation } from "../components/OrderConfirmation";
import ConfigService from "@/services/config-service";
import useCopyToClipboard from "@/utils/useCopyToClipboard";
import { toast } from "react-toastify";
import { OrderPayoutConfirmation } from "../components/OrderPayoutConfirmation";

const mapPickupMethod: { [key: number]: React.ReactNode } = {
  1: <IconBike className="delivery-method" />,
  2: <IconVan className="delivery-method" />,
};

export function OrderDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state } = useLocation();
  const [orderAction, setOrderAction] = React.useState<"confirm" | "cancel">(
    "confirm"
  );
  const [, copy] = useCopyToClipboard();

  const { orderId } = useParams<{ orderId: string }>();
  const {
    catalogueOrderStatus,
    deliveryFeePickupMethod,
    catalogueOrderCancellationStatus,
  } = useCachedDataStore((state) => state.cache.lookup);
  const [show, setShow] = React.useState({
    modal: false,
    payout: false,
    tooltip_1: false,
    tooltip_2: false,
  });

  const { data, isLoading } = useQuery(
    ["order-details", orderId],
    () =>
      (orderId?.includes("RN_")
        ? OrderService.getOrderDetailsByTransactionRef(orderId || "")
        : orderId?.includes("RN")
        ? OrderService.getOrderDetailsByOrderNumber(orderId || "")
        : OrderService.getOrderDetails(orderId || "")
      )
        .then((res) => {
          const data = res.data.result;
          return data;
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "An error occurred");
          console.error(err);
        }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: !!orderId,
    }
  );

  const { data: serviceFee, isLoading: serviceIsLoading } = useQuery(
    ["service-fee"],
    () =>
      ConfigService.getServiceFeeSettings().then((res) => {
        const data = res.data?.result;
        return data?.[0] || {};
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleToggleShow = (modal: "modal" | "payout") => () => {
    setShow((prev) => ({ ...prev, [modal]: !prev[modal] }));
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(["order-details", orderId]);
    setShow({
      modal: false,
      tooltip_1: false,
      tooltip_2: false,
      payout: false,
    });
  };

  const handleSetAction =
    (status: "cancel" | "confirm", modal: "modal" | "payout") => () => {
      setOrderAction(status);
      handleToggleShow(modal)();
    };

  const handleCancelOrder =
    (cb: () => void, reason = "") =>
    async () => {
      try {
        const { data: resData, status } = await OrderService.cancelOrder({
          cancellationReason: reason,
          orderNumber: data?.orderNumber || "",
        });
        toast.success(resData?.data?.message);
        handleRefresh();
        cb?.();
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
        cb?.();
      }
    };

  const handleConfirmOrder =
    (cb: () => void, reason = "") =>
    async () => {
      try {
        const { data: resData, status } = await OrderService.confirmOrder(
          data?.orderNumber || ""
        );
        toast.success(resData?.data?.message);
        handleRefresh();
        cb?.();
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
        cb?.();
      }
    };

  const handleRejectRefund =
    (cb: () => void, reason = "") =>
    async () => {
      try {
        const { data: resData, status } = await OrderService.rejectRefund({
          comment: reason,
          orderNumber: data?.orderNumber || "",
          approve: false,
        });
        toast.success(resData?.data?.message);
        handleRefresh();
        cb?.();
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
        cb?.();
      }
    };

  const handleAcceptRefund =
    (cb: () => void, reason = "") =>
    async () => {
      try {
        const { data: resData, status } = await OrderService.acceptRefund({
          comment: reason,
          orderNumber: data?.orderNumber || "",
          approve: true,
        });
        toast.success(resData?.data?.message);
        handleRefresh();
        cb?.();
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
        cb?.();
      }
    };

  const handleViewDetails = () => {
    navigate(`/app/marketplace/${data?.catalogueId}`);
  };

  const handleTooltipClose = () => {
    setShow((prev) => ({ ...prev, tooltip_1: false, tooltip_2: false }));
  };

  const handleTooltipOpen = (name: "tooltip_1" | "tooltip_2") => () => {
    setShow((prev) => ({ ...prev, [name]: true }));
    copy(
      name === "tooltip_1"
        ? data?.pickUpLocation?.location || ""
        : data?.dropOffLocation?.location || ""
    );
  };

  const handleCopyLink = (name: "tooltip_1" | "tooltip_2") => () => {
    handleTooltipOpen(name)();

    setTimeout(() => handleTooltipClose(), 1000);
  };

  const handleVisitUser = (userId: string) => () => {
    if (userId) {
      navigate(`/app/users/${userId}`);
    }
  };

  const showActions = data?.status === 1 && !isLoading;

  const showReasonsActions = data?.status === 5 && !isLoading;
  const cancelAcceptanceStatus =
    data && data?.cancellationRequests?.[0]?.status > 2
      ? "rejected"
      : data && data?.cancellationRequests?.[0]?.status > 1
      ? "confirmed"
      : "";

  return (
    <PageContent>
      <div className="left">
        <div className="heading">
          <MuiTypography variant="h3" className="title">
            Order{" "}
            <b style={{ color: "#1E75BB", whiteSpace: "pre-wrap" }}>
              {data?.orderNumber}
            </b>
          </MuiTypography>
          <div className="status">
            <span className="text">Status</span>{" "}
            <OrderStatus
              type={
                getIdName(data?.status || 1, catalogueOrderStatus) as IStatus
              }
            />
          </div>
        </div>
        <div className="order-section">
          <MuiTypography variant="h4" className="group-heading">
            <span>Order info </span>
            {showActions && (
              <div className="actions">
                <MuiButton
                  className="btn"
                  onClick={handleSetAction("cancel", "modal")}
                  color="primary"
                  variant="outlined">
                  Cancel order
                </MuiButton>
                <MuiButton
                  className="btn accept-btn"
                  onClick={handleSetAction("confirm", "modal")}
                  color="success"
                  variant="contained">
                  Confirm order
                </MuiButton>
              </div>
            )}
          </MuiTypography>

          <div className="group">
            <MuiTypography variant="body1" className="header">
              Date Created
            </MuiTypography>
            <MuiTypography variant="body2" className="body">
              {data ? formatDate(data?.creationTime) : ""}
            </MuiTypography>
          </div>
          <div className="group">
            <MuiTypography variant="body1" className="header">
              Scheduled Date
            </MuiTypography>
            <MuiTypography variant="body2" className="body">
              {/* <IconShipping style={{ color: "#F05B2A" }} /> */}
              {data ? formatDate(data?.deliveryDate) : ""}
            </MuiTypography>
          </div>
          {/* <div className="group">
            <MuiTypography variant="body1" className="header">
              Payment Method
            </MuiTypography>
            <MuiTypography
              variant="body2"
              className="body"
              style={{ textTransform: "capitalize" }}>
              <IconCreditCard style={{ color: "#1E75BB" }} />{" "}
              {data?.payment_option?.name?.toLowerCase()} Payment
            </MuiTypography>
          </div> */}
        </div>

        <div className="order-info">
          <div className="order-section">
            <div className="group-heading">
              <MuiTypography variant="h4" className="heading">
                Buyer Info
              </MuiTypography>
              <MuiButton
                variant="text"
                color="primary"
                onClick={handleVisitUser(data?.buyerUserId || "")}
                className="view-btn">
                View details
              </MuiButton>
            </div>

            <div className="group">
              <MuiTypography variant="body1" className="header">
                Full name
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.buyerInfo?.firstName} {data?.buyerInfo?.lastName}
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Email
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.buyerInfo?.emailAddress}
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Username
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.buyerInfo?.username}
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Phone number
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.buyerInfo?.phoneNumber}
              </MuiTypography>
            </div>
          </div>
          <div className="order-section">
            <div className="group-heading">
              <MuiTypography variant="h4" className="heading">
                Seller Info
              </MuiTypography>
              <MuiButton
                variant="text"
                className="view-btn"
                color="primary"
                onClick={handleVisitUser(data?.sellerUserId || "")}>
                {" "}
                View details{" "}
              </MuiButton>
            </div>

            <div className="group">
              <MuiTypography variant="body1" className="header">
                Full name
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.sellerInfo?.firstName} {data?.sellerInfo?.lastName}
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Email
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.sellerInfo?.emailAddress}
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Username
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.sellerInfo?.username}
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Phone number
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.sellerInfo?.phoneNumber}
              </MuiTypography>
            </div>
          </div>
        </div>

        <div className="order-section">
          <MuiTypography variant="h4" className="group-heading">
            Delivery Info
          </MuiTypography>

          <div className="delivery-data">
            <div className="timeline">
              <div className="pos-x"></div>
              <div className="line"></div>
              <div className="pos-y"></div>
            </div>

            <div className="delivery-content">
              <div className="address-data">
                <div className="group">
                  <MuiTypography variant="body1" className="header">
                    Pickup location
                  </MuiTypography>
                  <MuiTypography variant="body2" className="body">
                    {data?.pickUpLocation?.location}
                  </MuiTypography>
                </div>

                <MuiTooltip
                  arrow
                  PopperProps={{
                    disablePortal: true,
                    sx: {
                      ".MuiTooltip-tooltip": {
                        color: "#fff",
                        background: "#030949",
                      },
                    },
                  }}
                  onClose={handleTooltipClose}
                  open={show.tooltip_1}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title="Copied">
                  <MuiIconButton onClick={handleCopyLink("tooltip_1")}>
                    <IconCopyFilled />
                  </MuiIconButton>
                </MuiTooltip>
              </div>
              <div className="delivery-data">
                <div className="group">
                  <MuiTypography variant="body1" className="header">
                    Drop-off location
                  </MuiTypography>
                  <MuiTypography variant="body2" className="body">
                    {data?.dropOffLocation?.location}
                  </MuiTypography>
                </div>
                <MuiTooltip
                  arrow
                  PopperProps={{
                    disablePortal: true,
                    sx: {
                      ".MuiTooltip-tooltip": {
                        color: "#fff",
                        background: "#030949",
                      },
                    },
                  }}
                  onClose={handleTooltipClose}
                  open={show.tooltip_2}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title="Copied">
                  <MuiIconButton onClick={handleCopyLink("tooltip_2")}>
                    <IconCopyFilled />
                  </MuiIconButton>
                </MuiTooltip>
              </div>
            </div>
            {mapPickupMethod?.[data?.pickupMethod || 1]}
          </div>
        </div>
      </div>
      <div className="column-right">
        <div className="right">
          <div className="heading">
            <MuiTypography variant="h3" className="title">
              Order Items
            </MuiTypography>
            <div className="status">
              <MuiButton
                variant="text"
                className="view-btn"
                onClick={handleViewDetails}
                color="primary">
                {" "}
                View listing details{" "}
              </MuiButton>
            </div>
          </div>

          <div className="details">
            <div className="product">
              <div className="img-wrapper">
                <MuiCardMedia
                  component="img"
                  src={data?.catalogueCoverPhoto}
                  className="product-img"
                />
              </div>

              <div className="product-content">
                {/* <SettlementStatus
                  type="pending"
                  size="small"
                  variant="secondary"
                /> */}
                <MuiTypography variant="body1" className="name">
                  {data?.catalogueName}
                </MuiTypography>
                <MuiTypography variant="body1" className="price">
                  Final price:{" "}
                  <span>
                    ₦
                    {formatCurrency({
                      amount: data?.buyerPayment?.buyerPayment || 0,
                      style: "decimal",
                    })}{" "}
                  </span>
                </MuiTypography>
              </div>
            </div>

            <div className="price-summary">
              <div className="line" />
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  <IconTicket /> Buyer's Payment{" "}
                  {/* <SettlementStatus
                    type="active"
                    size="small"
                    style={{ marginLeft: "10px" }}
                  /> */}
                </MuiTypography>
                <MuiTypography variant="body1" className="vendor-total">
                  ₦
                  {formatCurrency({
                    amount: data?.buyerPayment?.buyerPayment || 0,
                    style: "decimal",
                  })}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Item Amount:
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦
                  {formatCurrency({
                    amount: data?.buyerPayment?.itemAmount || 0,
                    style: "decimal",
                  })}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Service fee ({serviceFee?.buyerServiceFee}%):
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦
                  {formatCurrency({
                    amount: data?.buyerPayment?.buyerServiceFee || 0,
                    style: "decimal",
                  })}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Delivery fee (
                  {getIdName(data?.pickupMethod || 1, deliveryFeePickupMethod)}
                  ):
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦
                  {formatCurrency({
                    amount: data?.buyerPayment?.maxDeliveryFee || 0,
                    style: "decimal",
                  })}
                </MuiTypography>
              </div>

              <div className="line" />
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  <IconTicket /> Seller's Settlement{" "}
                  {/* <SettlementStatus
                    type="closed"
                    size="small"
                    style={{ marginLeft: "10px" }}
                  /> */}
                </MuiTypography>
                <MuiTypography variant="body1" className="vendor-total">
                  ₦
                  {formatCurrency({
                    amount: data?.sellerPayment?.sellerSettlement || 0,
                    style: "decimal",
                  })}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Item Amount:
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦
                  {formatCurrency({
                    amount: data?.sellerPayment?.itemAmount || 0,
                    style: "decimal",
                  })}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Service fee ({serviceFee?.sellerServiceFee}%):
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦
                  {formatCurrency({
                    amount: data?.sellerPayment?.sellerServiceFee || 0,
                    style: "decimal",
                  })}
                </MuiTypography>
              </div>

              <div className="line" />
              <div className="price-line earnings">
                <MuiTypography variant="body1" className="entry">
                  <IconEarning /> Sales Revenue
                </MuiTypography>
                <MuiTypography variant="body1" className="grand-total">
                  ₦
                  {formatCurrency({
                    amount: data?.salesRevenue || 0,
                    style: "decimal",
                  })}
                </MuiTypography>
              </div>

              <div className="line" />

              <div className="delivery-status">
                <div className="section reason">
                  <MuiTypography variant="body1" className="title">
                    Reason
                  </MuiTypography>
                  <MuiTypography variant="body2" className="body">
                    {data?.cancellationRequests?.[0]?.cancellationReason || "-"}
                  </MuiTypography>
                </div>
              </div>

              {!!cancelAcceptanceStatus && (
                <div className="cancel-status">
                  <div className={`status ${cancelAcceptanceStatus}`}>
                    <MuiTypography variant="body1" className="status-text">
                      {getIdName(
                        data?.cancellationRequests?.[0]?.status || 0,
                        catalogueOrderCancellationStatus
                      )}{" "}
                      Refund
                    </MuiTypography>
                  </div>
                </div>
              )}

              {showReasonsActions && (
                <div className="actions">
                  <MuiButton
                    className="btn"
                    onClick={handleSetAction("cancel", "payout")}
                    color="primary"
                    variant="outlined">
                    Reject refund
                  </MuiButton>
                  <MuiButton
                    className="btn accept-btn"
                    onClick={handleSetAction("confirm", "payout")}
                    color="success"
                    variant="contained">
                    Accept refund
                  </MuiButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AppCustomModal
        closeOnOutsideClick={false}
        handleClose={handleToggleShow("modal")}
        open={show.modal}
        alignTitle="left"
        title=""
        showClose>
        <OrderConfirmation
          data={data}
          handleClose={handleToggleShow("modal")}
          action={orderAction}
          handleAction={
            orderAction === "cancel" ? handleCancelOrder : handleConfirmOrder
          }
        />
      </AppCustomModal>

      <AppCustomModal
        closeOnOutsideClick={false}
        handleClose={handleToggleShow("payout")}
        open={show.payout}
        alignTitle="left"
        title=""
        showClose>
        <OrderPayoutConfirmation
          data={data}
          handleClose={handleToggleShow("payout")}
          action={orderAction}
          handleAction={
            orderAction === "cancel" ? handleRejectRefund : handleAcceptRefund
          }
        />
      </AppCustomModal>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
  display: flex;
  gap: 20px;
  height: auto;

  & .cancel-status {
    & .status {
      padding: 10px;
      width: fit-content;
      border-radius: 5px;
    }

    & .rejected {
      background: #fff5f8;

      & .status-text {
        color: #f53139;
        font-weight: 500;
      }
    }
    & .confirmed {
      background: #e8fff3;

      & .status-text {
        color: #45b26b;
        font-weight: 500;
      }
    }
  }

  & .delivery-status {
    border-left: 7px solid tomato;
    display: flex;
    gap: 20px;
    align-items: center;
    padding-left: 10px;
    margin-bottom: 30px;

    & .section {
      display: flex;
      gap: 10px;
      flex-direction: column;
      & .title {
        color: #64748b;
        font-size: 14px;
      }
    }
  }

  & .actions {
    display: flex;
    gap: 10px;
    align-items: center;
    /* margin-top: 30px; */

    & .btn {
      height: fit-content;
    }

    & .accept-btn {
      background: #45b26b;
      color: #fff;
    }
  }

  .delivery-data {
    display: grid;
    grid-template-columns: 20px 1fr 120px;
    justify-content: center;
    align-items: center;
    gap: 15px;

    & .delivery-method {
      justify-self: center;
    }

    & .delivery-data,
    & .address-data {
      display: flex;
      align-items: center;

      button {
        height: fit-content;
      }
    }
    & .group {
      flex: 1;
    }

    & .delivery-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    & .timeline {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-self: center;

      height: 60%;

      & .pos-x,
      & .pos-y {
        width: 10px;
        height: 10px;
        background: #f7992b;
        border-radius: 50%;
      }

      & .pos-y {
        background: #45b26b;
      }

      & .line {
        width: 0px;
        border-left: 2px dashed #78849e4a;
        flex: 1;
        stroke-dashoffset: 80;
        line-cap: round;
        /* background-color: #78849e4a; */
      }
    }
  }

  & .product {
    display: flex;
    width: 100%;
    min-height: 100px;
    height: 100px;

    border-radius: 10px;
    overflow: hidden;
    align-items: center;
    border: 1px solid #f0f0f066;

    & .img-wrapper {
      width: 100px;
      height: 200px;
      object-fit: cover;
      background-color: #f0f0f066;
      /* flex: 1; */
      /* max-width: 100px; */

      & .product-img {
        width: 100%;
        height: 100%;
      }
    }

    & .product-content {
      flex: 1;
      padding: 20px;
      & .name {
        color: #380719;
        font-weight: 600;
        margin: 8px 0 15px;
      }

      & .price {
        color: #b1b5c3;
        font-size: 12px;

        span {
          font-size: 14px;
          color: #380719;
          font-weight: 600;
        }
      }
    }
  }

  & .order-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 30px;
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

    & .price-summary {
      & .earnings {
        background-color: #f1fff8;
        padding: 8px 10px;
        border-radius: 10px;
      }
      & .price-line {
        display: flex;
        gap: 20px;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0;

        & .entry {
          color: #64748b;
          display: flex;
          gap: 5px;
          align-items: center;
        }

        & .grand-total {
          color: #05a357;
          font-weight: 700;
        }
      }

      & .line {
        width: 100%;
        border-bottom: 1px dashed #e8e8e8;
        margin: 20px 0;
      }

      & .status-btn {
        width: 100%;
        margin-top: 20px;
        color: #05a357;
        background: #05a3571a;
      }
    }
  }

  & .left,
  & .right {
    height: inherit;
    min-height: fit-content;
    flex: 1;
    border: 1px solid #f4f4f4;
    border-radius: 5px;
    padding: 20px 15px;

    & .title {
      font-weight: 700;
      font-size: 20px;
    }
  }

  & .left {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  & .right {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  & .order-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;

    & .group-heading {
      font-weight: 700;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      & .heading {
        font-weight: 600;
        font-size: 16px;
      }
    }
    & .group {
      & .header {
        color: #64748b;
        font-size: 13px;
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
    }
  }

  & .view-btn {
    padding: 0;
    min-height: fit-content;
    height: fit-content;
  }

  & .column-right {
    flex: 1;
  }

  & .left,
  & .right {
    & .heading,
    & .status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;

      & .text {
        color: #64748b;
      }
    }
  }

  @media screen and (max-width: 760px) {
    flex-direction: column;
  }

  @media screen and (max-width: 620px) {
    & .order-info {
      flex-direction: column;
    }

    & .delivery-method {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    & .left {
      & .heading {
        flex-direction: column;
      }
    }
  }
`;
