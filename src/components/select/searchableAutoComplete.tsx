import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import ReactCountryFlag from "react-country-flag";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import AppInput, { AppSelectInput } from "components/input";
import { MuiBox, MuiCardMedia, MuiTypography } from "lib";
import { IconArrowDownIcon } from "lib/mui.lib.icons";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface MyAutocomplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  updateFieldValue: (data: any) => void;
  optionTitle?: string;
  optionValue?: string;
  iconName?: string;
  label?: string;
  selectedValue?: any;
  hasImage?: boolean;
  showCheck?: boolean;
  showPills?: boolean;
  error?: boolean;
  helperText?: any;
  wrapperClass?: string;
  wrapperId?: string;
  wrapperStyle?: React.CSSProperties;
  hasPreviousResult?: boolean;
  variant?: "country" | "team";
  required?: boolean;
}

// interface AutoCompleteExtendedProps extends  ;
export default function AppAutoCompleteWithCheckbox<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  selectedValue,
  value,
  updateFieldValue,
  optionTitle = "name",
  iconName = "flag",
  optionValue = "name",
  sx,
  placeholder,
  label,
  showCheck = true,
  hasImage = false,
  showPills = true,
  options,
  error = false,
  helperText = "",
  wrapperClass,
  wrapperId,
  wrapperStyle,
  variant = "country",
  hasPreviousResult = false,
  onInputChange,
  limitTags = 3,
  required = false,
  ...otherProps
}: Omit<
  MyAutocomplete<T, Multiple, DisableClearable, FreeSolo>,
  "renderInput" | "renderTags"
>) {
  const optionChips = selectedValue?.map?.((option: any, index: number) => {
    // This is to handle new options added by the user (allowed by freeSolo prop).

    const label = option[optionTitle]?.trim();

    return (
      <Chip
        key={index}
        size="small"
        // color="secondary"
        style={{
          backgroundColor: "#E9E9FF",
          fontSize: "10px",
          fontWeight: 600,
          color: "#030949",
          border: "1px solid #F4F4F4",
          // padding: '5px !important',
        }}
        label={
          <div
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              flex: 1,
              width: "100%",
              fontSize: "12px",

              // paddingLeft: "10px",
            }}>
            <ReactCountryFlag
              countryCode={option.code?.trim()}
              svg
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                fontSize: "9px",
              }}
              title={option.code?.trim()}
            />
            {label}
          </div>
        }
        deleteIcon={<CloseIcon style={{ color: "#616161" }} />}
        onDelete={() => {
          const newSelectedOptions = selectedValue?.filter(
            (entry: any) =>
              entry[optionValue]?.trim() !== option[optionValue]?.trim()
          );
          // setSelectedOptions(newSelectedOptions);
          updateFieldValue(newSelectedOptions);
          // console.log(
          //   newSelectedOptions,
          //   option,
          //   selectedValue[0][optionValue]
          // );
        }}
      />
    );
  });

  return (
    <div style={{ width: "100%", ...wrapperStyle }} className={wrapperClass}>
      <Autocomplete
        disableClearable
        value={
          showPills
            ? selectedValue
            : options.find(
                (option: any) => option?.[optionValue] === selectedValue
              )
        }
        {...otherProps}
        limitTags={limitTags}
        options={options}
        popupIcon={<IconArrowDownIcon />}
        onInputChange={onInputChange}
        sx={{
          width: "100%",
          "& .MuiAutocomplete-input": {
            // padding: "0px !important",
            fontSize: "13px",
            padding: "0 0 0 0px !important",
          },
          "& .MuiInputLabel-root": {
            left: "0",
            // display: "none",
          },
          ".MuiTextField-root": {
            marginTop: "8px",
            "& .Mui-disabled": {
              "& .MuiOutlinedInput-notchedOutline": {
                background: "#cfcfcf52 !important",
              },
              "& .MuiOutlinedInput-input": {
                background: "none !important",
              },
            },
            "& .MuiOutlinedInput-root": {
              padding: "0 65px 0 15px !important",
            },
          },

          ...sx,
        }}
        onChange={(e, newValue) => {
          updateFieldValue(newValue);
        }}
        renderOption={(props, option: any, { selected }) => (
          <li
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: hasPreviousResult
                ? "0.4px solid #dfdfdf74"
                : "none",
              minHeight: "fit-content",
            }}
            {...props}>
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                flex: 1,
                width: "100%",
                fontSize: "12px",

                // paddingLeft: "10px",
              }}>
              {option?.logo && hasImage && variant === "team" && (
                <MuiCardMedia
                  component="img"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                  }}
                  src={option?.logo || ""}
                />
              )}

              {hasImage && variant === "country" && (
                <ReactCountryFlag
                  countryCode={option.code?.trim()}
                  svg
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    fontSize: "9px",
                  }}
                  title={option.code?.trim()}
                />
              )}

              <b>{option[optionTitle]?.trim()}</b>
            </div>

            {showCheck && (
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8, color: "#39B54A" }}
                checked={selected}
              />
            )}
          </li>
        )}
        renderInput={(params) => (
          <AppInput
            {...params}
            error={error}
            helperText={helperText}
            sx={{ fontSize: "13px !important" }}
            placeholder={placeholder}
            label={label}
            required={required}
          />
        )}
        renderTags={(value: any, getTagProps: any) => null}
      />
      {showPills && selectedValue && (selectedValue?.length as number) > 0 && (
        <div
          className="selectedTags"
          style={{
            display: "flex",
            gap: "3px",
            flexWrap: "wrap",
            // marginBottom: "10px",
            marginTop: "15px",
          }}>
          {optionChips}
        </div>
      )}
    </div>
  );
}
