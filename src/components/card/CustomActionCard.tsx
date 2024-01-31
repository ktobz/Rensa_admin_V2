import * as React from "react";
import {
  MuiButton,
  MuiCircularProgress,
  MuiTypography,
  styled,
} from "@/lib/index";

import { IconSuccess } from "@/lib/mui.lib.icons";

type ISuccessProps = {
  message?: React.ReactNode;
  supportMessage?: string;
  buttonText?: string;
  buttonAction: () => void;
  hideButton?: boolean;
  title?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  buttonColor?: React.CSSProperties["backgroundColor"];
  isSubmitting?: boolean;
};
export const CustomActionCard = ({
  message = "",
  buttonAction,
  buttonText = "",
  hideButton = false,
  title,
  showIcon = true,
  buttonColor = "#F05B2A",
  isSubmitting = false,
  icon = <IconSuccess className="icon" />,
}: ISuccessProps) => {
  return (
    <StyledCardWrapper>
      <div className="content">
        {showIcon && icon}
        {title && (
          <MuiTypography variant="body1" className="title">
            {title}
          </MuiTypography>
        )}
        <MuiTypography variant="body1" className="message">
          {message}
        </MuiTypography>
        {!hideButton && buttonText && (
          <MuiButton
            variant="contained"
            disabled={isSubmitting}
            sx={{ backgroundColor: buttonColor, color: "#fff" }}
            onClick={buttonAction}
            className="btn">
            {isSubmitting ? <MuiCircularProgress size={16} /> : buttonText}
          </MuiButton>
        )}
      </div>
    </StyledCardWrapper>
  );
};

const StyledCardWrapper = styled.div`
  width: calc(100vw - 60px);
  max-width: 450px;
  & .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    max-width: 400px;
    margin: auto;

    & .icon {
      width: 130px;
      height: 130px;
    }

    & .btn {
      width: 100%;
      max-width: 350px;
      margin-top: 40px;
    }
  }

  & .message {
    text-align: center;
    font-size: 14px;
  }
  & .title {
    font-family: "Poppins";
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 33px;
    text-align: center;
    color: #000000;
  }
`;
