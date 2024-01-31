import { IconOrder } from "@/lib/mui.lib.icons";
import { IVerifyStatus } from "@/types/globalTypes";
import { styled } from "@/lib/index";

const statusData: {
  [key in IVerifyStatus]: {
    bg: React.CSSProperties["backgroundColor"];
    color: React.CSSProperties["color"];
    text: string;
  };
} = {
  false: {
    bg: "#64748B1A",
    color: "#808080",
    text: "No",
  },
  true: {
    bg: "#05A3571A",
    color: "#05A357",
    text: "Yes",
  },
};

export const VerificationStatus = ({
  type,
  style,
}: {
  type: IVerifyStatus;
  style?: React.HTMLAttributes<HTMLDivElement>["style"];
}) => {
  const statusType = type
    ?.toLowerCase()
    ?.trim()
    ?.replaceAll(" ", "-") as IVerifyStatus;
  return (
    <span
      style={{
        color: statusData[statusType]?.color || "",
        background: statusData[statusType]?.bg || "",
        padding: "10px 15px",
        borderRadius: "10px",
        fontWeight: "bold",
        ...style,
      }}>
      {statusData[statusType]?.text || ""}
    </span>
  );
};
