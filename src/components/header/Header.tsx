import * as React from "react";
import { useLocation } from "react-router-dom";

import { MuiIconButton, MuiTypography, styled } from "@/lib/index";
import { UserMenu } from "./UserProfile";
import { IconMenu } from "@/lib/mui.lib.icons";
import { Logo } from "@/components/logo";
import AppContext from "@/providers/appContext";
import PageTitle from "../text/PageTitle";

export default function Header() {
  const { toggleDrawer } = React.useContext(AppContext);

  const { pathname } = useLocation();
  const title = pathname?.split("/")?.[2] || "Dashboard";

  return (
    <StyledWrapper>
      <div className="desktop">
        <PageTitle title={title} />
        <div className="profile-wrapper">
          <div className="user-name">
            <div>
              <MuiTypography variant="body2" className="name">
                Admin Access
              </MuiTypography>
            </div>
          </div>

          <UserMenu />
        </div>
      </div>

      <div className="mobile">
        <div className="logo-section">
          <Logo />
        </div>
        <div className="right">
          <MuiIconButton
            className="menu-btn"
            style={{ padding: 0 }}
            onClick={toggleDrawer(true)}>
            <IconMenu />
          </MuiIconButton>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.header`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding: 15px 20px 0 20px;
  background-color: #fdfdfd;
  align-items: center;

  & .page-title {
    text-transform: capitalize;
  }

  & .desktop {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    gap: 30px;
    width: 100%;

    & .image-wrapper {
      width: 45px;
      height: 45px;
      background: #dddddd;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      object-fit: contain;
    }
    & .profile-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;

      & .user-name {
        & .name {
          font-weight: 500;
          font-size: 14px;
          line-height: 23px;
          color: #000000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          max-width: 140px;
          text-align: end;
        }

        & .position {
          font-weight: 400;
          font-size: 12px;
          line-height: 17px;
          color: #aeaeae;
          text-align: end;
        }
      }
    }
  }

  & .mobile {
    display: none;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: relative;

    & .menu-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  @media screen and (max-width: 1050px) {
    & .desktop {
      display: none;
    }

    & .mobile {
      display: flex;
    }
  }
`;
