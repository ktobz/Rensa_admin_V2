import {
  MuiFormControl,
  MuiInputLabel,
  MuiSelectChangeEvent,
  muiStyled,
} from "@/lib/index";
import { IconFunnel } from "@/lib/mui.lib.icons";
import { MarketplaceFilter } from "@/modules/settlements/components/Filter";
import { ICategory } from "@/types/globalTypes";
import { SelectProps } from "@mui/material";
import * as React from "react";
import { useSearchParams } from "react-router-dom";
import AppCustomModal from "../modal/Modal";

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

export default function ListingFilter({
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
  const [searchParams] = useSearchParams();

  const [openFilter, setOpenFilter] = React.useState(false);

  const statusFilterCount =
    searchParams
      ?.get("Status")
      ?.trim()
      ?.split(",")
      ?.filter((x) => x)?.length || 0;
  const categoryFilterCount =
    searchParams
      ?.get("CatalogueCategoryId")
      ?.trim()
      ?.split(",")
      ?.filter((x) => x)?.length || 0;
  const listingTypeFilterCount =
    searchParams
      ?.get("ListingType")
      ?.trim()
      ?.split(",")
      ?.filter((x) => x)?.length || 0;

  const filterCount =
    statusFilterCount + categoryFilterCount + listingTypeFilterCount;

  const handleChange = (event: MuiSelectChangeEvent<any>, node: any) => {
    const {
      target: { value },
    } = event;
    handleSetValue?.(
      // On autofill we get a stringified value.
      typeof value === "string" ? value?.split(",") : value
    );
  };

  const handleCloseModal = () => {
    setOpenFilter(false);
  };

  const handleShow = () => {
    setOpenFilter(true);
  };

  return (
    <>
      <MuiFormControl
        error={error}
        fullWidth
        id={id}
        sx={{
          marginBottom: "0",
          maxWidth: "140px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
          border: 1,
          borderColor: "#A8B9CA",
          padding: "5.5px 5px",
          justifyContent: "space-between",
          borderRadius: "6px",
          ...sx,
        }}
        onClick={handleShow}
        className={className}
        variant="outlined">
        <LabelStyle
          color="primary"
          style={{ color: "#798AA3" }}
          shrink={false}
          htmlFor={name}>
          <IconFunnel className="icon" /> Filter
        </LabelStyle>
        {filterCount > 0 && (
          <p className="font-bold bg-[#FB651E] rounded-full h-[18px] w-[20px] text-center text-white text-[12px] ">
            {filterCount}
          </p>
        )}
      </MuiFormControl>

      <AppCustomModal
        handleClose={handleCloseModal}
        open={openFilter}
        alignTitle="left"
        closeOnOutsideClick={false}
        title="Filter"
        showClose>
        <MarketplaceFilter handleClose={handleCloseModal} />
      </AppCustomModal>
    </>
  );
}
