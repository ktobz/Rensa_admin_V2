import { MuiTypography, MuiTypographyProps } from "lib";
import * as React from "react";

export default function Heading({
  children,
  ...otherProps
}: MuiTypographyProps & {}) {
  return (
    <MuiTypography
      fontWeight="400"
      color="secondary"
      variant="h1"
      fontSize={20}
      fontFamily="Poppins"
      style={{
        color: "#000000",
        paddingBottom: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      sx={{
        "@media screen and (max-width:968px)": {
          fontSize: "15px",
        },
        // "@media screen and (max-width:568px)": {
        //   fontSize: "12px",
        // },
      }}
      {...otherProps}>
      {children}
    </MuiTypography>
  );
}
