import * as React from "react";
import { MuiSkeleton, styled } from "lib";

export default function LineListSkeleton({ rows }: { rows: number }) {
  return (
    <StyledCard>
      {[...Array(rows)].map((_, index) => (
        <MuiSkeleton className="wrapper" key={index} />
      ))}
    </StyledCard>
  );
}

const StyledCard = styled.section`
  width: 100%;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  & .wrapper {
    width: 100%;
    height: 40px;
  }
`;
