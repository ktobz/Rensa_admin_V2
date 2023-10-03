import React from "react";
import { MuiBox, MuiTypography } from "../../lib";

type IPageProps = {
  title: string;
  subtitle?: React.ReactNode;
  rightComponent?: React.ReactNode;
  titleAction?: React.ReactNode;
};

export default function PageTitle({
  subtitle = "",
  title,
  titleAction,
  rightComponent,
}: IPageProps) {
  return (
    <MuiBox marginTop="30px" width="100%" marginBottom="20px">
      <MuiTypography
        textAlign="left"
        sx={{
          display: "flex",
          gap: "20px",
          textTransform: "capitalize",
          // justifyContent: "space-between",
          alignItems: "center",
          "@media screen and (max-width:780px)": {
            fontSize: 24,
          },
          "@media screen and (max-width:450px)": {
            fontSize: 18,
          },
        }}
        fontFamily="Helvetica"
        // className="page-title"
        fontWeight={600}
        fontSize={32}
        variant="h1">
        {title} {titleAction && titleAction}
      </MuiTypography>
      <div
        className="subtitle-section"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginTop: "10px",
        }}>
        {!!subtitle && (
          <MuiTypography variant="body2" style={{ color: "#AEAEAE" }}>
            {subtitle}
          </MuiTypography>
        )}

        {rightComponent}
      </div>
    </MuiBox>
  );
}
