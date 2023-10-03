import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import ReactCountryFlag from "react-country-flag";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import { VendgramSelectInput } from "components/input";
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
  updateFieldValue: Function;
  optionTitle?: string;
  optionValue?: string;
  iconName?: string;
  label?: string;
  selectedValue?: any;
  hasImage?: boolean;
  showCheck?: boolean;
  showPills?: boolean;
  error?: boolean;
  required?: boolean;
  helperText?: string;
  wrapperClass?: string;
  wrapperId?: string;
  wrapperStyle?: React.CSSProperties;
  hasPreviousResult?: boolean;
}

// interface AutoCompleteExtendedProps extends  ;
export default function VendgramAutoCompleteWithCheckbox<
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
  required = false,
  wrapperClass,
  wrapperId,
  wrapperStyle,
  hasPreviousResult = false,
  onInputChange,
  ...otherProps
}: Omit<
  MyAutocomplete<T, Multiple, DisableClearable, FreeSolo>,
  "renderInput" | "renderTags"
>) {
  // console.log("SELECTED", selectedValue);
  const optionChips = selectedValue?.map?.((option: any, index: number) => {
    // This is to handle new options added by the user (allowed by freeSolo prop).

    const label = option[optionTitle];

    return (
      <Chip
        key={index}
        size="small"
        // color="secondary"
        style={{
          backgroundColor: "#fff",
          fontSize: "10px",
          fontWeight: 600,
          border: "1px solid #E1DFDD",
        }}
        label={label}
        deleteIcon={<CloseIcon style={{ color: "#616161" }} />}
        onDelete={() => {
          const newSelectedOptions = selectedValue?.filter(
            (entry: any) => entry[optionValue] !== option[optionValue]
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

  // console.log(
  //   options.find((option: any) => option?.[optionValue] === selectedValue)
  // );
  return (
    <div style={{ width: "100%", ...wrapperStyle }} className={wrapperClass}>
      <Autocomplete
        value={
          showPills
            ? selectedValue
            : options.find(
                (option: any) => option?.[optionValue] === selectedValue
              )
        }
        {...otherProps}
        limitTags={3}
        options={options}
        autoHighlight
        onInputChange={onInputChange}
        popupIcon={<IconArrowDownIcon />}
        sx={{
          width: "100%",
          "& .MuiAutocomplete-input": {
            // padding: "0px !important",
            fontSize: "13px",
            padding: "0 0 0 0px !important",
          },
          "& .MuiInputLabel-root": {
            left: "0",
            fontSize: "13px !important",
            // display: "none",
          },
          ".MuiTextField-root": {
            marginTop: "8px",
          },

          ...sx,
        }}
        renderTags={() => null}
        onChange={(e, newValue) => {
          updateFieldValue(newValue);
          // console.log(newValue);
        }}
        renderOption={(props, option: any, { selected }) => (
          <MuiBox
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            // style={{
            //   width: "100%",
            //   display: "flex",
            //   justifyContent: "space-between",
            //   alignItems: "center",
            //   // margin: "10px 0",
            // }}
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
              {hasImage && iconName === "flag" && (
                <ReactCountryFlag
                  countryCode={option["code"]}
                  svg
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    fontSize: "9px",
                  }}
                  title={option["code"]}
                />
              )}
              {hasImage && iconName !== "flag" && (
                <MuiCardMedia
                  component="img"
                  src={option[iconName]}
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    fontSize: "9px",
                  }}
                  title={option[optionTitle]}
                />
              )}

              <MuiTypography fontSize={12} variant="body2">
                {option[optionTitle]}
              </MuiTypography>
            </div>

            {showCheck && (
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8, color: "#39B54A" }}
                checked={selected}
              />
            )}
          </MuiBox>
        )}
        renderInput={(params) => (
          <VendgramSelectInput
            {...params}
            error={error}
            required={required}
            helperText={helperText}
            placeholder={placeholder}
            label={label}
          />
        )}
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
