import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange, blue, green, red, grey } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";

declare module "@mui/material/styles" {
  interface ThemeOptions {
    status?: {
      danger?: string;
      info?: string;
      warning?: string;
      success?: string;
      ghost?: string;
    };
  }

  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    tablet: true; // adds the `tablet` breakpoint
    laptop: true;
    desktop: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#F05B2A",
      light: "#1B76FF",
    },
    secondary: {
      main: "#1E75BB",
    },
    // font: {
    //   main: "#616161",
    // },
    // secondary: {
    //   main: "#030949",
    // },
    // secondary: {
    //   main: "#030949",
    // },
  },
  status: {
    danger: "#EF5050",
    info: blue[300],
    warning: orange[300],
    success: "#39B54A",
    ghost: grey[400],
  },
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1024,
      desktop: 1280,
    },
  },
  typography: {
    fontFamily: ["Inter", "Helvetica", "Open Sans", "sans-serif"].join(","),
    allVariants: {
      color: "#282828",
      fontWeight: "400",
      fontSize: "14px",
    },

    button: {
      fontSize: "14px",
      fontWeight: "500",
      borderRadius: 0,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none !important",
          fontSize: "13px",
          textTransform: "inherit",
          borderRadius: 6,
          height: "55px",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        rail: {
          background: "darkgrey",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "#fff",
          boxShadow: "0 0 10px #d6d6d6",
        },
        popperArrow: {
          // display: "none",
          // background: "red",
        },
        tooltipArrow: {
          // display: "none",
        },
        arrow: {
          color: "#fff",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        filled: {
          transform: "translate(0, -24px) scale(1)",
          "&$marginDense": {
            // transform: "translate(0, -24px) scale(1)",
          },
        },
        // outline: {
        //   transform: "translate(14px, -6px) scale(0.75)",
        // },
        root: {
          textTransform: "capitalize",
          fontSize: "1rem",
          color: "#0F172A",
        },
        formControl: {
          color: "#0F172A",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          top: "20px",
          // border: `1px solid red`,
          outline: `1px solid transparent`,
          fontSize: "13px",
          borderRadius: "6px",
          backgroundColor: "#F9F9F9",

          "&$focused": {
            border: `1px solid #000`,
            outline: `1px solid #000`,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: "#F9F9F9",

          "&:before": {
            // display: "none",
          },
        },
        input: {
          padding: "12px",
          fontSize: "13px",
          // backgroundColor: "#F9F9F9",
          // borderColor: "transparent",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: "#F9F9F9 !important",
          borderColor: "white !important",
        },
        input: {
          padding: "12px",
          fontSize: "13px",
          // backgroundColor: "#F9F9F9 !important",
          borderColor: "transparent !important",
        },
        notchedOutline: {
          borderColor: "#fff",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {},
    },

    MuiCheckbox: {
      styleOverrides: {
        // Name of the slot
        root: {
          borderRadius: "5px",
          padding: "3px",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: "0px 2px 5px 0px #00000026",
          paddingTop: "10px",
          marginTop: "5px",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#f4f4f4",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#0F172A",
          "&.Mui-focused": {
            color: "#0F172A",
          },
        },
      },
    },
  },
});

export default function MUIThemeConfig(props: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}
