import * as React from "react";
import PhoneInput, { FeatureProps, Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { MuiFormControl, MuiInputLabel, muiStyled, styled } from "../../lib";

const InputStyle = muiStyled(PhoneInput)(({ theme }) => ({
  borderRadius: 5,
  position: "relative",
  // backgroundColor: theme.palette.mode === "light" ? "#fff" : "#2b2b2b",
  border: ".7px solid #7F8E9D",
  borderColor: "#0000003b",
  fontSize: 12,
  width: "100%",
  padding: "5px 20px",
  marginTop: "23px",
  "&:focus": {
    // boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: "gray",
  },
  "& .PhoneInputInput": {
    fontSize: 13,
    outline: "none",
    border: "none",
    borderLeft: "1px solid grey",
    padding: "8px 0 8px 20px",
    marginLeft: "10px",
    height: "100%",
    fontFamily: "Helvetica",
  },
  "& .PhoneInputCountryIcon": {
    border: 0,
    overflow: "hidden",
    borderRadius: "50%",
    height: "20px",
    width: "20px",
    objectFit: "cover",
    boxShadow: " none !important",
    background: " none !important",
    marginRight: "10px",
  },

  "& .PhoneInputCountryIconImg": {
    display: "block",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
  },
}));

const LabelStyle = muiStyled(MuiInputLabel)(({ theme }) => ({
  position: "relative",
  color: "#000",
  fontWeight: "500",
  marginBottom: "8px",
  fontSize: 12,
  width: "100%",
  // top: "-10px",
  left: "0",
  textTransform: "initial",
}));

export type Props<InputComponentProps> = FeatureProps<InputComponentProps> & {
  value?: Value;
  onChange(value?: Value): void;
  fieldLabel?: string;
  error?: boolean;
};

export default function NumberInput(props: Props<any>) {
  const { fieldLabel, error, ...otherProps } = props;
  return (
    <MuiFormControl
      // style={{ marginBottom: "10px" }}
      error={error}
      fullWidth
      margin="none"
      variant="standard">
      <LabelStyle color="secondary" shrink={false} htmlFor="bootstrap-input">
        {fieldLabel}
      </LabelStyle>
      <InputStyle
        {...otherProps}
        // countries={getCountries()}
        // countrySelectComponent={MuiSelect}
        // countrySelectProps={{
        //   options: getCountries(),
        // }}
      />
    </MuiFormControl>
  );
}

export const NumberInputStyled = styled(PhoneInput)`
  border-radius: 4px;
  /* margin-top: 25px; */
  border: 0.7px solid grey;
  /* padding: 15px 20px; */
  background-color: #fff;

  .PhoneInputInput {
    font-size: 14px;
    flex: 1 1;
    min-width: 0;
    outline: none;
    border: none;
    border-left: 1px solid grey;
    padding-left: 20px;
    margin-left: 10px;
  }

  & .PhoneInputCountryIcon {
    border: 0;
    overflow: hidden;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    object-fit: contain;
    box-shadow: none !important;
    background: none !important;
  }

  & .PhoneInputCountryIconImg {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;
