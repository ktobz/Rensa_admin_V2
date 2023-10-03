import * as React from "react";
import { MuiBox, MuiSkeleton, styled } from "lib";

type Props = {
  totalCards: number;
};
export default function FAQSkeleton({ totalCards }: Props) {
  return (
    <StyledCard>
      {[...Array(totalCards)]?.map((_, index) => (
        <MuiSkeleton
          style={{ visibility: "visible" }}
          key={index}
          variant="rectangular"
          className="faq-row">
          <div className="row-action">
            <div className="faq-title"></div>
            <MuiBox className="action-group">
              <div className={`action-btn edit-btn btn `}></div>
              <div className="action-btn delete-btn btn"></div>
            </MuiBox>
          </div>
          <div className="body" style={{ width: "90%" }}></div>
          <div className="body" style={{ width: "80%" }}></div>
          <div className="body"></div>
        </MuiSkeleton>
      ))}
    </StyledCard>
  );
}

const StyledCard = styled.section`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;

  & .faq-row {
    display: block;
    width: calc((100% - 30px) / 3);
    /* flex: 1 250px; */
    /* min-width: 250px; */
    max-width: calc((100% - 30px) / 3);
    background: #ededed;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #f3f3f3;

    & .row-action {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: space-between;

      & .btn {
        padding: 10px !important;
        height: 40px;
        width: 40px;
      }
    }

    & .body {
      line-height: 150%;
      height: 8px;
      width: 40%;
      background-color: #c4c4c4;
      margin: 3px 0;
    }

    & .faq-title {
      color: #1e75bb;
      font-size: 15px;
      font-weight: 500;
      height: 10px;
      width: 40%;
      background-color: #c4c4c4;
    }
  }

  & .btn {
    height: 36px;
    font-size: 12px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  & .action-btn {
    background-color: #e8f1f8;
    border-radius: 10px;
    padding: 12px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  & .edit-btn {
    background: #ffc5021a;
    color: #d78950;

    svg {
      color: #d78950;
    }
  }
  & .send-btn {
    background: #05a3571a;
    /* color: #d78950; */
  }
  & .delete-btn {
    background: #ef50501a;
    color: #d78950;

    svg {
      color: #d78950;
    }
  }

  & * {
    visibility: visible;
  }
`;
