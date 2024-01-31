import * as React from "react";
import {
  MuiIconButton,
  MuiListItemIcon,
  MuiListItemText,
  MuiMenu,
  MuiMenuItem,
  MuiMenuList,
  styled,
} from "@/lib/index";

import { useUserStore } from "@/config/store-config/store.config";
import { IconArrowDownIcon, IconLogout } from "@/lib/mui.lib.icons";

export const UserMenu = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { logout } = useUserStore((state) => state);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogoutUser = () => {
    logout();
  };

  return (
    <UserProfileWrapper {...props}>
      <MuiIconButton
        onClick={handleClick}
        className="dropdown"
        aria-label="profile menu">
        <IconArrowDownIcon />
      </MuiIconButton>

      <MuiMenu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px #00000028)",
            mt: 1.5,
            paddingTop: 0,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <MuiMenuList
          sx={{
            padding: "0 10px",
            width: "200px",
            minWidth: "fit-content",
            paddingBottom: "10px",
            "& .list": {
              padding: "5px 10px",
              minHeight: "fit-content",
              margin: "10px 0 0",

              "&:hover": {
                background: "#F2F5F9",
                borderRadius: "5px",
              },
              "& span": {
                fontSize: "13px !important",
              },
            },
          }}
          className="menu-list">
          <MuiMenuItem
            onClick={handleLogoutUser}
            className="list"
            sx={{
              paddingTop: "10px !important",
              marginBottom: "10px !important",
            }}>
            <MuiListItemIcon>
              <IconLogout />
            </MuiListItemIcon>
            <MuiListItemText className="text" style={{ fontSize: "12px" }}>
              Logout
            </MuiListItemText>
          </MuiMenuItem>
        </MuiMenuList>
      </MuiMenu>
    </UserProfileWrapper>
  );
};

const UserProfileWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;

  & .dropdown {
    padding: 5px;
    border: 0.3px solid #f1f2f5;
  }

  & .list {
    border-radius: 10px;
    display: flex !important;
    gap: 20px !important;
    align-items: center !important;
    padding: 0px;
    & .text span {
      font-size: 12px !important;
    }
  }

  @media screen and (max-width: px) {
    min-width: fit-content;
    & .user-name-section {
      display: none;
    }
  }
`;
