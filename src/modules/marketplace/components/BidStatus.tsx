import { ISettlementStatus } from "@/types/globalTypes";

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
  expired: {
    bg: "#F0F0F0",
    color: "#777E90",
    text: "Expired",
  },
  declinedbybidder: {
    bg: "#F0F0F0",
    color: "#777E90",
    text: "Declined by bidder",
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
  const casedStatus = status?.toLowerCase() as ISettlementStatus;
  const type = casedStatus in settleStatusData ? casedStatus : "pending";

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
