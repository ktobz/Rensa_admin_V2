import { IconDot } from "@/lib/mui.lib.icons";
import { TabProps } from "@mui/material";
import { MuiButton, styled } from "lib/index";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CustomTab(
  props: Omit<TabProps, "onClick"> & {
    current: number;
    onClick: any;
    variant?: "primary" | "secondary";
    hideIcon?: boolean;
  }
) {
  const {
    label,
    value,
    icon,
    current,
    onClick,
    variant = "secondary",
    hideIcon = false,
  } = props;

  return (
    <StyledTab isFirst={value === 0} variant={variant} {...a11yProps(value)}>
      <MuiButton
        onClick={onClick}
        className={current === value ? "selected" : "unselected"}
        startIcon={
          icon ? (
            icon
          ) : !hideIcon ? (
            <IconDot style={{ width: "12px", height: "12px" }} />
          ) : null
        }>
        {label}
      </MuiButton>
    </StyledTab>
  );
}

const StyledTab = styled.div<{
  isFirst: boolean;
  variant: "primary" | "secondary";
}>`
  & .selected {
    background-color: ${({ variant }) =>
      variant === "secondary" ? "#FFF9F6" : "#FB651E"};
    color: ${({ variant }) => (variant === "secondary" ? "#FB651E" : "#fff")};
    font-family: "Inter";
    font-size: 13px;
    font-weight: 700;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    border-radius: 10px;
    border: none;
    border-bottom: none;
    pointer-events: none;
    position: relative;
    height: 36px;
    padding: 15px;

    & svg > path {
      fill: ${({ variant }) => (variant === "secondary" ? "#FB651E" : "")};
    }
  }
  & .unselected {
    background-color: #f0f0f0;
    border: none;
    color: #777e90;
    font-size: 13px;
    font-weight: 700;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    height: 36px;
    padding: 15px;
    border-radius: 10px;

    & svg > path {
      fill: ${({ variant }) => (variant === "secondary" ? "#777E90" : "")};
    }
  }
`;
