import { IconOrder } from "@/lib/mui.lib.icons";
import { ISettlementStatus } from "@/types/globalTypes";
import { useTimer } from "react-timer-hook";

const settleStatusData: {
  [key in ISettlementStatus]: {
    bg: React.CSSProperties["backgroundColor"];
    color: React.CSSProperties["color"];
    text: string;
  };
} = {
  pending: {
    bg: "#FFF8DD",
    color: "#F7992B",
    text: "Pending",
  },
  accepted: {
    bg: "",
    color: "#fff",
    text: "Accepted",
  },
  rejected: {
    bg: "#E8FFF3",
    color: "#F53139",
    text: "Rejected",
  },
};

export const BidStatus = ({
  status,
  variant = "primary",
  size = "small",
  style,
}: {
  status: ISettlementStatus;
  rounded?: boolean;
  style?: React.HTMLAttributes<HTMLDivElement>["style"];
  variant?: "secondary" | "primary";
  size?: "large" | "small";
}) => {
  const type = status in settleStatusData ? status : "pending";
  return (
    <span
      style={{
        color:
          variant === "primary"
            ? settleStatusData[type]?.color || ""
            : settleStatusData[type]?.color || "",
        fontSize: size === "large" ? "13px" : "10px",
        fontWeight: "700",
        display: "inline",
        whiteSpace: "nowrap",
        textAlign: "end",
        ...style,
      }}>
      {settleStatusData[type]?.text || ""}
    </span>
  );
};
