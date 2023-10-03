import * as React from "react";
import { MuiButton, MuiTypography, styled } from "@/lib/index";

import { OrderTable } from "@/modules/orders";
import { useNavigate } from "react-router-dom";
import { TotalCard } from "@/components/index";
import { useQuery } from "react-query";
import OrderService from "@/services/order-service";
import { IOrderTotalStats } from "@/types/globalTypes";

export function DashboardView() {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/app/orders");
  };

  const { data } = useQuery(
    ["all-orders-stats"],
    () =>
      OrderService.getTotals().then((res) => {
        const data = res.data?.data;
        return data as IOrderTotalStats;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleGoTo = (path: string) => () => {
    navigate(`/app/${path}`);
  };
  return (
    <PageContent>
      <div className="cards">
        <TotalCard
          className="card"
          title="New Orders"
          variant="order"
          defaultValue={data?.new_orders}
          subAction={{
            action: handleGoTo("orders"),
            name: "View more",
          }}
        />
        <TotalCard
          className="card"
          title="Marketplace"
          variant="order"
          defaultValue={data?.on_going_orders}
          subAction={{
            action: handleGoTo("marketplace"),
            name: "View more",
          }}
        />
        <TotalCard
          className="card"
          title="Users"
          variant="order"
          defaultValue={data?.total_orders}
          subAction={{
            action: handleGoTo("users"),
            name: "View more",
          }}
        />
        <TotalCard
          className="card"
          title="Sales"
          variant="order"
          defaultValue={"-"}
          subAction={{
            action: handleGoTo("transactions"),
            name: "View more",
          }}
        />
        <TotalCard
          className="card"
          title="Revenue"
          variant="order"
          defaultValue={"-"}
          subAction={{
            action: handleGoTo("revenue"),
            name: "View more",
          }}
        />
      </div>
      <div className="activities">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Recent Orders
          </MuiTypography>
          <MuiButton
            onClick={handleViewMore}
            className="view-all"
            variant="text">
            View all
          </MuiButton>
        </div>

        <OrderTable variant="section" page="dashboard" />
      </div>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;

  & .page-title {
    font-size: 30px;
    font-family: "Helvetica";
    font-weight: 500;
  }

  & .cards {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    & .card {
      width: calc((100% - 40px) / 5);
    }
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
      margin-top: 20px;

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
