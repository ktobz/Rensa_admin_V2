import * as React from "react";
import {
  MuiIconButton,
  MuiMenu,
  MuiTypography,
  styled,
  MuiMenuList,
} from "lib/index";
// import { IconBell } from "lib/mui.lib.icons";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import { IconBell } from "lib/mui.lib.icons";
import SimpleBar from "simplebar-react";

export default function NotificationPopup(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (route: string) => () => {
    navigate(route);
    handleClose();
  };

  return (
    <div {...props}>
      <MuiIconButton onClick={handleClick} sx={{ position: "relative" }}>
        <IconBell />
        <Badge
          sx={{
            fontSize: "9px",
            backgroundColor: " #000",
            borderRadius: "50%",
            padding: "3px",
            marginLeft: "-5px",
            marginTop: "-20px",
            color: "#fff",
          }}></Badge>
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
            padding: "0 !important",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: "calc((100% - 5px) / 2)",
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
        <MuiMenuList
          sx={{
            padding: "0",

            width: "435px",
            minWidth: "fit-content",
            position: "relative",
            "& .list": {
              padding: "5px 10px",
              minHeight: "fit-content",
              margin: "10px 0 0",
              "&:hover": {
                background: "#F2F5F9",
                borderRadius: "5px",
              },
            },
          }}
          className="menu-list">
          <StyledHeading>
            <MuiTypography className="header-text" variant="h3">
              Notifications
            </MuiTypography>
          </StyledHeading>

          <SimpleBar style={{ maxHeight: "350px", position: "relative" }}>
            {data.map((notice) => (
              <NotificationItem data={notice} />
            ))}
          </SimpleBar>
        </MuiMenuList>
      </MuiMenu>
    </div>
  );
}

const data = [
  {
    title: "New Naira Wallet Funding",
    body: "You can now fund your naira wallet with USSD from your local bank account",
    time: "24 hours ago",
  },
  {
    title: "New Update",
    body: "You can now fund your naira wallet with USSD from your local bank account",
    time: "24 hours ago",
  },
  {
    title: "New Naira Wallet Funding",
    body: "You can now fund your naira wallet with USSD from your local bank account",
    time: "24 hours ago",
  },
  {
    title: "New Naira Wallet Funding",
    body: "You can now fund your naira wallet with USSD from your local bank account",
    time: "24 hours ago",
  },
  {
    title: "New Naira Wallet Funding",
    body: "You can now fund your naira wallet with USSD from your local bank account",
    time: "24 hours ago",
  },
];

const StyledHeading = styled.section`
  border-bottom: 1px solid #f6f6f6;
  padding-bottom: 15px;
  padding: 20px 25px;

  & .header-text {
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: #000000;
  }
`;

type INotificationProp = {
  data: any;
};

export function NotificationItem({ data }: INotificationProp) {
  return (
    <StyledSection>
      <MuiTypography variant="body1" className="title">
        {data?.title}
      </MuiTypography>
      <MuiTypography
        variant="subtitle2"
        className="body"
        color="text.secondary">
        {data?.body}
      </MuiTypography>
      <MuiTypography
        variant="subtitle2"
        className="time"
        color="text.secondary">
        {data?.time}
      </MuiTypography>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  width: 100%;
  padding: 25px 20px 10px;
  border-bottom: 1px solid #eaeaea;

  & .title {
    font-weight: 500;
    font-size: 18px;
    line-height: 23px;
    color: #000000;
    margin-bottom: 5px;
    font-family: "Helvetica";
  }

  & .body {
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 17px;
    font-family: "Helvetica";
  }

  & .time {
    font-size: 14px;
    line-height: 16px;
    color: #aeaeae;
    margin-top: 5px;
  }
`;
