import * as React from "react";
import { MuiTypography, styled } from "@/lib/index";
import { IconBox } from "@/lib/mui.lib.icons";

type IProps = {
  message: string;
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

export const NoData = ({ message, icon, title, children }: IProps) => {
  return (
    <NoDataWrapper>
      {icon ? icon : <IconBox className="icon" />}

      <div className="group">
        {title && (
          <MuiTypography variant="body1" className="title">
            {title}
          </MuiTypography>
        )}
        <MuiTypography variant="subtitle2" className="body">
          {message}
        </MuiTypography>
      </div>
      {children}
    </NoDataWrapper>
  );
};

const NoDataWrapper = styled.div`
  max-width: 350px;

  min-height: inherit;
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 0 auto;

  & .icon {
    width: 60px;
    height: 60px;
  }

  & .group {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  & .title {
    color: #5d6c87;
    font-size: 16px;
    font-weight: 600;
    font-family: "Inter";
  }

  & .body {
    color: #5d6c87;
    font-size: 14px;
    text-align: center;
    max-width: 350px;
  }
`;
