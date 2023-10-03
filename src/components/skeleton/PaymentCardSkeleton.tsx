import * as React from "react";
import { MuiSkeleton, styled } from "lib";

type Props = {};
export default function PaymentCardSkeleton({}: Props) {
  return (
    <StyledCard>
      <MuiSkeleton className="wrapper">
        <div className="header">
          <MuiSkeleton className="title"></MuiSkeleton>
          <MuiSkeleton className="actions"></MuiSkeleton>
        </div>
        <div className="body">
          <div className="content">
            <MuiSkeleton className="label"></MuiSkeleton>
            <MuiSkeleton className="amount"></MuiSkeleton>
            <MuiSkeleton className="quota"></MuiSkeleton>
          </div>
        </div>
        <div className="indicator"></div>
      </MuiSkeleton>
    </StyledCard>
  );
}

const StyledCard = styled.section`
  width: 100%;
  /* max-width: 340px; */
  height: 200px;
  position: relative;
  perspective: 1000px;
  /* padding: 10px 0; */
  width: calc((100% - 20px) / 2);
  min-width: 310px;
  flex: 1;

  @media screen and (max-width: 450px) {
    min-width: 100%;
    width: 100%;
  }

  & .wrapper {
    position: relative;
    width: 100%;
    max-width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  & .header {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    z-index: 1;

    & svg {
      color: #fff;
    }

    & .title {
      color: #fff;
      font-family: "Helvetica";
    }
  }

  & .card-bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }

  & .body {
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: end;

    & .content {
      display: flex;
      gap: 3px;
      flex-direction: column;
      align-items: start;
      font-family: "Helvetica";

      & .label {
        /* margin-bottom: 2px; */
        opacity: 0.8;
        color: #fff;
        font-size: 10px;
      }

      & .amount {
        font-weight: 700;
        font-size: 24px;
        color: #fff;
        line-height: 24px;
        font-family: "Helvetica";
      }

      & .quota {
        /* display: flex; */
        gap: 1px;
        font-size: 12px;
        color: #fff;
        opacity: 0.8;
        font-family: "Helvetica";

        & .spent {
          color: #f45a5a;
        }
      }
    }
    & .visa-logo {
      margin-top: 10px;
      display: block;
      margin: 10px 0 0 auto;
    }
  }
`;
