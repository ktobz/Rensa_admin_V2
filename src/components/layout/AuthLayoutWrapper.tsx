import * as React from "react";
import SEO from "components/seo";
import { styled } from "lib";
import { Logo } from "components/logo";

interface IAuthPageProp {
  pageTitle: string;
  pageDescription: string;
  children: React.ReactNode;
}

export default function AuthLayoutWrapper({
  pageDescription,
  pageTitle,
  children,
}: IAuthPageProp) {
  return (
    <SEO description={pageDescription} title={pageTitle}>
      <PageLayout>
        <div className="form-wrapper">
          <Logo type="black" className="logo" />
          <PageContent>{children}</PageContent>
        </div>
      </PageLayout>
    </SEO>
  );
}

const PageLayout = styled.section`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow-y: auto;
  height: 100%;
  align-items: center;
  display: flex;
  gap: 20px;
  overflow: auto;
  margin: 0 auto;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  background-color: #fff;

  & .logo {
    width: 220px !important;
  }

  & .form-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    width: 100%;
    flex: 1;
    max-width: 450px;
    padding: 20px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
  }
`;

const PageContent = styled.section`
  background-color: #fff;
  /* box-shadow: 0 0 20px rgba(0, 0, 0, 0.05); */
  border-radius: 6px;
  width: 100%;
  overflow: hidden;
  position: relative;
`;
