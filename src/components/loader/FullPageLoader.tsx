import React from "react";
import { styled, MuiTypography } from "lib/index";
import { Loader } from "./Loader";
// import "./style.css";

interface Props {
  loadingText?: string;
}

const StyledLoader = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e5e5;
  flex-direction: column;
  gap: 20px;
`;

export default function FullPageLoader(props: Props) {
  const { loadingText } = props;
  return (
    <StyledLoader>
      <Loader />
      {loadingText && (
        <MuiTypography color="secondary" fontWeight={700} variant="h6">
          {loadingText}{" "}
        </MuiTypography>
      )}
    </StyledLoader>
  );
}
