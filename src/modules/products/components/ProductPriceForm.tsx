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
import { IconListIcon } from "lib/mui.lib.icons";
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

export const ProductPriceForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const initialData = {
    category: "",
    price: "",
  };

  const handleCreateCard = (values: IProductPriceProps) => {
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
      handleCreateCard(values as IProductPriceProps);
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
            // value={value}
            // onChange={handleChange}
            options={DURATION_OPTION}
            optionTitle="name"
            optionValue="id"
            style={{ width: "100%" }}
            label="Product Category"
            placeholder="Select"
          />

          <VendgramInput
            id="price"
            name="price"
            label="Price/Litre"
            placeholder="₦0/ltr  "
            type="text"
            value={values.price}
            onChange={handleChange}
            helperText={errors.price}
            error={!!errors.price}

            // InputProps={{
            //   startAdornment: (
            //     <MuiInputAdornment position="start">$</MuiInputAdornment>
            //   ),
            // }}
          />

          <MuiButton
            type="submit"
            variant="contained"
            disabled
            // disabled={isSubmitting}
            className="btn">
            {isSubmitting ? <MuiCircularProgress size={16} /> : "Save"}
          </MuiButton>
        </div>
      </StyledForm>
    </FormikProvider>
  );
};

const StyledForm = styled.form`
  width: 100%;
  max-width: 1160px;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;

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
