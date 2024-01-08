import * as React from "react";
import { format } from "date-fns";

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
  IconBranches,
  IconCopyFilled,
  IconCreditCard,
  IconEarning,
  IconLocation,
  IconPetrol,
  IconShipping,
  IconTicket,
} from "@/lib/mui.lib.icons";
import { useQuery, useQueryClient } from "react-query";
import OrderService from "@/services/order-service";
import { IOrderData, IOrderDetails, IStatus } from "@/types/globalTypes";
import { UserDetailCard } from "@/components/card/UserCard";
import VendgramCustomModal from "@/components/modal/Modal";
import { AssignRiderForm } from "../components/AssignRiderForm";
import { OrderStatus } from "@/components/feedback/OrderStatus";
import { SettlementStatus } from "@/modules/settlements/components/OrderStatus";
import { formatCurrency, formatDate, getIdName } from "@/utils/helper-funcs";
import useCachedDataStore from "@/config/store-config/lookup";
import { OrderConfirmation } from "../components/OrderConfirmation";
import ConfigService from "@/services/config-service";
import useCopyToClipboard from "@/utils/useCopyToClipboard";

export function OrderDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state } = useLocation();
  const [orderAction, setOrderAction] = React.useState<"confirm" | "cancel">(
    "confirm"
  );
  const [, copy] = useCopyToClipboard();

  const { orderId } = useParams<{ orderId: string }>();
  const { catalogueOrderStatus } = useCachedDataStore(
    (state) => state.cache.lookup
  );
  const [show, setShow] = React.useState({
    modal: false,
    tooltip_1: false,
    tooltip_2: false,
  });

  const { data } = useQuery(
    ["order-details", orderId],
    () =>
      OrderService.getOrderDetails(orderId || "").then((res) => {
        const data = res.data.result;
        return data;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: !!orderId,
      // initialData: state as any,
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

  const handleToggleShow = () => {
    setShow((prev) => ({ ...prev, modal: !prev.modal }));
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(["order-details"]);
    setShow({ modal: false, tooltip_1: false, tooltip_2: false });
  };

  const handleSetAction = (status: "cancel" | "confirm") => () => {
    setOrderAction(status);
    handleToggleShow();
  };

  const handleCancelOrder = (cb: () => void) => () => {
    // OrderService.cancelOrder();
  };

  const handleConfirmOrder = (cb: () => void) => () => {};

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

  return (
    <PageContent>
      <div className="left">
        <div className="heading">
          <MuiTypography variant="h3" className="title">
            Order <b style={{ color: "#1E75BB" }}>#{data?.orderNumber}</b>
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
            Order info
          </MuiTypography>

          <div className="group">
            <MuiTypography variant="body1" className="header">
              Date Created
            </MuiTypography>
            <MuiTypography variant="body2" className="body">
              {/* {data ? formatDate(data?.) : ""} */} 'no date'
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
              <MuiButton variant="text" color="primary" className="view-btn">
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
              <MuiButton variant="text" className="view-btn" color="primary">
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
            <IconBike className="delivery-method" />
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
                  Delivery fee (bike/van):
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
              {/* <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Refunded with delivery
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  Yes
                </MuiTypography>
              </div> */}

              <div className="line" />

              <div className="delivery-status">
                <div className="section delivery">
                  <MuiTypography variant="body1" className="title">
                    Delivery status
                  </MuiTypography>
                  <MuiTypography variant="body2" className="body">
                    -
                  </MuiTypography>
                </div>
                <div className="section reason">
                  <MuiTypography variant="body1" className="title">
                    Reason
                  </MuiTypography>
                  <MuiTypography variant="body2" className="body">
                    -
                  </MuiTypography>
                </div>
              </div>

              <div className="actions">
                <MuiButton
                  className="btn"
                  onClick={handleSetAction("cancel")}
                  color="primary"
                  variant="outlined">
                  Cancel order
                </MuiButton>
                <MuiButton
                  className="btn"
                  onClick={handleSetAction("confirm")}
                  color="success"
                  variant="contained">
                  Confirm order
                </MuiButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VendgramCustomModal
        closeOnOutsideClick={false}
        handleClose={handleToggleShow}
        open={show.modal}
        alignTitle="left"
        title=""
        showClose>
        <OrderConfirmation
          data={data}
          handleClose={handleToggleShow}
          action={orderAction}
          handleAction={
            orderAction === "cancel" ? handleCancelOrder : handleConfirmOrder
          }
        />
        {/* <AssignRiderForm
          mode={data?.rider ? "re-assign" : "assign"}
          orderId={orderId || ""}
          refreshQuery={handleRefresh}
        /> */}
      </VendgramCustomModal>
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

  & .delivery-status {
    border-left: 7px solid tomato;
    display: flex;
    gap: 20px;
    align-items: center;
    padding-left: 10px;

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
    margin-top: 30px;

    & .btn {
      height: fit-content;
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
`;
