import { MenuItem, Select, SelectProps } from "@mui/material";
import * as React from "react";
import {
  MuiCardMedia,
  MuiFormControl,
  MuiHelperText,
  MuiInputLabel,
  muiStyled,
  MuiTypography,
} from "@/lib/index";
import { IconArrowDownIcon } from "@/lib/mui.lib.icons";

const StyledSelect = muiStyled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    background: "#ffffff",
    minHeight: "42px",
    height: "45px",
    ".MuiSvgIcon-root": {
      fontSize: "20px",
    },
  },

  "& .MuiOutlinedInput-input": {
    fontSize: "13px",
    padding: "10px 14px",
    backgroundColor: "#ffffff",
  },
  borderRadius: 6,
  position: "relative",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#2b2b2b",
  fontSize: 13,
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
  textTransform: "initial",
  transform: "none",
  width: "fit-content",
  maxWidth: "fit-content",
  overflow: "unset",

  "& .Mui-focused": {
    borderColor: theme.palette.primary.main,
  },
}));

interface AppSelectProps extends SelectProps {
  options: any[];
  optionTitle?: string;
  optionValue?: string;
  optionCheckbox?: boolean;
  name?: string;
  helperText?: React.ReactNode | any;
  iconName?: string;
}

export default function CustomStyledSelect({
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
  sx,
  optionCheckbox = false,
  name,
  iconName,
  helperText,
  ...otherProps
}: AppSelectProps) {
  return (
    <MuiFormControl
      error={error}
      fullWidth
      id={id}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "start",
        gap: "20px",
        "& .grey-out": {
          color: "#b1b1b1",
          fontSize: "13px",
        },
        marginBottom: "0",
        // "& .MuiSelect-select": {
        //   backgroundColor: "#fff",
        //   "& .MuiCheckbox-root": {
        //     display: "none",
        //   },
        // },
        "& .MuiList-root": {
          padding: 0,
          paddingBottom: "0 !important",
          display: "none",
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
        </LabelStyle>
      )}

      <StyledSelect
        color="primary"
        error={error}
        id={name}
        placeholder={placeholder}
        className={`${className} ${
          value === "none" || value === 0 ? "grey-out" : ""
        }`}
        value={value || placeholder}
        name={name}
        IconComponent={IconArrowDownIcon}
        {...otherProps}>
        {/* {placeholder && (
          <MenuItem value={0} className="grey-out" disabled>
            {placeholder}
          </MenuItem>
        )} */}
        {options &&
          options.map((opt: any, index) => (
            <MenuItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                minHeight: "20px",
                borderBottom: "1px solid #eaeaea",
              }}
              value={opt[optionValue]}>
              <MuiTypography
                variant="body1"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12px",
                  color: "#262626",
                }}>
                {opt && opt?.[iconName || ""] && (
                  <MuiCardMedia
                    width="20px"
                    height="15px"
                    component="img"
                    src={opt?.[iconName || ""]}
                    style={{ width: "20px", objectFit: "contain" }}
                  />
                )}
                {opt[optionTitle]}
              </MuiTypography>
            </MenuItem>
          ))}
      </StyledSelect>
      {/* <MuiHelperText error={error}>{helperText}</MuiHelperText> */}
    </MuiFormControl>
  );
}
