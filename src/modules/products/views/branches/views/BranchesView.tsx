import * as React from "react";
import { MuiButton, MuiTypography, styled } from "@/lib/index";

import { OrderTable } from "@/modules/orders";
import { useNavigate } from "react-router-dom";
import { TotalCard } from "@/components/index";
import { BranchTable } from "../components/BranchTable";

export function BranchesView() {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/app/orders");
  };
  return (
    <PageContent>
      <div className="activities">
        <BranchTable />
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
