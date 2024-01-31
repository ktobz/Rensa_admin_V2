import * as React from "react";
import { MuiButton, MuiButtonProps } from "../../lib";

export default function PrimaryButton({
  children,
  ...otherProps
}: MuiButtonProps) {
  return <MuiButton {...otherProps}>{children}</MuiButton>;
}
