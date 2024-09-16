import { IconDot } from "@/lib/mui.lib.icons";
import { TabProps } from "@mui/material";
import { MuiTab, styled } from "lib/index";

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
    className,
    ...otherProps
  } = props;

  return (
    <StyledTab
      isFirst={value === 0}
      variant={variant}
      className={className}
      {...a11yProps(value)}>
      <MuiTab
        onClick={onClick}
        className={
          current === value ? "custom-tab selected" : "custom-tab  unselected"
        }
        label={label}
        iconPosition="start"
        icon={
          icon ? (
            icon
          ) : !hideIcon ? (
            <IconDot style={{ width: "12px", height: "12px" }} />
          ) : (
            <></>
          )
        }
        {...otherProps}
      />
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
    color: ${({ variant }) =>
      variant === "secondary" ? "#FB651E" : "#fff !important"};
    font-family: "Inter";
    font-size: 13px;
    font-weight: 700;
    /* line-height: 23px; */
    letter-spacing: 0em;
    text-align: center;
    border-radius: 10px;
    border: none;
    border-bottom: none;
    pointer-events: none;
    position: relative;
    height: 36px;
    min-height: 36px;
    padding: 15px;
    width: 100%;
    text-transform: capitalize;
    white-space:nowrap;


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
    min-height: 36px;
    text-transform: capitalize;
    white-space:nowrap;

    & svg > path {
      fill: ${({ variant }) => (variant === "secondary" ? "#777E90" : "")};
    }
  }
`;
