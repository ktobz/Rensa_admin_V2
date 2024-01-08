import { IconBox, IconOrder } from "@/lib/mui.lib.icons";
import { IStatus } from "@/types/globalTypes";
import { styled } from "@/lib/index";

const statusData: {
  [key in IStatus]: {
    bg: React.CSSProperties["backgroundColor"];
    color: React.CSSProperties["color"];
    text: string;
  };
} = {
  "pick-up": {
    bg: "#0F46B11A",
    color: "#0F46B1",
    text: "Picked Up",
  },
  new: {
    bg: "#FFF8DD",
    color: "#F7992B",
    text: "New",
  },
  declined: {
    bg: "#7E38311A",
    color: "#7E3831",
    text: "Declined",
  },
  confirmed: {
    bg: "#9BDF461A",
    color: "#7DC324",
    text: "Confirmed",
  },
  cancelled: {
    // bg: "#EF50501A",
    // color: "#EF5050",
    text: "Cancelled",
    bg: "#64748B1A",
    color: "#64748B",
  },
  delivered: {
    bg: "#E8FFF3",
    color: "#45B26B",
    text: "Delivered",
  },
  successful: {
    bg: "#E8FFF3",
    color: "#45B26B",
    text: "Successful",
  },
  abandoned: {
    bg: "#64748B1A",
    color: "#64748B",
    text: "Abandoned",
  },
  completed: {
    bg: "#05A3571A",
    color: "#05A357",
    text: "Completed",
  },
  failed: {
    bg: "#EF50501A",
    color: "#EF5050",
    text: "Failed",
  },
  pending: {
    bg: "#FFC5021A",
    color: "#FFC502",
    text: "Pending",
  },
  reported: {
    bg: "#FFC5021A",
    color: "#FFC502",
    text: "Reported",
  },
  active: {
    bg: "#E8FFF3",
    color: "#05A357",
    text: "Active",
  },
  rejected: {
    bg: "#EF50501A",
    color: "#EF5050",
    text: "Rejected",
  },
  resolved: {
    bg: "#64748B1A",
    color: "#64748B",
    text: "Resolved",
  },

  intransit: {
    bg: "#64748B1A",
    color: "#64748B",
    text: "In transit",
  },
  pending_cancellation: {
    bg: "#64748B1A",
    color: "#64748B",
    text: "Pending cancellation",
  },
  pending_payment: {
    bg: "#64748B1A",
    color: "#64748B",
    text: "Pending Payment",
  },
  sold: {
    bg: "#64748B1A",
    color: "#64748B",
    text: "Sold",
  },
  expired: {
    bg: "#64748B1A",
    color: "#64748B",
    text: "Expired",
  },
  processing: {
    bg: "#64748B1A",
    color: "#64748B",
    text: "Processing",
  },
  pending_pickup: {
    bg: "#64748B1A",
    color: "#64748B",
    text: "Pending pickup",
  },
  pending_delivery: {
    bg: "#64748B1A",
    color: "#64748B",
    text: "Pending delivery",
  },
};

export const OrderStatus = ({
  type,
  style,
}: {
  type: IStatus;
  style?: React.HTMLAttributes<HTMLDivElement>["style"];
}) => {
  const statusType = type
    ?.toLowerCase()
    ?.trim()
    ?.replaceAll(" ", "-") as IStatus;
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

export const OrderIcon = ({ type }: { type: IStatus }) => {
  const statusType = type
    ?.toLowerCase()
    ?.trim()
    ?.replaceAll(" ", "-") as IStatus;
  return (
    <StyledWrapper
      style={{
        color: statusData[statusType]?.color || "",
        background: statusData[statusType]?.bg || "",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        stroke: `${statusData[statusType]?.color || "grey"} !important`,
      }}>
      <IconBox
        className={statusType}
        style={{
          color: statusData[statusType]?.color || "",
          stroke: `${statusData[statusType]?.color || "grey"} !important`,
          width: "20px",
          height: "20px",
        }}
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.span`
  & .pending {
    path {
      stroke: ${statusData?.pending?.color} !important;
    }
  }

  & .new {
    path {
      stroke: ${statusData?.new?.color} !important;
    }
  }

  & .picked-up {
    path {
      stroke: ${statusData?.["pick-up"]?.color} !important;
    }
  }
  & .delivered {
    path {
      stroke: ${statusData?.delivered?.color} !important;
    }
  }
  & .cancelled {
    path {
      stroke: ${statusData?.cancelled?.color} !important;
    }
  }

  & .confirmed {
    path {
      stroke: ${statusData?.confirmed?.color} !important;
    }
  }
`;
