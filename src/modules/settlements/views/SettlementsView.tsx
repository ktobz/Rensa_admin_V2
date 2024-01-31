import * as React from "react";
import { MuiButton, MuiTypography, styled } from "@/lib/index";
import PageTitle from "components/text/PageTitle";

import { useNavigate } from "react-router-dom";
import { TotalCard } from "@/components/index";
import { SettlementTable } from "../components/SettlementTable";
import ListingService from "@/services/listing-service";
import { useQuery } from "react-query";

export function SettlementsView() {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/app/orders");
  };

  const { data: listingStatsData } = useQuery(
    ["all-listing-stats"],
    () =>
      ListingService.getTotals().then((res) => {
        const data = res.data?.result;

        return data;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <PageContent>
      <div className="cards">
        <TotalCard
          title="Active listing"
          variant="order"
          showFilter={false}
          defaultValue={listingStatsData?.active}
        />
        <TotalCard
          title="Pending Payment"
          variant="order"
          showFilter={false}
          defaultValue={listingStatsData?.pendingPayment}
        />
        <TotalCard
          title="Pending Delivery"
          variant="order"
          showFilter={false}
          defaultValue={listingStatsData?.pending}
        />
        <TotalCard
          title="Closed Listing"
          variant="order"
          showFilter={false}
          defaultValue={listingStatsData?.expired}
        />
        <TotalCard
          title="Total Listing"
          variant="order"
          showFilter={false}
          defaultValue={listingStatsData?.active}
        />
      </div>
      <div className="activities">
        <SettlementTable showMoreText showAddNew />
      </div>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  /* padding: 40px; */
  margin: auto;
  position: relative;

  & .fab {
    right: 0;
    position: absolute;
    bottom: -30px;
  }

  & .page-title {
    font-size: 30px;
    font-family: "Helvetica";
    font-weight: 500;
  }

  & .cards {
    display: flex;
    gap: 20px;
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
