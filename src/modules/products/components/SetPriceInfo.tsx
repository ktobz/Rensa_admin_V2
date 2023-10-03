import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";

import {
  styled,
  MuiTypography,
  MuiButton,
  MuiInputAdornment,
  MuiCircularProgress,
} from "@/lib/index";
import VendgramInput, { VendgramSelectInput } from "components/input";
import FormTitle from "components/text/FormTitle";
import VendgramCustomModal from "components/modal/Modal";
import {
  IconDiesel,
  IconLPG,
  IconListIcon,
  IconPetrol,
  IconWarning,
} from "lib/mui.lib.icons";
import CardService from "@/services/branches.service";
import { toast } from "react-toastify";
import { IProductPriceProps } from "../types";
import VendgramSelect from "@/components/select/autoComplete";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import { DURATION_OPTION } from "@/data/product-category";

const SCHEMA = Yup.object().shape({
  category: Yup.string().required("required"),
  price: Yup.string().required("required"),
});

type IProps = {
  handleShowSetPrice: () => void;
};

export const SetPriceInfo = ({ handleShowSetPrice }: IProps) => {
  return (
    <StyledSection>
      <IconWarning className="warning-icon" />
      <MuiTypography variant="body2" className="heading">
        Pump/sale price not set
      </MuiTypography>
      <MuiTypography variant="body2" className="body">
        Set product pump or sale price before adding a product
      </MuiTypography>
      <div className="wrapper">
        <div className="assets">
          <div className="img-wrapper">
            <IconPetrol />
          </div>
          <MuiTypography variant="body2" className="product-name">
            Petrol
          </MuiTypography>
        </div>
        <div className="assets">
          <div className="img-wrapper">
            {" "}
            <IconDiesel />
          </div>

          <MuiTypography variant="body2" className="product-name">
            Diesel
          </MuiTypography>
        </div>
        <div className="assets">
          <div className="img-wrapper">
            <IconLPG />
          </div>

          <MuiTypography variant="body2" className="product-name">
            LPG
          </MuiTypography>
        </div>
      </div>

      <MuiButton
        type="button"
        variant="contained"
        onClick={handleShowSetPrice}
        className="btn">
        Set Price{" "}
      </MuiButton>
    </StyledSection>
  );
};

const StyledSection = styled.section`
  width: calc(100vw - 40px);
  max-width: 450px;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  & .warning-icon {
    width: 130px;
    height: 130px;
  }

  & .heading {
    font-weight: 700;
    font-size: 18px;
  }

  & .product-name {
    color: #64748b;
    font-size: 12px;
  }

  & .wrapper {
    width: 100%;
    display: flex;
    gap: 30px;
    align-items: center;
    justify-content: center;
    margin-top: 10px;

    & .assets {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      & .img-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 51px;
        height: 51px;
        background-color: #e8f1f8;

        border-radius: 50%;

        & svg {
          width: 30px;
          height: 30px;
        }
      }
    }
  }

  & .body {
    max-width: 300px;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
  }

  & .subtitle {
    color: #aeaeae;
  }

  & .flex-wrapper {
    display: flex;
    gap: 30px;
    align-items: self-end;
  }

  & .btn {
    width: 100%;
    margin-top: 45px;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
`;
