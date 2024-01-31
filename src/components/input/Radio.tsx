import { FormControlLabelProps } from "@mui/material";
import { MuiBox, MuiFormControlLabel, MuiRadio } from "lib/index";
import * as React from "react";

export default function AppRadio({
  label,
  ...others
}: Omit<FormControlLabelProps, "control">) {
  return (
    <MuiFormControlLabel
      {...others}
      control={<MuiRadio color="secondary" />}
      label={
        <MuiBox sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {label}
        </MuiBox>
      }
      labelPlacement="start"
      color="secondary"
    />
  );
}
