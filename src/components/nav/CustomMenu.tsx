import * as React from "react";
import SimpleBar from "simplebar-react";

import {
  MuiListItemIcon,
  MuiListItemText,
  MuiMenuItem,
  MuiMenuList,
  styled,
} from "@/lib/index";
import AppContext from "@/providers/appContext";
import { useUserStore } from "config/store-config/store.config";
import {
  IconAppRelease,
  IconBars,
  IconBox,
  IconConfig,
  IconCustomers,
  IconHome,
  IconNotification,
  IconPayout,
  IconReport,
  IconSales,
  IconShop,
} from "lib/mui.lib.icons";
import { useLocation, useNavigate } from "react-router-dom";

const menuLinks = [
  {
    title: "Dashboard",
    path: "dashboard",
    icon: <IconHome />,
  },
  {
    title: "Orders",
    path: "orders",
    icon: <IconBox />,
  },
  {
    title: "Marketplace",
    path: "marketplace",
    icon: <IconShop />,
  },
  {
    title: "Users",
    path: "users",
    icon: <IconCustomers />,
  },
  {
    title: "Transactions",
    path: "transactions",
    icon: <IconBars />,
  },
  {
    title: "Payouts",
    path: "payouts",
    icon: <IconPayout />,
  },
  {
    title: "Sales Revenue",
    path: "sales-revenue",
    icon: <IconSales />,
  },
  {
    title: "Reported Listing",
    path: "reported-listing",
    icon: <IconReport />,
  },

  {
    title: "Configurations",
    path: "configurations",
    icon: <IconConfig />,
  },
  {
    title: "Notification Center",
    path: "notification-center",
    icon: <IconNotification />,
  },
  {
    title: "App Release",
    path: "app-release",
    icon: <IconAppRelease />,
  },
];

export default function CustomMenu() {
  const { logout } = useUserStore((state) => state);
  const { toggleDrawer } = React.useContext(AppContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isCurrent = (path: string) => {
    return pathname.includes(`/app/${path}`);
  };

  const handleNavigate = (path: string) => () => {
    navigate(`/app/${path}`);
    toggleDrawer(false)();
  };

  // const handleGotoPage = () => {
  //   toggleDrawer(false)();
  // };

  return (
    <StyledWrapper>
      <SimpleBar
        style={{
          position: "relative",
          paddingRight: "15px",
          paddingBottom: "20px",
          height: 'calc(100vh - 123px)'
        }}>
        <div className="menu-section">
          <div className="menu-wrapper">
            <MuiMenuList style={{ width: "100%" }}>
              {menuLinks.map((link) => (
                <MuiMenuItem
                  key={link.path}
                  onClick={handleNavigate(link.path)}
                  className={`list ${
                    isCurrent(`${link.path}`) ? "current" : ""
                  }`}>
                  <MuiListItemIcon className="icon">
                    {link.icon}
                  </MuiListItemIcon>
                  <MuiListItemText className="text">
                    <span>{link.title}</span>
                  </MuiListItemText>
                </MuiMenuItem>
              ))}
            </MuiMenuList>
          </div>
        </div>
      </SimpleBar>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.section`
  width: 100%;
  /* padding-bottom: 20px; */
  background-color: #fdfdfd;

  & .mobile-only {
    display: none;
    width: 100%;
    border-top: 1px solid #e1e1e1;

    @media screen and (max-width: 1050px) {
      display: unset;
    }
  }

  & .menu-section {
    flex: 1;
    width: 100%;
    /* min-height: calc(100vh - 80px); */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    & .logout-btn {
      background: #ffe0e018;
      border-radius: 10px;
      margin-top: 10px;

      & span {
        font-size: 13px;
      }
    }
  }

  & .menu-wrapper {
    width: 100%;
    flex: 1;

    & .list {
      border-radius: 10px;
      padding: 10px;
      color: #7f7f7f;
      margin: 5px 0;
      padding-left: 20px;

      & .text span {
        font-size: 13px;
        color: #7f7f7f;
      }
      & svg {
        color: #f05b2a;
        path {
          stroke: #f05b2a;
        }
      }
    }

    & .current {
      background: #f05b2a;
      & .text span {
        color: #fff;
      }
      & svg {
        color: #fff;
        path {
          stroke: #fff !important;
        }
      }
    }
  }

  & .help-card {
    position: relative;

    & .icon {
      width: 52px;
      height: 52px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 5px solid #fff;
      background: #000;
      position: absolute;
      top: calc(-52px / 2);
      margin: 0 auto;
      left: 0;
      right: 0;
      border-radius: 50%;
      color: #fff;
      z-index: 2;
    }

    & .wrapper {
      overflow: hidden;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: flex-end;
      background: #000;
      border-radius: 10px;
      padding: 15px;
      min-height: 278px;
      gap: 40px;
      position: relative;

      &::before {
        content: "";
        width: 160px;
        height: 160px;
        left: -94px;
        top: -100px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 50%;
        position: absolute;
      }

      &::after {
        content: "";
        width: 160px;
        height: 160px;
        left: 120px;
        top: 168px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 50%;
        position: absolute;
      }
    }

    & .content {
      text-align: center;

      & .title,
      & .body {
        text-align: center;
        color: #fff;
        font-size: 12px;
      }
      & .title {
        font-weight: 700;
        font-size: 16px;
        line-height: 150%;
        margin-bottom: 5px;
      }
    }
    & .btn {
      background: #fff;
      color: #000;
      width: 100%;
      font-weight: 600;
    }
  }
`;
