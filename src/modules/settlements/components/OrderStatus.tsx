import { IconOrder } from "@/lib/mui.lib.icons";
import { IStatus } from "../types";

const statusData: {
  [key in IStatus]: {
    bg: React.CSSProperties["backgroundColor"];
    color: React.CSSProperties["color"];
    text: string;
  };
} = {
  pending: {
    bg: "#FFF9E6",
    color: "#FFC502",
    text: "Pending",
  },
  settled: {
    bg: "05A3571A",
    color: "#05A357",
    text: "Settled",
  },
};

export const OrderStatus = ({ type }: { type: IStatus }) => {
  return (
    <span
      style={{
        color: statusData[type]?.color || "",
        background: statusData[type]?.bg || "",
        padding: "10px 15px",
        borderRadius: "10px",
        fontWeight: "bold",
      }}>
      {statusData[type]?.text || ""}
    </span>
  );
};

export const OrderIcon = ({ type }: { type: IStatus }) => {
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
