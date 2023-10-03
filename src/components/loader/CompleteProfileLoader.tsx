import * as React from "react";
import { MuiBox, MuiSkeleton, styled } from "lib";

export default function CompleteProfileLoader() {
  return (
    <PageLayout>
      <div className="left-section">
        <MuiSkeleton
          className="logo-skeleton"
          variant="rectangular"
          animation="pulse"
        />
        <MuiBox className="description">
          <MuiSkeleton
            animation="pulse"
            className="text-skeleton"
            variant="rectangular"
            style={{ width: "30%", height: "60px" }}
          />
          <MuiSkeleton
            animation="pulse"
            className="text-skeleton"
            variant="rectangular"
            style={{ width: "60%", height: "60px" }}
          />
          <MuiSkeleton
            animation="pulse"
            className="text-skeleton"
            variant="rectangular"
            style={{ width: "40%", height: "60px" }}
          />
        </MuiBox>
      </div>
      <div className="form-wrapper">
        <PageContent>
          <MuiBox marginTop="30px" width="100%">
            <MuiSkeleton
              animation="pulse"
              className="title-skeleton"
              variant="rectangular"
              style={{
                width: "100%",
                maxWidth: "120px",
                height: "30px",
                borderRadius: "20px",
              }}
            />
            <MuiSkeleton
              animation="pulse"
              className="subtitle-skeleton"
              variant="rectangular"
              style={{
                width: "100%",
                maxWidth: "600px",
                height: "20px",
                borderRadius: "20px",
                marginTop: "20px",
              }}
            />

            <MuiBox marginTop="30px" width="100%">
              <MuiSkeleton
                animation="pulse"
                className="linear-pulse"
                variant="rectangular"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "10px",
                  borderRadius: "20px",
                  marginTop: "20px",
                }}
              />
            </MuiBox>
          </MuiBox>

          <MuiBox marginTop="30px" width="100%" className="form-group">
            <MuiBox width="100%" className="form-section">
              <MuiSkeleton
                animation="pulse"
                className="skeleton"
                variant="rectangular"
                style={{ width: "100%", height: "45px" }}
              />
              <MuiSkeleton
                animation="pulse"
                className="skeleton"
                variant="rectangular"
                style={{ width: "100%", height: "45px" }}
              />
            </MuiBox>
            <MuiBox width="100%" className="form-section">
              <MuiSkeleton
                animation="pulse"
                className="skeleton"
                variant="rectangular"
                style={{ width: "100%", height: "45px" }}
              />
              <MuiSkeleton
                animation="pulse"
                className="skeleton"
                variant="rectangular"
                style={{ width: "100%", height: "45px" }}
              />
            </MuiBox>
            <MuiBox width="100%" className="form-section">
              <MuiSkeleton
                animation="pulse"
                className="skeleton"
                variant="rectangular"
                style={{ width: "100%", height: "45px" }}
              />
            </MuiBox>
          </MuiBox>
        </PageContent>
      </div>
    </PageLayout>
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
    background: #757575;
    position: relative;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    & .logo-skeleton {
      max-width: 200px;
      width: 30% !important;
      border-radius: 10px;
      height: 20px;
    }

    & .text-skeleton,
    .skeleton {
      border-radius: 10px;
    }

    & .description {
      max-width: 472px;
      width: 100%;
      flex-wrap: wrap;
      display: flex;
      gap: 20px;
      align-items: center;
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

  & .actions {
    display: flex;
    gap: 20px;
    align-items: center;

    & .cta-btn {
      transition: all 0.3s ease;
    }
  }

  & .form-section {
    display: flex;
    gap: 20px;
    align-items: start;
    width: 100%;
    margin-top: 30px;
  }
  & .form-group {
    width: 100%;
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
