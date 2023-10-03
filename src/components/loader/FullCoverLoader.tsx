import { MuiBox } from "lib";
import React from "react";
import { Loader } from "./Loader";

export default function FullCoverLoader() {
  return (
    <MuiBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      position="absolute"
      bgcolor="#ffffff85">
      <Loader size={30} />
    </MuiBox>
  );
}
