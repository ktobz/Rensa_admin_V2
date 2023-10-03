import { IconArrowDownIcon } from "lib/mui.lib.icons";
import * as React from "react";
import {
  MuiFormControl,
  MuiInputLabel,
  MuiTextField,
  muiStyled,
  MuiTextFieldProps,
  MuiTypography,
  MuiSelectProps,
  MuiMenuItem,
  MuiCheckbox,
  MuiSelect,
} from "../../lib";

const InputStyle = muiStyled(MuiTextField)(({ theme }) => ({
  top: 0,
  "& .MuiOutlinedInput-root": {
    borderRadius: 6,
    background: "#F6F6F6",
    marginBottom: 10,
    // flexDirection: "row",

    ".MuiSvgIcon-root": {
      fontSize: "20px",
    },
  },

  "& .MuiOutlinedInput-input": {
    fontSize: "13px",
    padding: "0 14px",
    minHeight: "45px",
  },

  borderRadius: 6,
  position: "relative",
  backgroundColor: "#fff",
  fontSize: 13,
  width: "100%",

  "& .MuiFormHelperText-root": {
    marginTop: "-10px",
    marginBottom: "10px",
  },
}));

const LabelStyle = muiStyled(MuiInputLabel)(({ theme }) => ({
  position: "relative",
  color: "#000000",
  fontWeight: "600",
  fontSize: 14,
  width: "100%",
  maxWidth: "270px",
  // top: "-10px",
  left: "0px",
  marginRight: "30px",
  textTransform: "initial",
  display: "flex",
  // justifyContent: "space-between",
  alignItems: "center",
  whiteSpace: "normal",
  transform: "none",
}));

type ITextFieldProps = {
  labelAction?: (e: any) => void;
  labelActionComponent?: React.ReactNode;
  startAdornment?: React.ReactNode;
  styleVariant?: "edit" | "view";
} & MuiTextFieldProps;

export default function InputRowVariant({
  label,
  fullWidth,
  placeholder,
  id,
  className,
  error,
  required,
  disabled,
  type,
  labelActionComponent,
  labelAction,
  startAdornment,
  styleVariant = "view",
  sx,
  ...otherProps
}: ITextFieldProps) {
  const textFieldRef = React.useRef<HTMLInputElement>(null);

  return (
    <MuiFormControl
      sx={{
        ...sx,
        marginBottom: "10px",
        "& .MuiTextField-root": {
          height: "45px",
        },
      }}
      error={error}
      fullWidth
      disabled={disabled || styleVariant === "view"}
      id={id}
      // margin="dense"
      className={className}
      variant="standard">
      <LabelStyle color="secondary" shrink={false} htmlFor="">
        {label}{" "}
        {required && (
          <MuiTypography
            color="red"
            sx={{
              display: "inline",
              verticalAlign: "-3px",
              lineHeight: 0,
              color: "#F30A0A",
            }}>
            *
          </MuiTypography>
        )}
        {labelActionComponent}
      </LabelStyle>
      <InputStyle
        ref={textFieldRef}
        color="secondary"
        disabled={styleVariant === "view"}
        // disabled={disabled}
        error={error}
        onWheel={(event) => {
          if (type === "number") event.preventDefault();
        }}
        sx={{
          background: disabled ? "#F6F6F6" : "initial",
          color: "#fff",

          "& .MuiOutlinedInput-root": {
            background: "#F6F6F6",
            flexDirection: "row",
            gap: "20px",

            ".MuiSvgIcon-root": {
              fontSize: "20px",
            },

            "& fieldset": {
              borderColor: disabled ? "#F6F6F6 !important" : "#fff  !important",
            },

            "&:hover fieldset": {
              borderColor: "#CDD5E0",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#CDD5E0",
            },
          },
          "& .Mui-disabled": {
            "-webkit-text-fill-color":
              styleVariant === "view" ? "#000" : "initial",
          },
        }}
        placeholder={placeholder}
        type={type}
        InputProps={{
          startAdornment: startAdornment,
        }}
        {...otherProps}
      />
    </MuiFormControl>
  );
}

interface VendgramSelectProps extends MuiSelectProps {
  options: any[];
  optionTitle?: string;
  optionValue?: string;
  optionCheckbox?: boolean;
  name?: string;
  styleVariant?: "edit" | "view";
  editable?: boolean;
}

const SelectStyle = muiStyled(MuiSelect)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    // padding: "15px 20px",
    borderRadius: 0,
    background: "#F0F0F0",
    minHeight: "42px",
    height: "45px",
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
    padding: "12px",
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

export function SelectRowVariant({
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
  styleVariant = "view",
  editable = false,
  ...otherProps
}: VendgramSelectProps) {
  return (
    <MuiFormControl
      error={error}
      fullWidth
      id={id}
      // margin="dense"
      sx={{
        flexDirection: "row",
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
        "& .MuiOutlinedInput-root": {
          background: "#F6F6F6",
          flexDirection: "row",
          gap: "20px",

          ".MuiSvgIcon-root": {
            fontSize: "20px",
          },

          "& fieldset": {
            borderColor:
              styleVariant === "view"
                ? "#F6F6F6 !important"
                : "#fff  !important",
          },

          "&:hover fieldset": {
            borderColor: "#CDD5E0",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#CDD5E0",
          },
        },
        "& .MuiOutlinedInput-input": {
          padding: "12px",
          height: "unset",
        },
        "& .Mui-disabled": {
          " -webkit-text-fill-color":
            styleVariant === "view" ? "#000" : "initial",
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

      <SelectStyle
        color="primary"
        error={error}
        name={name}
        id={name}
        placeholder={placeholder}
        className={`${className} ${
          value === "none" || value === 0 ? "grey-out" : ""
        }`}
        value={value}
        IconComponent={styleVariant === "view" ? () => null : IconArrowDownIcon}
        {...otherProps}>
        {placeholder && (
          <MuiMenuItem value={0} className="grey-out" disabled>
            {placeholder}
          </MuiMenuItem>
        )}
        {options &&
          options.map((opt: any, index) => (
            <MuiMenuItem
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
            </MuiMenuItem>
          ))}
      </SelectStyle>
    </MuiFormControl>
  );
}
