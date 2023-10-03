import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";

import {
  styled,
  MuiTypography,
  MuiButton,
  MuiCircularProgress,
} from "@/lib/index";
import VendgramInput from "@/components/input";

import VendgramCustomModal from "components/modal/Modal";
import { IconListIcon } from "lib/mui.lib.icons";
import CardService from "@/services/branches.service";
import { toast } from "react-toastify";
import { IProductEntryProps } from "../types";
import VendgramSelect from "@/components/select/autoComplete";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import { DURATION_OPTION } from "@/data/product-category";

const SCHEMA = Yup.object().shape({
  category: Yup.string().required("required"),
  calculated_price: Yup.string().required("required"),
  quantity: Yup.number().required("required").min(1, "Quantity required"),
});

type IViewProps = {
  mode: "new" | "edit";
  initData?: any;
  handleShowSetPrice: () => void;
};

export const ProductEntryForm = ({
  mode,
  initData,
  handleShowSetPrice,
}: IViewProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const initialData = {
    category: initData?.category || "",
    calculated_price: initData?.calculated_price || "",
    quantity: initData?.quantity || 1,
  };

  const handleCreateCard = (values: IProductEntryProps) => {
    setIsSubmitting(true);
    // CardService.createCard()
    //   .then((res) => {
    //     toast.success(res.data?.message || "");
    //     navigate("/app/card");
    //   })
    //   .catch((err) => {
    //     toast.error(err?.response?.data?.message || "");
    //   })
    //   .finally(() => setIsSubmitting(false));
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      handleCreateCard(values as IProductEntryProps);
    },
  });

  const { errors, handleSubmit, handleChange, values } = formik;

  // const handleCustomChange = (
  //   e: MuiSelectChangeEvent<any>,
  //   newValue: React.ReactNode
  // ) => {
  //   const { value, name } = e.target;
  //   setFieldValue(name, value);
  // };

  const handleCloseModal = () => {
    setShow(false);
  };

  React.useEffect(() => {
    setShow(true);
  }, []);

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <CustomStyledSelect
            value={values.category}
            onChange={handleChange}
            name="category"
            options={DURATION_OPTION}
            optionTitle="name"
            optionValue="id"
            style={{ width: "100%" }}
            label="Product Category"
            error={!!errors.category}
            placeholder="Select"
            helperText={
              errors.category || (
                <MuiTypography variant="subtitle2" className="set-price">
                  Price/Litre{" "}
                  <MuiButton
                    variant="text"
                    onClick={handleShowSetPrice}
                    className="set-btn"
                    color="primary">
                    Set Price
                  </MuiButton>
                </MuiTypography>
              ) || (
                <MuiTypography variant="subtitle2" className="price-unit">
                  Price/Litre <span>175/ltr</span>
                </MuiTypography>
              )
            }
          />

          <VendgramInput
            id="quantity"
            name="quantity"
            label="Sale Quantity (LTRS)"
            placeholder="Enter quantity"
            type="number"
            value={values.quantity}
            onChange={handleChange}
            helperText={errors.quantity}
            error={!!errors.quantity}
          />

          <VendgramInput
            id="calculated_price"
            name="calculated_price"
            label="Calculated Unit Price"
            placeholder="₦0/unit "
            type="text"
            value={values.calculated_price}
            onChange={() => null}
            helperText={errors.calculated_price}
            error={!!errors.calculated_price}
            // disabled
          />

          <MuiButton
            type="submit"
            variant="contained"
            disabled
            // disabled={isSubmitting}
            className="btn">
            {isSubmitting ? <MuiCircularProgress size={16} /> : "Add Item"}
          </MuiButton>
        </div>
      </StyledForm>
    </FormikProvider>
  );
};

const StyledForm = styled.form`
  width: 100%;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  max-width: 450px;

  & .price-unit {
    display: flex;
    align-items: center;
    font-size: 12px;
    gap: 10px;

    span {
      color: #1e75bb;
      font-weight: 600;
    }
  }

  & .set-price {
    font-size: 12px;
    gap: 10px;
    display: flex;
    align-items: center;
    & .set-btn {
      height: fit-content;
      min-height: fit-content;
      padding: 3px;
    }
  }

  & .wrapper {
    max-width: 450px;
    width: 100%;
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
