import React from "react";
import { MuiTypography, MuiTypographyProps } from "../../lib";

export default function Title({ children, ...otherProps }: MuiTypographyProps) {
  return (
    <MuiTypography
      variant="h1"
      fontWeight="500"
      textAlign="center"
      lineHeight="150%"
      fontSize={24}
      fontFamily="Helvetica-Bold"
      sx={{
        "@media screen and (max-width:968px)": {
          fontSize: "20px",
          // margin: "auto 48px",
        },
        "@media screen and (max-width:568px)": {
          fontSize: "16px",
          // margin: "auto 20px",
        },
        "@media screen and (max-width:425px)": {
          fontSize: "16px",
          // margin: "auto 10px",
        },
      }}
      component="h1"
      {...(otherProps as any)}>
      {children}
    </MuiTypography>
  );
}
