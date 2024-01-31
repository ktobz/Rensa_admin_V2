import React from "react";
import { useTimer } from "react-timer-hook";

import { IconBlock, MuiButton, MuiTypography, styled } from "@/lib/index";
import { Logo } from "components/logo";
import { useUserStore } from "@/config/store-config/store.config";

export default function NotAuthorized() {
  const { logout } = useUserStore((state) => state);

  const time = new Date();
  time.setSeconds(time.getSeconds() + 10); // 5 seconds timer

  const { seconds } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      logout();
    },
  });
  const handleLogout = () => {
    logout();
  };

  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="nf_left">
          <IconBlock className="block-icon" />
        </div>
        <div className="nf_right">
          <div className="content_body">
            <MuiTypography variant="h5" className="subtitle">
              Unauthorized!
            </MuiTypography>
            <MuiTypography variant="body1" className="body">
              Oops, you are not authorized to view this page. Your session might
              have expired and you will need to re-login.
            </MuiTypography>

            <MuiButton
              id="cta"
              onClick={handleLogout}
              variant="contained"
              className="btn"
              color="primary">
              Okay ({seconds}s)
            </MuiButton>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.section`
  width: calc(100vw - 40px);
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;

  & .block-icon {
    width: 200px;
  }

  & .icon {
    width: 180px;
    margin: auto;
  }
  .wrapper {
    width: 100%;
    max-width: 500px;
    padding: 20px;
    display: flex;
    gap: 30px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  & .nf_right {
    /* display: flex; */
    text-align: center;

    & .subtitle {
      font-size: 25px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    & .content_body {
      font-size: 16px;
      max-width: 350px;
      margin-top: 20px;
    }

    #cta {
      margin-top: 30px;
      width: 100%;
    }
  }
`;
