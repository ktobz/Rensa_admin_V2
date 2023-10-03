import * as React from "react";
import { format } from "date-fns";

import { MuiButton, MuiCardMedia, MuiTypography, styled } from "@/lib/index";
import { useLocation, useParams } from "react-router-dom";
import {
  IconBranches,
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
              {format(new Date(data?.created_at || ""), "LL MMMM, yyyy")}
            </MuiTypography>
          </div>
          <div className="group">
            <MuiTypography variant="body1" className="header">
              Scheduled Date
            </MuiTypography>
            <MuiTypography variant="body2" className="body">
              <IconShipping style={{ color: "#F05B2A" }} />
              {data?.delivery_pickup_date} <span>⚫</span>
              {data?.delivery_pickup_time}
            </MuiTypography>
          </div>
          <div className="group">
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
          </div>
        </div>

        <div className="order-section">
          <MuiTypography variant="h4" className="group-heading">
            Customer Info
          </MuiTypography>

          <div className="group">
            <MuiTypography variant="body1" className="header">
              Full name
            </MuiTypography>
            <MuiTypography variant="body2" className="body">
              {data?.user?.full_name}
            </MuiTypography>
          </div>
          <div className="group">
            <MuiTypography variant="body1" className="header">
              Email
            </MuiTypography>
            <MuiTypography variant="body2" className="body">
              {data?.user?.email}
            </MuiTypography>
          </div>
          <div className="group">
            <MuiTypography variant="body1" className="header">
              Phone number
            </MuiTypography>
            <MuiTypography variant="body2" className="body">
              {data?.user?.phone}
            </MuiTypography>
          </div>
        </div>

        <div className="order-section">
          <MuiTypography variant="h4" className="group-heading">
            Delivery Info
          </MuiTypography>

          <div className="group">
            <MuiTypography variant="body1" className="header">
              Delivery Address
            </MuiTypography>
            <MuiTypography variant="body2" className="body">
              {data?.address?.map_location}
            </MuiTypography>
          </div>
          <div className="group">
            <MuiTypography variant="body1" className="header">
              Delivery Note
            </MuiTypography>
            <MuiTypography variant="body2" className="body">
              {data?.delivery_pickup_note}
            </MuiTypography>
          </div>
        </div>
      </div>
      <div className="column-right">
        <div className="right">
          <MuiTypography variant="h3" className="title">
            Order Items
          </MuiTypography>

          <div className="details">
            <div className="content">
              <IconBranches />{" "}
              <div className="data">
                <MuiTypography variant="body1" className="header">
                  {data?.branch?.name}
                </MuiTypography>
                <MuiTypography variant="body1" className="address">
                  <IconLocation />
                  {data?.branch?.location}
                </MuiTypography>
              </div>
            </div>

            <div className="order-list">
              {data?.order_items?.map((item, index) => (
                <div className="item" key={item?.product?.id}>
                  <p className="number">{index + 1}</p>
                  <div className="content">
                    <div className="price-section">
                      <MuiTypography variant="body1" className="name">
                        {item?.quantity} LTRS
                      </MuiTypography>
                      <MuiTypography variant="body2" className="body">
                        <MuiCardMedia
                          component="img"
                          width={25}
                          height={25}
                          src={item?.product?.product_category?.image}
                        />
                        {item?.product?.product_category?.name} <span>⚫</span>₦
                        {item?.unit_price}
                        /unit
                      </MuiTypography>
                    </div>
                    <MuiTypography variant="body2" className="body sub-amount">
                      ₦{item?.total_price}
                    </MuiTypography>
                  </div>
                </div>
              ))}
            </div>
            <div className="price-summary">
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Order Amount:
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦{data?.total_product_price}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Delivery fee:
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦{data?.delivery_fee}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Customer Service fee:
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦-
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  Vendor Service fee:
                </MuiTypography>
                <MuiTypography variant="body1" className="entry">
                  ₦{data?.service_fee}
                </MuiTypography>
              </div>

              <div className="line" />
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  <IconTicket /> Vendor Settlement{" "}
                  <OrderStatus type="pending" style={{ marginLeft: "10px" }} />
                </MuiTypography>
                <MuiTypography variant="body1" className="vendor-total">
                  ₦{data ? data?.total_product_price - data?.service_fee : 0}
                </MuiTypography>
              </div>
              <div className="price-line">
                <MuiTypography variant="body1" className="entry">
                  <IconEarning /> Earnings
                </MuiTypography>
                <MuiTypography variant="body1" className="grand-total">
                  ₦{data ? data?.delivery_fee + data?.service_fee : 0}
                </MuiTypography>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <MuiTypography variant="h3" className="title">
            Assigned Rider
          </MuiTypography>
          {data?.rider ? (
            <UserDetailCard data={data?.rider} />
          ) : (
            <>
              <MuiTypography variant="body1" className="no-data">
                No rider assigned
              </MuiTypography>
            </>
          )}

          {(data?.status?.toLowerCase() === "new" ||
            data?.status?.toLowerCase() === "pending" ||
            data?.status?.toLowerCase() === "confirmed") && (
            <MuiButton
              variant="contained"
              color="primary"
              className="btn"
              onClick={handleToggleShow}>
              {data?.rider ? "Re-assign" : "Assign"} Rider
            </MuiButton>
          )}
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

  & .no-data {
    width: 100%;
    padding: 50px 20px;
    text-align: center;
    background: #fbfbfb;
    border-radius: 6px;
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

    & .order-list {
      flex: 1;
      display: flex;
      gap: 5px;
      flex-direction: column;

      & .item {
        display: flex;
        align-items: center;
        gap: 20px;

        & .number {
          background: #1e75bb;
          color: #fff;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        & .name {
          font-weight: 700;
        }
      }

      & .body {
        display: flex;
        gap: 5px;
        align-items: center;
        color: #64748b;
        font-weight: 500;

        & span {
          font-size: 5px;
        }
      }
      & .content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    & .price-summary {
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

  & .column-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
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

    & .group-heading {
      font-weight: 700;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 10px;
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

  & .left {
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
