import * as React from "react";
import { styled, MuiTypography } from "lib/index";

interface INotificationProp {
  data: any[];
  variant: "page" | "dropdown";
}

export default function NotificationLists({
  data,
  variant = "page",
}: INotificationProp) {
  return (
    <StyledSection>
      {[...Array(8)].map((item) => (
        <div className="notification-item"></div>
      ))}
    </StyledSection>
  );
}

const StyledSection = styled.section`
  width: 100%;

  & .notification-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f6f6f6;
    padding: 15px 0;
  }
`;
