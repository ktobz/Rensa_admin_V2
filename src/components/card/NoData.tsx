import * as React from "react";
import { MuiTypography, styled } from "lib/index";

export const NoData = () => {
  return (
    <NoDataWrapper>
      <MuiTypography variant="body2" className="title">
        No cash-out account found
      </MuiTypography>
      <MuiTypography variant="subtitle2" className="body">
        Add your business corporate account to withdraw funds.
      </MuiTypography>
    </NoDataWrapper>
  );
};

const NoDataWrapper = styled.div`
  max-width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 40px auto;

  & .title {
    font-weight: 600;
    font-size: 14px;
    text-align: center;
  }
  & .body {
    color: #676767;
    font-size: 12px;
    text-align: center;
    max-width: 200px;
  }
`;
