import * as React from "react";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import { styled } from "lib/index";
// import PerfectScrollbar from "react-perfect-scrollbar";

interface IProps extends DrawerProps {
  children: React.ReactNode;
  position?: "right" | "left" | "bottom" | "top";
  width?: string;
}

export default function CustomDrawer({
  onClose,
  children,
  onClick,
  open,
  onKeyDown,
  position = "right",
  width = "260px",
  style,
}: IProps) {
  return (
    <StyledWrapper>
      <Drawer
        sx={{ borderRadius: "10px" }}
        anchor={position}
        open={open}
        onClose={onClose}>
        <div
          className="scrollbar-container"
          style={{ width: width, padding: "20px", ...style }}
          role="presentation"
          //   onClick={onClick}
          onKeyDown={onKeyDown}>
          {children}
        </div>
      </Drawer>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  & .MuiDrawer-paper {
    border-radius: 10px 10px 0 0;
    padding: 20px;
  }
`;
