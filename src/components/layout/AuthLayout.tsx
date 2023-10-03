import * as React from "react";
import SEO from "@/components/seo";
import { MuiTypography, styled } from "@/lib/index";
import authBG from "@/assets/image/auth-bg.png";
import { Logo } from "../logo";

interface IAuthPageProp {
  pageTitle: string;
  pageDescription: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  pageDescription,
  pageTitle,
  children,
}: IAuthPageProp) {
  return (
    <SEO description={pageDescription} title={pageTitle}>
      <PageLayout>
        <div className="left-section">
          <div className="wrapper">
            <Logo className="auth-page-logo" />
            <PageContent>{children}</PageContent>
          </div>
        </div>
        <div className="banner-section">
          <div className="text-group">
            <MuiTypography variant="h2" className="title">
              Manage Activities
            </MuiTypography>
            <MuiTypography variant="body1" className="body">
              Manage activities from all your branches. You can add product,
              pump/sale price, managers and create new branch outlet for your
              customers
            </MuiTypography>
          </div>
          {/* <img src={authBG} className="bg" width="100%" /> */}
        </div>
      </PageLayout>
    </SEO>
  );
}

const PageLayout = styled.section`
  width: 100%;
  height: auto;
  min-height: 100vh;
  overflow-y: auto;
  align-items: center;
  display: flex;
  overflow: auto;
  margin: 0 auto;
  align-items: center;
  overflow: hidden;

  & .auth-page-logo {
    width: 50% !important;
  }

  & .banner-section {
    width: 50%;
    max-width: 800px;
    overflow: hidden;
    /* background: rgba(30, 117, 187, 0.307292); */
    background-image: url(${authBG}),
      linear-gradient(
        180deg,
        rgba(30, 117, 187, 0) 22.29%,
        rgba(30, 117, 187, 0.307292) 57.62%,
        #1e75bb 70.56%
      );
    background-size: cover;
    background-repeat: no-repeat;
    /* background-blend-mode: soft-light; */
    height: 100%;
    min-height: inherit;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;

    & .text-group {
      z-index: 2;
      width: 100%;
      text-align: center;
      min-height: 200px;
      padding: 40px 30px 100px 30px;
      background-color: #1e75bb;
      box-shadow: 0 -120px 100px #1e75bb;

      & .title {
        font-style: normal;
        font-weight: 600;
        font-size: 24px;
        line-height: 130%;
        color: #ffffff;
        max-width: 400px;
        text-align: center;
        margin: auto;
      }

      & .body {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 160%;
        color: #ffffff;
        max-width: 350px;
        text-align: center;
        margin: 20px auto 0 auto;
      }
    }
  }

  & .left-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    width: 50%;
    flex: 1;
    /* max-width: 800px; */
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    height: auto;
    min-height: inherit;

    & .wrapper {
      width: 100%;
      max-width: 500px;
      height: 100%;
      min-height: 100%;
    }
  }

  @media screen and (max-width: 1069px) {
    & .banner-section {
      min-width: 280px;
    }

    & .left-section {
      display: flex;
    }
  }
`;

const PageContent = styled.section`
  width: 100%;
  overflow: hidden;
`;
