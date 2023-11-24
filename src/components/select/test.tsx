import * as React from "react";
import {
  autocompleteClasses,
  AutocompleteProps,
} from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import Typography from "@mui/material/Typography";
import VendgramAutoCompleteWithCheckbox from "./searchableAutoComplete";

const LISTBOX_PADDING = 12; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  //   if (dataSet.hasOwnProperty("group")) {
  //     return (
  //       <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
  //         {dataSet.group}
  //       </ListSubheader>
  //     );
  //   }

  return (
    <Typography component="li" {...dataSet[0]} style={inlineStyle}>
      {dataSet}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactChild[] = [];

  (children as React.ReactChild[]).forEach(
    (item: React.ReactChild & { children?: React.ReactChild[] }) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    }
  );

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("mobile"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: React.ReactChild) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index: any) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}>
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

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
  required?: boolean;
  helperText?: any;
  wrapperClass?: string;
  wrapperId?: string;
  wrapperStyle?: React.CSSProperties;
  hasPreviousResult?: boolean;
}

export default function VendgramVirtualizedCountriesSelect<
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
  hasImage = true,
  showPills = true,
  options,
  multiple,
  error = false,
  required = false,
  helperText = "",
  wrapperClass,
  wrapperId,
  wrapperStyle,
  hasPreviousResult = false,
  getOptionLabel = (option: any) => option?.name,
  ...otherProps
}: Omit<
  MyAutocomplete<T, Multiple, DisableClearable, FreeSolo>,
  "renderInput" | "renderTags"
>) {
  // const filterOptions = ['wa', 'na'];

  return (
    <VendgramAutoCompleteWithCheckbox
      {...otherProps}
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      options={options}
      hasImage
      showCheck={showCheck}
      error={error}
      required={required}
      helperText={helperText}
      wrapperClass={wrapperClass}
      wrapperId={wrapperId}
      showPills={showPills}
      selectedValue={selectedValue}
      label={label}
      multiple={multiple}
      optionValue={optionValue}
      optionTitle={optionTitle}
      updateFieldValue={updateFieldValue}
      getOptionLabel={getOptionLabel}
      placeholder={placeholder}
      limitTags={3}
      iconName={iconName}
    />
  );
}
