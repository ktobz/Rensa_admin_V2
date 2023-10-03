import { TabsProps } from "@mui/material";
import { styled, MuiTabs } from "@/lib/index";
import * as React from "react";

interface ITabsProp extends TabsProps {}

export default function CustomTabs({
  children,
  value,
  className,
  ...othersProps
}: ITabsProp) {
  return (
    <StyledTab className={className}>
      {/* <div className="desktop-tabs">{children}</div> */}
      <MuiTabs
        {...othersProps}
        scrollButtons={false}
        value={value}
        // className="mobile-tabs"
      >
        {children}
      </MuiTabs>
    </StyledTab>
  );
}

const StyledTab = styled.div`
  width: 100%;
  display: flex;

  & .mobile-tabs {
    display: none;
    width: 100%;
    padding: 10px;
    background: #f3f3f3;
    border-radius: 6px;
  }

  & .desktop-tabs {
    width: 100%;
    display: flex;
  }

  & .MuiTabs-indicator {
    display: none;
  }

  & .MuiTabs-flexContainer {
    gap: 10px;
  }

  /* @media screen and (max-width: 768px) {
    & .mobile-tabs {
      display: flex;
    }

    & .desktop-tabs {
      display: none;
    }
  } */
`;
