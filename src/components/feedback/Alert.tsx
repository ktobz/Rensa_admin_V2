import * as React from "react";
import { MuiTypography, styled } from "lib/index";

type IAlertProp = {
  message: string;
  title?: string;
  icon?: React.ReactNode;
  variant?: "warning" | "info" | "error";
};

const border = {
  warning: "#F89C47",
  info: "#1B76FF",
  error: "red",
};

const bgColor = {
  warning: "#FFF9F4",
  info: "#F1FAFF",
  error: "red",
};
export default function CustomAlert({
  message,
  title,
  icon,
  variant = "info",
}: IAlertProp) {
  return (
    <Wrapper
      style={{
        border: `1px dashed ${border[variant]}`,
        backgroundColor: `${bgColor[variant]}`,
      }}>
      {icon && icon}
      <div className="content">
        {!!title && (
          <MuiTypography variant="body2" className="title">
            {title}
          </MuiTypography>
        )}

        <MuiTypography variant="subtitle2" className="body">
          {message}
        </MuiTypography>
      </div>
    </Wrapper>
  );
}

type TStyle = {
  border: React.CSSProperties["color"];
};

const Wrapper = styled.div`
  max-width: 1060px;
  width: 100%;
  display: flex;
  border-radius: 5px;
  gap: 20px;
  padding: 6px;

  & .content {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    & .title {
      font-weight: 600;
      font-size: 14px;
    }

    & .body {
      color: #676767;
      font-size: 12px;
    }
  }
`;
