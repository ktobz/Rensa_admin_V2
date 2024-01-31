import { MenuItem, Select, SelectProps } from "@mui/material";
import * as React from "react";
import {
  MuiBox,
  MuiCardMedia,
  MuiCheckbox,
  MuiChip,
  MuiFormControl,
  MuiHelperText,
  MuiInputLabel,
  MuiOutlinedInput,
  MuiSelectChangeEvent,
  muiStyled,
  MuiTypography,
} from "@/lib/index";
import {
  IconArrowDownIcon,
  IconChecked,
  IconFunnel,
  IconUnchecked,
} from "@/lib/mui.lib.icons";
import { useQuery } from "react-query";
import OtherService from "@/services/others.service";
import { OrderStatus } from "../feedback/OrderStatus";
import { ICategory, IStatus } from "@/types/globalTypes";

const StyledSelect = muiStyled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    background: "#ffffff",
    flex: 1,
    maxWidth: "200px",
    // width: "100%",

    minHeight: "42px",
    height: "45px",
    ".MuiSvgIcon-root": {
      fontSize: "20px",
    },
  },

  "& .MuiOutlinedInput-input": {
    fontSize: "13px",
    padding: "6px 10px",
    backgroundColor: "#ffffff",
    maxWidth: "180px",
  },
  borderRadius: 6,
  position: "relative",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#2b2b2b",
  fontSize: 13,
  // width: "100%",
  transition: theme.transitions.create([
    "border-color",
    "background-color",
    "box-shadow",
  ]),
  border: "1px solid #A8B9CA !important",
  borderColor: "#A8B9CA !important",
  left: 0,
  flex: 1,
}));

const LabelStyle = muiStyled(MuiInputLabel)(({ theme }) => ({
  position: "relative",
  color: "#000",
  fontWeight: "500",
  fontSize: 13,
  width: "fit-content",
  maxWidth: "fit-content",
  marginTop: "0",
  transform: "none",
  padding: 0,
  display: "flex",
  gap: 10,
  alignItems: "center",

  "& .Mui-focused": {
    borderColor: theme.palette.primary.main,
  },
}));

interface AppSelectProps extends SelectProps {
  optionCheckbox?: boolean;
  name?: string;
  helperText?: React.ReactNode | any;
  iconName?: string;
  selectedValue: number[];
  handleSetValue: (value: number[]) => void;
  options?: ICategory[];
}

type IStatusObject = {
  id: number;
  name: string;
}[];

export default function StatusFilter({
  label,
  fullWidth,
  placeholder,
  id,
  className,
  error,
  required,
  value,
  sx,
  optionCheckbox = false,
  name,
  iconName,
  helperText,
  selectedValue,
  handleSetValue,
  options = [],
  ...otherProps
}: AppSelectProps) {
  const handleChange = (event: MuiSelectChangeEvent<any>, node: any) => {
    const {
      target: { value },
    } = event;
    handleSetValue?.(
      // On autofill we get a stringified value.
      typeof value === "string" ? value?.split(",") : value
    );
  };
  console.log(options, "OPTION");

  return (
    <MuiFormControl
      error={error}
      fullWidth
      id={id}
      sx={{
        marginBottom: "0",
        maxWidth: "300px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "20px",
        justifyContent: "end",

        "& .MuiList-root": {
          padding: 0,
          paddingBottom: "0 !important",
          display: "none",
        },
        ...sx,
      }}
      className={className}
      variant="outlined">
      <LabelStyle color="primary" shrink={false} htmlFor={name}>
        <IconFunnel className="icon" /> Filter by
      </LabelStyle>

      <StyledSelect
        color="primary"
        error={error}
        id={name}
        placeholder={placeholder}
        className={`${className}`}
        value={selectedValue}
        multiple
        name={name}
        onChange={handleChange}
        MenuProps={{
          sx: {
            "& .Mui-selected": {
              backgroundColor: "#fff",
            },
          },
        }}
        IconComponent={IconArrowDownIcon}
        // input={<MuiOutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected: any) => (
          <MuiBox sx={{ display: "flex", gap: 0.5 }}>
            {selected?.map((value: any) => {
              const statusName = options?.find((x) => x?.id === value)?.name;
              return (
                <OrderStatus
                  type={statusName?.toLowerCase() as IStatus}
                  style={{
                    padding: "2px 5px",
                    fontSize: "10px",
                    fontWeight: "600",
                    borderRadius: "5px",
                  }}
                />
              );
            })}
          </MuiBox>
        )}
        {...otherProps}>
        {options &&
          options?.map((opt, index) => (
            <MenuItem
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: 12,
                minHeight: "20px",
                borderBottom: "1px solid #ebebebc3",
                gap: "5px",
                "& .Mui-selected": {
                  backgroundColor: "#fff",
                },
                "& .Mui-focused": {
                  backgroundColor: "#fafafa",
                },
              }}
              value={opt?.id}>
              <MuiCheckbox
                checkedIcon={<IconChecked />}
                icon={<IconUnchecked />}
                checked={!!selectedValue?.find((x) => +x === opt?.id) || false}
              />
              <OrderStatus
                type={opt.name?.toLowerCase() as IStatus}
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  borderRadius: "5px",
                }}
              />
              {/* <MuiTypography
                variant="body1"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12px",
                  color: "#262626",
                  backgroundColor: "red",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  width: "fit-content",
                }}>
                {opt?.name}
              </MuiTypography> */}
            </MenuItem>
          ))}
      </StyledSelect>
    </MuiFormControl>
  );
}
