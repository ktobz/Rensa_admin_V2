import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import AppInput from "components/input";

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
  placeholder?: string;
}

// interface AutoCompleteExtendedProps extends  ;
export default function AppAutoComplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  value,
  updateFieldValue,
  optionTitle = "name",
  optionValue = "id",
  sx,
  placeholder,
  ...otherProps
}: MyAutocomplete<T, Multiple, DisableClearable, FreeSolo>) {
  const [selectedOptions, setSelectedOptions] = React.useState<any>(value);

  // console.log(value, value);
  // console.log(stringOption);

  const optionChips = selectedOptions?.map((option: any, index: number) => {
    // This is to handle new options added by the user (allowed by freeSolo prop).
    const label = option;
    // const label = option[optionTitle];
    return (
      <Chip
        key={index}
        // color="secondary"
        style={{ backgroundColor: "#caead88f" }}
        label={label}
        deleteIcon={<CloseIcon style={{ color: "tomato" }} />}
        onDelete={() => {
          const newSelectedOptions = selectedOptions.filter(
            (entry: any) => entry?.[optionValue] !== option?.[optionValue]
          );
          setSelectedOptions(newSelectedOptions);
          updateFieldValue(newSelectedOptions);
          //   console.log(selectedOptions);
        }}
      />
    );
  });

  return (
    <Autocomplete
      {...otherProps}
      sx={{ width: "100%", ...sx }}
      renderInput={(params) => (
        <AppInput {...params} placeholder={placeholder} />
      )}
    />
  );
}
