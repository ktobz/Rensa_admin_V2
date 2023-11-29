import * as React from "react";
import { MuiButton, MuiTypography, styled } from "@/lib/index";

import { OrderTable } from "@/modules/orders";
import { useNavigate } from "react-router-dom";
import { TotalCard } from "@/components/index";
import { useQuery } from "react-query";
import OrderService from "@/services/order-service";
import { IOrderTotalStats } from "@/types/globalTypes";
import useCachedDataStore from "@/config/store-config/lookup";
import DashboardService from "@/services/dashboard-service";

export function DashboardView() {
  const { dashboardFilter } = useCachedDataStore(
    (state) => state.cache?.lookup
  );
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/app/orders");
  };

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
          subAction={{
            action: handleGoTo("orders"),
            name: "View more",
          }}
          defaultOptions={dashboardFilter}
          filterType="minimal"
          queryKey="dashboard-new-orders"
          serviceFunc={DashboardService.orders}
        />
        <TotalCard
          className="card"
          title="Marketplace"
          variant="order"
          subAction={{
            action: handleGoTo("marketplace"),
            name: "View more",
          }}
          defaultOptions={dashboardFilter}
          serviceFunc={DashboardService.getMarketplace}
          queryKey="dashboard-marketplace"
        />
        <TotalCard
          className="card"
          title="Users"
          variant="order"
          subAction={{
            action: handleGoTo("users"),
            name: "View more",
          }}
          defaultOptions={dashboardFilter}
          serviceFunc={DashboardService.users}
          queryKey="dashboard-users"
        />
        <TotalCard
          className="card"
          title="Sales"
          variant="order"
          subAction={{
            action: handleGoTo("transactions"),
            name: "View more",
          }}
          defaultOptions={dashboardFilter}
          serviceFunc={DashboardService.getSales}
          queryKey="dashboard-transactions"
        />
        <TotalCard
          className="card"
          title="Revenue"
          variant="order"
          subAction={{
            action: handleGoTo("revenue"),
            name: "View more",
          }}
          defaultOptions={dashboardFilter}
          serviceFunc={DashboardService.revenue}
          queryKey="dashboard-revenue"
        />
      </div>

      <OrderTable
        variant="section"
        page="dashboard"
        showViewMore
        viewMode="list"
      />
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
    display: grid;
    gap: 10px;
    /* grid-template-columns: repeat(5, minmax(auto-fit, 200px)); */
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

    & .card {
      /* width: calc((100% - 40px) / 5); */
      width: 100%;
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
