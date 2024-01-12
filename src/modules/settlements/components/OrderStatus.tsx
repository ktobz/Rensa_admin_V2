import { OrderStatus } from "@/components/feedback/OrderStatus";
import { IconOrder } from "@/lib/mui.lib.icons";
import { IStatus } from "@/types/globalTypes";
import { useTimer } from "react-timer-hook";

export type IActiveStatus = "warning" | "closed" | "sold" | "error" | "hold";
export type ISettlementStatus = "active" | "pending" | "delivered" | "closed";

const statusData: {
  [key in IActiveStatus]: {
    bg: React.CSSProperties["backgroundColor"];
    color: React.CSSProperties["color"];
    text: string;
  };
} = {
  closed: {
    bg: "#F0F0F0",
    color: "#777E90",
    text: "Closed",
  },
  hold: {
    bg: "#F0F0F0",
    color: "#777E90",
    text: "On-hold",
  },
  sold: {
    bg: "#05A357",
    color: "#fff",
    text: "Sold",
  },
  warning: {
    bg: "#FFF9F6",
    color: "#FB651E",
    text: "",
  },
  error: {
    bg: "#FFF5F8",
    color: "#F53139",
    text: "",
  },
};

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
    text: "Pending delivery",
  },
  closed: {
    bg: "#F0F0F0",
    color: "#777E90",
    text: "Closed",
  },
  delivered: {
    bg: "#05A357",
    color: "#fff",
    text: "Delivered",
  },
  active: {
    bg: "#E8FFF3",
    color: "#45B26B",
    text: "Active",
  },
};

export const SettlementStatus = ({
  type,
  variant = "primary",
  size = "large",
  style,
}: {
  type: ISettlementStatus;
  rounded?: boolean;
  style?: React.HTMLAttributes<HTMLDivElement>["style"];
  variant?: "secondary" | "primary";
  size?: "large" | "small";
}) => {
  return (
    <span
      style={{
        color:
          variant === "primary"
            ? settleStatusData[type]?.color || ""
            : settleStatusData[type]?.color || "",
        background:
          variant === "primary"
            ? settleStatusData[type]?.bg || ""
            : "transparent",
        padding: size === "large" ? "10px 15px" : "5px 8px",
        fontSize: size === "large" ? "13px" : "10px",
        borderRadius: "10px",
        fontWeight: "bold",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor:
          variant === "primary"
            ? settleStatusData[type]?.bg || ""
            : settleStatusData[type]?.color || "",
        display: "inline",
        whiteSpace: "nowrap",
        textAlign: "center",
        ...style,
      }}>
      {settleStatusData[type]?.text || ""}
    </span>
  );
};

export const ActionTimeStatus = ({
  type,
  time = 0,
  catelogueStatus,
}: {
  type: IActiveStatus;
  time?: number;
  catelogueStatus?: IStatus;
}) => {
  const currentTime = new Date();
  currentTime.setSeconds(currentTime.getSeconds() + time);

  const { seconds, minutes, hours, restart } = useTimer({
    expiryTimestamp: currentTime,
    onExpire: () => {},
  });
  const statusType = minutes >= 10 ? "warning" : "error";
  const hasEnded = minutes === 0 && seconds === 0;

  return hasEnded ? (
    <OrderStatus
      type={
        catelogueStatus === "pending_payment"
          ? "on_hold"
          : catelogueStatus !== "closed" && catelogueStatus !== "expired"
          ? "sold"
          : "closed"
      }
    />
  ) : (
    <span
      style={{
        color: statusData[statusType]?.color || "",
        background: statusData[statusType]?.bg || "",
        padding: "10px 15px",
        borderRadius: "10px",
        fontWeight: "bold",
        minWidth: "90px",
        display: "inline-block",
        textAlign: "center",
      }}>
      {statusData[statusType]?.text ||
        `${hours > 9 ? hours : `0${hours}`}:${
          minutes > 9 ? minutes : `0${minutes}`
        }:${seconds > 9 ? seconds : `0${seconds}`}`}
    </span>
  );
};

export const OrderIcon = ({ type }: { type: IActiveStatus }) => {
  return (
    <span
      style={{
        color: statusData[type]?.color || "",
        background: statusData[type]?.bg || "",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        stroke: `${statusData[type]?.color || "grey"} !important`,
      }}>
      <IconOrder
        className={type}
        style={{
          color: statusData[type]?.color || "",
          stroke: `${statusData[type]?.color || "grey"} !important`,
          width: "20px",
          height: "20px",
        }}
      />
    </span>
  );
};
