import * as React from "react";
import SimpleBar from "simplebar-react";
import { SwipeableDrawer } from "@mui/material";

import { MuiBox, styled } from "@/lib/index";
import Header from "@/components/header/Header";
import DesktopMenu from "@/components/nav/DesktopMenu";
import CustomMenu from "@/components/nav/CustomMenu";
import { Logo } from "@/components/logo";
import AppContext from "@/providers/appContext";
import VendgramCustomModal from "@/components/modal/Modal";
import { useUserStore } from "@/config/store-config/store.config";
import BreadCrumbs from "@/components/other/Breadcrumb";
import InAppRoutes from "@/routes/auth-routes";
import NotAuthorized from "@/components/other/401";
import UserIdlenessFeedback from "@/components/feedback/UserIdlenessFeedback";

export default function AppContentLayout() {
  const { isAuthorized } = useUserStore((state) => state);
  const [open, setOpen] = React.useState(false);

  const toggleDrawer =
    (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(() => state);
    };

  const year = new Date().getFullYear();

  return (
    <AppContext.Provider
      value={{
        open,
        toggleDrawer,
      }}>
      <Layout>
        <div className="menu">
          <DesktopMenu />
        </div>
        <SwipeableDrawer
          anchor="left"
          open={open}
          className="menu-wrapper"
          onClose={toggleDrawer(false)}
          sx={{
            width: "100%",
            maxWidth: "300px",
            overflow: "hidden",
            "& .MuiDrawer-paper": {
              width: "100%",
              maxWidth: "300px",
              overflow: "hidden",
            },
            "& .logo-section": {
              borderBottom: "1px solid #000",
              padding: "10px",
              marginBottom: "10px",
              position: "sticky",
              background: "#fff",
            },
          }}
          onOpen={toggleDrawer(true)}>
          <MuiBox
            component="section"
            sx={{ width: "100%", overflow: "hidden" }}
            id="mobile-menu">
            <div className="logo-section">
              <Logo className="mobile-logo" />
            </div>
            <div style={{ width: "100%", paddingLeft: "15px" }}>
              <CustomMenu />
            </div>
          </MuiBox>
        </SwipeableDrawer>

        <div className="content-area">
          <Header />
          <SimpleBar
            style={{ maxHeight: "calc(100vh - 56px)", position: "relative" }}>
            <PageContent>
              <Container>
                <BreadCrumbs />
                {/* <Outlet /> */}
                <InAppRoutes />
              </Container>
              <Footer>
                © {year} Rensa Technologies Ltd. All rights reserved
              </Footer>
            </PageContent>
          </SimpleBar>
          <VendgramCustomModal
            handleClose={() => null}
            open={!isAuthorized}
            closeOnOutsideClick={false}
            alignTitle="left"
            showClose={false}
            title={""}>
            <NotAuthorized />
          </VendgramCustomModal>
          <UserIdlenessFeedback />
        </div>
      </Layout>
    </AppContext.Provider>
  );
}

const Footer = styled.footer`
  width: 100%;

  padding-top: 10px;
  border-top: 1px solid #efefef;
  color: #64748b;
`;

const LogoutInfo = styled.span`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: auto;
  /* max-width: 200px; */
  text-align: center;

  & .timer {
    font-size: 24px;
    font-weight: bold;
    font-family: "Poppins";
    width: fit-content;
    margin: auto;
    text-align: center;
    color: tomato;
  }
`;

const Layout = styled.section`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding-bottom: 30px;
  /* background: #fff; */

  & .menu {
    width: 270px;
    background: #fdfdfd;
    min-height: 100vh;
    display: block;
  }

  & .content-area {
    background: #fdfdfd;
    flex: 1;
    height: 100%;
    min-height: 100vh;
  }

  & #mobile-menu {
    width: 100%;
    max-width: 250px;
    min-width: 100%;

    & .mobile-logo {
      width: 100px;
    }
  }

  @media screen and (max-width: 1050px) {
    & .menu {
      display: none !important;
    }
  }
`;

const PageContent = styled.main`
  width: 100%;
  flex: 1 auto;
  padding: 20px 20px 20px;
  background: #fff;
  /* background: #f2f5f9; */
  border-radius: 20px 0 0 0;
  min-height: calc(100vh - 80px);
  /* margin-top: 20px; */
  display: flex;
  flex-direction: column;
  gap: 20px;

  overflow-y: auto;

  @media screen and (max-width: 1050px) {
    border-radius: 0;
    padding: 0 20px 20px;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1300px;
  /* min-height: inherit; */
  flex: 1;
`;
