import * as React from "react";
import { MuiButton, MuiTypography, styled } from "lib/index";

import { IconSuccess } from "lib/mui.lib.icons";

type ISuccessProps = {
  message?: string;
  supportMessage?: string;
  buttonText?: string;
  buttonAction: () => void;
  hideButton?: boolean;
  title?: string;
  hideSupport?: boolean;
  icon?: React.ReactNode;
  showIcon?: boolean;
};
export const SuccessMessage = ({
  message = "You just made a top up attempt, we will confirm this soon",
  supportMessage = "Contact support if funds dont reflect in wallet after 1 hour",
  buttonAction,
  buttonText = "Done",
  hideButton,
  title,
  hideSupport,
  showIcon = true,
  icon = <IconSuccess className="icon" />,
}: ISuccessProps) => {
  return (
    <SuccessWrapper>
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
          <MuiButton variant="contained" onClick={buttonAction} className="btn">
            {buttonText}
          </MuiButton>
        )}
      </div>
      {hideSupport && (
        <MuiTypography variant="subtitle1" className="contact">
          {supportMessage}
        </MuiTypography>
      )}
    </SuccessWrapper>
  );
};

const SuccessWrapper = styled.div`
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
    }
  }

  & .contact {
    color: #676767;
    text-align: center;
    font-size: 13px;
    margin-top: 30px;
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
