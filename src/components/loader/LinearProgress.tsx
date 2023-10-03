import { MuiLinearProgressClasses, MuiLinearProgress, styled } from "lib";
import * as React from "react";

const LinearProgressBar = styled(MuiLinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  //   [`&.${MuiLinearProgressClasses.colorPrimary}`]: {
  //     backgroundColor:
  //       theme.palette.grey[theme. === "light" ? 200 : 800],
  //   },
  [`& .${MuiLinearProgressClasses.bar}`]: {
    borderRadius: 5,
    // backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

export default LinearProgressBar;
