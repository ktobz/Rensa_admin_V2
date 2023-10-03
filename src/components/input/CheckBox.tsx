import { FormControlLabelProps } from "@mui/material";
import { MuiBox, MuiFormControlLabel, MuiCheckbox } from "lib/index";
import * as React from "react";

interface ICheckBoxProps
  extends Omit<FormControlLabelProps, "control" | "onChange"> {
  onChange:
    | ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void)
    | undefined;
}

export default function CustomCheckbox({
  label,
  onChange,
  ...others
}: ICheckBoxProps) {
  return (
    <MuiFormControlLabel
      {...others}
      sx={{ fontSize: "10px" }}
      control={
        <MuiCheckbox color="secondary" size="small" onChange={onChange} />
      }
      label={
        <MuiBox
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            fontSize: 12,
          }}>
          {label}
        </MuiBox>
      }
      labelPlacement="start"
      color="secondary"
    />
  );
}
