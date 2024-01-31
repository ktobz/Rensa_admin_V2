import * as React from "react";
import {
  MuiTooltip,
  MuiTooltipProps,
  MuitooltipClasses,
  styled,
} from "lib/index";

const ToolTipSTyle2 = styled(({ className, ...props }: MuiTooltipProps) => (
  <MuiTooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${MuitooltipClasses.arrow}`]: {
    color: "#000",
  },
  [`& .${MuitooltipClasses.tooltip}`]: {
    backgroundColor: "#000",
  },
}));

export const CustomToolTip = styled(
  ({ className, ...props }: MuiTooltipProps) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${MuitooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: "12px",
    border: "1px solid #dadde9",
  },
  [`& .${MuitooltipClasses.arrow}`]: {
    color: "#f5f5f9",
  },
}));
