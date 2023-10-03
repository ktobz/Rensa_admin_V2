import * as React from "react";
import { MuiSkeleton, styled } from "lib";

export default function BankDetailSkeleton() {
  return (
    <StyledCard>
      <MuiSkeleton className="wrapper" />
    </StyledCard>
  );
}

const StyledCard = styled.section`
  width: 100%;
  height: 100px;
  margin: 10px 0;

  & .wrapper {
    width: 100%;
    height: 100%;
  }
`;
