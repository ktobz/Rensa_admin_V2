import React from "react";
import { MuiBox, MuiButton, MuiTypography, styled } from "lib";
import { ReactComponent as IconNotFound } from "assets/icon/404.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Logo } from "components/logo";

export default function NotFound() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/");
  };
  return (
    <StyledWrapper>
      <div className="wrapper">
        <Logo />
        <div className="nf_left">
          <IconNotFound height={180} width={180} />
        </div>
        <div className="nf_right">
          <div className="content_body">
            <MuiTypography variant="h5" className="subtitle">
              Page Not Found!
            </MuiTypography>
            <MuiTypography variant="body1" className="body">
              Oops, the page your’re looking for doesn’t exist.
            </MuiTypography>

            <MuiButton onClick={handleGoBack} id="cta" variant="contained">
              Back home
            </MuiButton>

            <MuiTypography variant="body2" marginTop="48px" textAlign="center">
              Something wrong?{" "}
              <MuiBox
                to="#"
                fontWeight={600}
                color="primary.main"
                sx={{
                  textUnderlineOffset: "2px",
                  textDecoration: "none",
                  color: "primary.main",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                component={Link}>
                {" "}
                Report an issue
              </MuiBox>{" "}
            </MuiTypography>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  min-height: 100vh;
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
