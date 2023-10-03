import * as React from "react";
import { useNavigate } from "react-router-dom";

import { MuiCardMedia, MuiCardMediaProps } from "lib";
import LogoMain from "assets/icon/logo_main.svg";
import LogoWhite from "assets/image/logo.svg";

type TLogoType = MuiCardMediaProps & {
  type?: "white" | "black";
};

export const Logo = ({ type = "black", className, sx, style }: TLogoType) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/app/home");
  };
  return (
    <MuiCardMedia
      component="img"
      src={type === "black" ? LogoMain : LogoWhite}
      style={{
        cursor: "pointer",
        width: "70%",
        marginTop: "13px",
        ...style,
        userSelect: "none",
      }}
      onClick={handleGoHome}
      className={className}
      sx={sx}
      alt="logo"
      width="120px"
      // {...otherProps}
    />
  );
};
