import * as React from "react";
import { MuiTypography, styled } from "lib/index";
import { IconInfo } from "lib/mui.lib.icons";

type IProps = {
  message: string;
};
export const Info = ({ message }: IProps) => {
  return (
    <StyledTypography>
      <MuiTypography variant="subtitle1" className="info">
        <IconInfo /> {message}
      </MuiTypography>
    </StyledTypography>
  );
};

const StyledTypography = styled.div`
  width: 100%;
  margin-top: 25px;
  & .info {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    line-height: 15px;
  }
`;
