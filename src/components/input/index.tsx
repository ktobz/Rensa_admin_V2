import { CustomToolTip } from "components/feedback/Tooltip";
import { IconInfo } from "lib/mui.lib.icons";
import * as React from "react";
import {
  MuiFormControl,
  MuiInputLabel,
  MuiTextField,
  muiStyled,
  MuiTextFieldProps,
  MuiTypography,
  MuiIconButton,
} from "../../lib";

const InputStyle = muiStyled(MuiTextField)(({ theme }) => ({
  "label + &": {
    marginTop: 10,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 6,
    marginBottom: 10,

    ".MuiSvgIcon-root": {
      fontSize: "20px",
    },

    "&:hover fieldset": {
      borderColor: `${theme.palette.primary.main}`,
    },
    "&.Mui-focused fieldset": {
      borderColor: `${theme.palette.primary.main}`,
    },
  },

  "& .MuiOutlinedInput-input": {
    fontSize: "13px",
    padding: "0 14px",
    minHeight: "45px",
  },

  borderRadius: 6,
  position: "relative",
  fontSize: 13,
  width: "100%",
  transition: theme.transitions.create([
    "border-color",
    "background-color",
    "box-shadow",
  ]),
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },

  "& .MuiIconButton-root": {
    // marginRight: "5px",
  },

  "& .MuiFormHelperText-root": {
    marginTop: "-10px",
    marginBottom: "10px",
    // marginLeft: 0,
  },
}));

const SelectInputStyle = muiStyled(MuiTextField)(({ theme }) => ({
  "label + &": {
    marginTop: 10,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 6,
    marginBottom: 10,

    ".MuiSvgIcon-root": {
      fontSize: "20px",
    },

    "&:hover fieldset": {
      borderColor: `${theme.palette.primary.main}`,
    },
    "&.Mui-focused fieldset": {
      borderColor: `${theme.palette.primary.main}`,
    },
  },

  "& .MuiOutlinedInput-input": {
    fontSize: "13px",
    padding: "0 14px",
    minHeight: "27px",
  },

  borderRadius: 6,
  position: "relative",
  fontSize: 13,
  width: "100%",
  transition: theme.transitions.create([
    "border-color",
    "background-color",
    "box-shadow",
  ]),
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },

  "& .MuiIconButton-root": {
    // marginRight: "5px",
  },

  "& .MuiFormHelperText-root": {
    marginTop: "-10px",
    marginBottom: "10px",
    fontSize: "10px",
    // marginLeft: 0,
  },
}));

const LabelStyle = muiStyled(MuiInputLabel)(({ theme }) => ({
  position: "relative",
  color: "#000000",
  fontWeight: "500",
  fontSize: 12,
  width: "100%",
  left: "0px",
  textTransform: "initial",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  overflow: "unset",
  "& .label": {
    display: "flex",
    alignItems: "center",
  },

  "& .info": {
    marginLeft: "3px",
    marginBottom: "2px",

    "& svg": {
      width: "13px",
      height: "13px",
    },
  },
}));

type ITextFieldProps = {
  labelAction?: (e: any) => void;
  labelActionComponent?: React.ReactNode;
  toolTip?: boolean;
  toolTipText?: React.ReactNode;

  startAdornment?: React.ReactNode;
  styleVariant?: "input" | "view";
  helperText?: any;
  showHelperInfoIcon?: boolean;
} & Omit<MuiTextFieldProps, "helperText">;

export default function VendgramInput({
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
  styleVariant,
  toolTip = false,
  toolTipText = "",
  sx,
  helperText,
  showHelperInfoIcon,
  ...otherProps
}: ITextFieldProps) {
  const textFieldRef = React.useRef<HTMLInputElement>(null);

  return (
    <MuiFormControl
      sx={{
        ...sx,
        marginBottom: "10px",
        // "& .MuiTextField-root": {
        //   marginTop: "3px !important",
        // },
      }}
      error={error}
      fullWidth
      disabled={disabled}
      id={id}
      // margin="dense"
      className={className}
      variant="standard">
      {!!label && (
        <LabelStyle color="secondary" shrink={false} htmlFor="">
          <div className="label">
            <span> {label}</span>
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
          </div>

          {labelActionComponent && labelActionComponent}
        </LabelStyle>
      )}

      <InputStyle
        ref={textFieldRef}
        color="secondary"
        disabled={disabled}
        error={error}
        onWheel={(event) => {
          if (type === "number") event.preventDefault();
        }}
        sx={{ background: disabled ? "#cfcfcf52" : "initial" }}
        placeholder={placeholder}
        type={type === "number" ? "text" : type}
        inputProps={
          type === "number"
            ? { inputMode: "numeric", pattern: "[0-9]*" }
            : undefined
        }
        InputProps={{
          startAdornment: startAdornment,
        }}
        helperText={
          helperText ? (
            <MuiTypography
              style={{
                display: "flex",
                gap: "5px",
                fontSize: "12px",
                color: error ? "tomato" : "#64748B",
                marginTop: "5px",
              }}>
              {showHelperInfoIcon && (
                <IconInfo color="primary" style={{ fontSize: "20px" }} />
              )}
              {helperText}
            </MuiTypography>
          ) : (
            ""
          )
        }
        {...otherProps}
        FormHelperTextProps={{
          style: {
            color: error ? "tomato" : "#64748B",
            padding: 0,
            marginLeft: "0",
            fontSize: "12px",
          },
        }}
      />
    </MuiFormControl>
  );
}

export function VendgramSelectInput({
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
  sx,
  ...otherProps
}: ITextFieldProps) {
  const textFieldRef = React.useRef<HTMLInputElement>(null);

  return (
    <MuiFormControl
      sx={{
        ...sx,
        marginBottom: "10px",
      }}
      error={error}
      fullWidth
      disabled={disabled}
      id={id}
      className={className}
      variant="standard">
      <LabelStyle color="secondary" shrink={false} htmlFor="">
        <div className="label">
          <span> {label}</span>
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
        </div>
        {labelActionComponent}
      </LabelStyle>
      <SelectInputStyle
        ref={textFieldRef}
        color="secondary"
        disabled={disabled}
        error={error}
        onWheel={(event) => {
          if (type === "number") event.preventDefault();
        }}
        sx={{ background: disabled ? "#cfcfcf52" : "initial" }}
        placeholder={placeholder}
        type={type}
        {...otherProps}
      />
    </MuiFormControl>
  );
}
