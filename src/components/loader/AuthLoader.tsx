import * as React from "react";
import { MuiSkeleton, styled } from "lib";

export default function AuthLoader() {
  return (
    <PageLayout>
      <div className="form-wrapper">
        <MuiSkeleton
          className="logo-skeleton"
          variant="rectangular"
          animation="pulse"
        />
        <PageContent>
          <MuiSkeleton
            animation="pulse"
            className="skeleton"
            variant="rectangular"
          />
        </PageContent>
      </div>
    </PageLayout>
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

  & .logo-skeleton {
    max-width: 200px;
    width: 70%;
    border-radius: 10px;
    height: 60px;
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
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  width: 100%;
  overflow: hidden;
  position: relative;

  & .skeleton {
    width: 100%;
    height: 400px;
    border-radius: 10px;
  }
`;
