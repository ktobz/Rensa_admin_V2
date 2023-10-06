import * as React from "react";
import { format } from "date-fns";

import {
  MuiButton,
  MuiCardMedia,
  MuiIconButton,
  MuiTypography,
  styled,
} from "@/lib/index";
import { useLocation, useParams } from "react-router-dom";
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
import { IOrderDetails, IStatus } from "@/types/globalTypes";
import { UserDetailCard } from "@/components/card/UserCard";
import VendgramCustomModal from "@/components/modal/Modal";
import { AssignRiderForm } from "../components/AssignRiderForm";
import { OrderStatus } from "@/components/feedback/OrderStatus";
import { SettlementStatus } from "@/modules/settlements/components/OrderStatus";

export function OrderDetails() {
  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { orderId } = useParams<{ orderId: string }>();
  const [show, setShow] = React.useState(false);

  const { data } = useQuery(
    ["order-details", orderId],
    () =>
      OrderService.getOrderDetails(orderId || "").then((res) => {
        const data = res.data?.data;
        return data as IOrderDetails;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: !!orderId,
      initialData: state as IOrderDetails,
    }
  );

  const handleToggleShow = () => {
    setShow((prev) => !prev);
  };
  const handleRefresh = () => {
    queryClient.invalidateQueries(["order-details"]);
    setShow(false);
  };

  return (
    <PageContent>
      <div className="left">
        <div className="heading">
          <MuiTypography variant="h3" className="title">
            Order <b style={{ color: "#1E75BB" }}>#{data?.order_id}</b>
          </MuiTypography>
          <div className="status">
            <span className="text">Status</span>{" "}
            <OrderStatus
              type={(data?.status?.toLowerCase() || "new") as IStatus}
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
              {data
                ? format(new Date(data?.created_at || ""), "LL MMMM, yyyy")
                : ""}
            </MuiTypography>
          </div>
          <div className="group">
            <MuiTypography variant="body1" className="header">
              Scheduled Date
            </MuiTypography>
            <MuiTypography variant="body2" className="body">
              <IconShipping style={{ color: "#F05B2A" }} />
              {data?.delivery_pickup_date}
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
                Timothy Obrik
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Email
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                janecooper@gmail.com
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Username
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                udkio
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Phone number
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                08131889558
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
                Timothy Obrik
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Email
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                janecooper@gmail.com
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Username
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                Udokay
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Phone number
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                08131889558
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
                    11 Adekunle Sule, Majek First gate
                  </MuiTypography>
                </div>
                <MuiIconButton>
                  <IconCopyFilled />
                </MuiIconButton>
              </div>
              <div className="delivery-data">
                <div className="group">
                  <MuiTypography variant="body1" className="header">
                    Drop-off location
                  </MuiTypography>
                  <MuiTypography variant="body2" className="body">
                    11 Adekunle Sule, Majek Firsy gate
                  </MuiTypography>
                </div>
                <MuiIconButton>
                  <IconCopyFilled />
                </MuiIconButton>
              </div>
            </div>
            <MuiIconButton>
              <IconBike />
            </MuiIconButton>
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
              <MuiButton variant="text" className="view-btn" color="primary">
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
                  src={data?.rider?.profile_image}
                  className="product-img"
                />
              </div>

              <div className="product-content">
                <SettlementStatus
                  type="pending"
                  size="small"
                  variant="secondary"
                />
                <MuiTypography variant="body1" className="name">
                  {data?.branch?.name}
                </MuiTypography>
                <MuiTypography variant="body1" className="price">
                  Final bid: <span>₦{data?.total_product_price}</span>
                </MuiTypography>
              </div>
            </div>

            <div className="price-summary">
              <div className="line" />
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  <IconTicket /> Buyer's Settlement{" "}
                  <SettlementStatus
                    type="active"
                    size="small"
                    style={{ marginLeft: "10px" }}
                  />
                </MuiTypography>
                <MuiTypography variant="body1" className="vendor-total">
                  ₦{data ? data?.total_product_price - data?.service_fee : 0}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Item Amount:
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦{data?.total_product_price}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Service fee (2%):
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦{data?.delivery_fee}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  delivery fee (10%):
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦-
                </MuiTypography>
              </div>

              <div className="line" />
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  <IconTicket /> Seller's Settlement{" "}
                  <SettlementStatus
                    type="closed"
                    size="small"
                    style={{ marginLeft: "10px" }}
                  />
                </MuiTypography>
                <MuiTypography variant="body1" className="vendor-total">
                  ₦{data ? data?.total_product_price - data?.service_fee : 0}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Item Amount:
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦{data?.total_product_price}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Service fee:
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦{data?.delivery_fee}
                </MuiTypography>
              </div>

              <div className="line" />
              <div className="price-line earnings">
                <MuiTypography variant="body1" className="entry">
                  <IconEarning /> Earnings
                </MuiTypography>
                <MuiTypography variant="body1" className="grand-total">
                  ₦{data ? data?.delivery_fee + data?.service_fee : 0}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Refunded with delivery
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  Yes
                </MuiTypography>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VendgramCustomModal
        closeOnOutsideClick={false}
        handleClose={handleToggleShow}
        open={show}
        alignTitle="left"
        title="Assign rider"
        showClose>
        <AssignRiderForm
          mode={data?.rider ? "re-assign" : "assign"}
          orderId={orderId || ""}
          refreshQuery={handleRefresh}
        />
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

  .delivery-data {
    display: grid;
    grid-template-columns: 20px 1fr 120px;
    justify-content: center;
    align-items: center;
    gap: 15px;

    & .delivery-data,
    & .address-data {
      display: flex;
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
    height: 130px;

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
