import * as React from "react";
import { MuiTypography, styled } from "lib";

export default function NoData({
  message,
  showIcon = false,
  ...otherProps
}: {
  message: string;
  showIcon?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <StyledWrapper {...otherProps}>
      {/* {showIcon && <Icon style={{ width: 120 }} />} */}

      <MuiTypography className="message" variant="body2">
        {message}
      </MuiTypography>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.section`
  width: 100%;
  height: 100%;
  margin-top: 10px;
  background: #fbfbfb;
  border: 0.514613px solid #d9d9d9;

  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  min-height: 200px;

  & .message {
    color: #605e5c;
    text-align: center;
  }
`;
