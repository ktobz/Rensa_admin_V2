import * as React from "react";
import { MuiButton, MuiTypography, styled } from "@/lib/index";

import { useNavigate, useParams } from "react-router-dom";
import { TotalCard } from "@/components/index";
import CustomTabs from "@/components/other/CustomTabs";
import CustomTab from "@/components/other/CustomTab";
import CustomTabPanel from "@/components/other/CustomTabPanel";

import BranchesView from "./branches";
import OrderService from "@/services/order-service";
import { OrderTable } from "@/modules/orders";
import ProductsView from "./products";
import BranchManagerView from "./branch-manager";
import PartnerService from "@/services/partner-service";
import { useQuery } from "react-query";
import { IPartnerStatsData } from "@/types/globalTypes";
import OtherService from "@/services/others.service";
import { PayoutAccountView } from "./PayoutAccountView";
import ProfileView from "./ProfileView";
import { useIds } from "@/utils/hooks";

export function PartnerDetailsView() {
  const { partnerId } = useIds();
  const [current, setCurrent] = React.useState(() => {
    return 0;
  });

  const handleChangeIndex = (index: number) => () => {
    setCurrent(index);
  };

  const [values, setValues] = React.useState<any>({
    sales: "all_time",
    orders: "all_time",
  });

  const { data, isSuccess } = useQuery(
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

  const { data: metrics } = useQuery(
    ["partner-metrics", values.branch, values.orders, values.sales, partnerId],
    () =>
      PartnerService.getMetrics(partnerId || "", {
        totat_count_period: values.orders,
        totat_sales_period: values.sales,
      }).then((res) => {
        const data = res.data?.data;

        return data as IPartnerStatsData;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: isSuccess,
    }
  );

  return (
    <PageContent>
      <div className="cards">
        <TotalCard
          className="card"
          title="Total Sales"
          defaultOptions={data}
          variant="sales"
          value={values.sales}
          setValues={setValues}
          name="sales"
        />
        <TotalCard
          className="card"
          title="Total Orders"
          defaultOptions={data}
          variant="order"
          setValues={setValues}
          value={values.orders}
          name="orders"
        />
        <TotalCard
          className="card"
          title="Branches"
          variant="order"
          showFilter={false}
          defaultValue={metrics?.total_branches}
          defaultOptions={data}
        />
        <TotalCard
          className="card"
          title="Branch Managers"
          variant="order"
          showFilter={false}
          defaultValue={metrics?.total_branch_managers}
          defaultOptions={data}
        />
      </div>
      <div className="tab-section">
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
          <CustomTab
            onClick={handleChangeIndex(3)}
            value={3}
            label="Branch Manager"
            current={current}
          />
          <CustomTab
            onClick={handleChangeIndex(4)}
            value={4}
            label="Profile"
            current={current}
          />
          <CustomTab
            onClick={handleChangeIndex(5)}
            value={5}
            label="Payout Account"
            current={current}
          />
        </CustomTabs>
      </div>

      <CustomTabPanel index={current} value={0}>
        <OrderTable
          variant="section"
          page="branches"
          apiFunc={OrderService.getAll}
          id={partnerId || ""}
          queryKey="all-orders-details"
        />
      </CustomTabPanel>
      <CustomTabPanel index={current} value={1}>
        <ProductsView />
      </CustomTabPanel>
      <CustomTabPanel index={current} value={2}>
        <BranchesView />
      </CustomTabPanel>
      <CustomTabPanel index={current} value={3}>
        <BranchManagerView />
      </CustomTabPanel>
      <CustomTabPanel index={current} value={4}>
        <ProfileView partnerId={partnerId} />
      </CustomTabPanel>
      <CustomTabPanel index={current} value={5}>
        <PayoutAccountView partnerId={partnerId} />
      </CustomTabPanel>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  /* padding: 40px; */
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
      width: calc((100% - 30px) / 4);
    }
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 25px 0;
    flex-wrap: wrap;
    gap: 20px;

    & .action-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      justify-content: end;
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
