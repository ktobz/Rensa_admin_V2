import * as React from "react";
import styled from "@emotion/styled";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import VendgramInput from "components/input";

export default function CustomDatePicker({
  onChange,
  value,
  required = false,
  name,
  className,
  label,
  error,
  helperText,
  disableFuture = true,
  component = "date",
  onBlur,
  disabled = false,
}: {
  onChange: (newValue: Date | null | string) => any;
  onBlur?: (newValue: Date | null | string) => any;
  value: Date | null | string;
  required?: boolean;
  name?: string;
  className?: string;
  label: string;
  helperText?: string | undefined;
  error?: boolean;
  disableFuture?: boolean;
  component?: "date" | "time";
  disabled?: boolean;
}) {
  return (
    <StyledWrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {component === "date" ? (
          <DatePicker
            disableFuture={disableFuture}
            openTo="year"
            views={["year", "month", "day"]}
            value={value}
            label={label}
            disabled={disabled}
            // inputVariant="outlined"
            // format="DD/MM/yyyy"
            // format="dd/mm/yyyy"
            // toolbarFormat="dd/mm/yyyy"
            //   disablePast={disablePast}
            //   placeholder="DD/MM/YYYY"

            mask="__/__/____"
            // inputFormat="dd/mm/yyyy"
            onChange={(newValue: any) => {
              onChange(newValue);
            }}
            renderInput={(params: any) => (
              <VendgramInput
                {...params}
                helperText={helperText}
                error={error}
                name={name}
                onBlur={onBlur}
                required={required}
              />
            )}
          />
        ) : (
          <TimePicker
            value={value}
            label={label}
            ampm
            // inputFormat="hh:mm"
            // mask="__:__"
            onChange={(newValue: any) => {
              onChange(newValue);
            }}
            renderInput={(params: any) => (
              <VendgramInput
                {...params}
                required={required}
                helperText={helperText}
                error={error}
                name={name}
              />
            )}
          />
        )}
      </LocalizationProvider>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* margin: 10px auto; */
  width: 100%;

  #date-picker-dialog {
    width: 100%;
  }
  /* & .MuiFormControl-root {
    width: 100%;
    margin: 20px 0;
  } */

  & .MuiInputLabel-outlined {
    transform: translate(0px, -20px) scale(1) !important;
    color: #333;
  }

  & .MuiFormHelperText-root {
    margin-bottom: 0;
  }
`;
