import { TabsProps } from "@mui/material";
import { styled, MuiTabs } from "@/lib/index";

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

  & .MuiTabs-indicator {
    display: none;
  }

  & .MuiTabs-flexContainer {
    gap: 10px;
  }
`;
