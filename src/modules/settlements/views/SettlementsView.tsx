import * as React from "react";
import { MuiButton, MuiTypography, styled } from "@/lib/index";
import PageTitle from "components/text/PageTitle";

import { useNavigate } from "react-router-dom";
import { TotalCard } from "@/components/index";
import { SettlementTable } from "../components/SettlementTable";

export function SettlementsView() {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/app/orders");
  };
  return (
    <PageContent>
      <div className="cards">
        <TotalCard
          title="Pending Settlement"
          variant="sales"
          showFilter={false}
        />
        <TotalCard title="Total Settlement" variant="sales" />
      </div>
      <div className="activities">
        <SettlementTable />
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
