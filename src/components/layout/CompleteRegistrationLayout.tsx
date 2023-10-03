import * as React from "react";
import SEO from "components/seo";
import { MuiTypography, styled } from "lib";
import { Logo } from "components/logo";
import { IconFounder } from "lib/mui.lib.icons";

interface IAuthPageProp {
  pageTitle: string;
  pageDescription: string;
  children: React.ReactNode;
}

export default function CompleteRegistrationLayout({
  pageDescription,
  pageTitle,
  children,
}: IAuthPageProp) {
  return (
    <SEO description={pageDescription} title={pageTitle}>
      <PageLayout>
        <div className="left-section">
          <Logo type="white" className="logo" />
          <MuiTypography variant="body1" className="description">
            Built by Founders for Founders
          </MuiTypography>
          <IconFounder className="founder-icon" />
        </div>
        <div className="form-wrapper">
          <PageContent>{children}</PageContent>
        </div>
      </PageLayout>
    </SEO>
  );
}

const PageLayout = styled.section`
  width: 100%;
  height: 100%;
  height: 100vh;
  overflow-y: auto;
  align-items: center;
  display: flex;
  overflow: auto;
  margin: 0 auto;
  align-items: center;
  overflow: hidden;

  & .left-section {
    width: 35%;
    max-width: 800px;
    min-width: 300px;
    padding: 60px;
    min-height: 100vh;
    height: 100%;
    background: #000000;
    position: relative;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    & .founder-icon {
      position: absolute;
      margin: 0 auto;
      left: 0;
      right: 0;
      top: calc(50% - 100px);
      z-index: 0;
    }

    & .logo {
      width: 30% !important;
      z-index: 1;
    }

    & .description {
      max-width: 472px;
      width: 100%;

      font-family: "Poppins";
      font-style: normal;
      font-weight: 600;
      font-size: 60px;
      line-height: 130%;
      color: #ffffff;
      z-index: 1;
    }
  }

  & .form-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    width: 100%;
    flex: 1;
    max-width: 800px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @media screen and (max-width: 1069px) {
    & .left-section {
      min-width: 280px;
      padding: 40px;

      & .description {
        font-size: 40px;
      }
    }

    & .form-wrapper {
      display: flex;
    }
  }
`;

const PageContent = styled.section`
  width: 100%;
  overflow: hidden;
`;
