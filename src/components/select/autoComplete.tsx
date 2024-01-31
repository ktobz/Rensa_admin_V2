import { MenuItem, Select, SelectProps } from "@mui/material";
import * as React from "react";
import {
  MuiCheckbox,
  MuiFormControl,
  MuiHelperText,
  MuiIconButton,
  MuiInputLabel,
  muiStyled,
  MuiTypography,
} from "lib/index";
import { IconArrowDownIcon, IconInfo } from "lib/mui.lib.icons";
import { CustomToolTip } from "components/feedback/Tooltip";

const SelectInputStyle = muiStyled(Select)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(1),
  },
  "& .MuiOutlinedInput-root": {
    // padding: "15px 20px",
    borderRadius: 0,
    background: "#F0F0F0",
    minHeight: "42px",
    // height: "45px",
    // marginBottom: 10,

    ".MuiSvgIcon-root": {
      fontSize: "20px",
    },

    // "& .MuiOutlinedInput-notchedOutline": {
    //   borderColor: "#F0F0F0",
    // },
    // "& fieldset": {
    //   borderColor: "#b8b8b8",
    // },
    // "&:hover .MuiOutlinedInput-notchedOutline": {
    //   borderColor: "#b8b8b8",
    // },
    // "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    //   borderColor: `${theme.palette.primary.main}`,
    // },
  },

  "& .MuiOutlinedInput-input": {
    fontSize: "13px",
    padding: "14px 14px",
    // height: "45px !important",
  },

  borderRadius: 6,
  position: "relative",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#2b2b2b",
  fontSize: 13,
  width: "100%",
  transition: theme.transitions.create([
    "border-color",
    "background-color",
    "box-shadow",
  ]),
  left: 0,
}));

const LabelStyle = muiStyled(MuiInputLabel)(({ theme }) => ({
  position: "relative",
  color: "#000",
  fontWeight: "500",
  fontSize: 13,
  width: "100%",
  top: "-15px",
  marginTop: "10px",
  left: "-15px",
  pointerEvents: "initial",
  textTransform: "initial",
  overflow: "unset",
  "& .Mui-focused": {
    borderColor: theme.palette.primary.main,
  },

  "& .info": {
    // cursor: "pointer",
    // width: "12px",
    // display: "inline-block",
    marginLeft: "3px",
    marginBottom: "2px",

    "& svg": {
      width: "13px",
      height: "13px",
    },
  },
}));

interface AppSelectProps extends SelectProps {
  options: any[];
  optionTitle?: string;
  optionValue?: string;
  optionCheckbox?: boolean;
  name?: string;
  toolTipText?: string;
  helperText?: any;
}

export default function AppSelect({
  label,
  fullWidth,
  placeholder,
  id,
  className,
  error,
  required,
  options,
  optionTitle = "name",
  optionValue = "id",
  value,
  toolTipText = "",
  sx,
  optionCheckbox = false,
  name,
  helperText,
  ...otherProps
}: AppSelectProps) {
  const [open, setOen] = React.useState(false);

  const handleOpen = () => {
    setOen(true);
    // alert("hello");
  };

  const handleClose = () => {
    setOen(false);
  };

  return (
    <MuiFormControl
      error={error}
      fullWidth
      id={id}
      // margin="dense"
      sx={{
        "& .grey-out": {
          color: "#b1b1b1",
          fontSize: "13px",
        },
        marginTop: "10px",
        marginBottom: "0",
        "& .MuiSelect-select": {
          "& .MuiCheckbox-root": {
            display: "none",
          },
        },
        ...sx,
      }}
      className={className}
      variant="outlined">
      {!!label && (
        <LabelStyle color="primary" shrink={false} htmlFor={name}>
          {label}{" "}
          {required && (
            <MuiTypography
              style={{ color: "red" }}
              sx={{ display: "inline", verticalAlign: "-3px", lineHeight: 0 }}>
              *
            </MuiTypography>
          )}
          {toolTipText && (
            <CustomToolTip
              // style={{ marginLeft: "10px" }}
              title={
                <MuiTypography variant="subtitle2" fontSize={10}>
                  {toolTipText}
                </MuiTypography>
              }>
              <MuiIconButton
                className="info"
                style={{ cursor: "pointer", padding: 0 }}>
                <IconInfo />
              </MuiIconButton>
            </CustomToolTip>
          )}
        </LabelStyle>
      )}

      <SelectInputStyle
        color="primary"
        error={error}
        name={name}
        id={name}
        placeholder={placeholder}
        className={`${className} ${
          value === "none" || value === 0 ? "grey-out" : ""
        }`}
        value={value}
        IconComponent={IconArrowDownIcon}
        {...otherProps}>
        {placeholder && (
          <MenuItem value={0} className="grey-out" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options &&
          options.map((opt: any, index) => (
            <MenuItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 14,

                minHeight: "20px",
              }}
              value={opt[optionValue]}>
              {opt[optionTitle]}
              {optionCheckbox && opt[optionValue] === value && (
                <MuiCheckbox checked disableRipple />
              )}
            </MenuItem>
          ))}
      </SelectInputStyle>
      {helperText && (
        <MuiHelperText
          style={{
            color: error ? "tomato" : "gray",
            fontSize: "12px",
            marginLeft: "0",
          }}
          error={error}>
          {helperText}
        </MuiHelperText>
      )}
    </MuiFormControl>
  );
}
