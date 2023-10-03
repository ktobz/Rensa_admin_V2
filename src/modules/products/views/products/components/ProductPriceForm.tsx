import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";

import { styled, MuiButton, MuiCircularProgress } from "@/lib/index";
import VendgramInput from "components/input";
import { IProductPriceProps, IProductCategory } from "../types";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import { useQuery } from "react-query";
import ProductService from "@/services/product-service";
import { PRODUCT_CAT_OPTION } from "@/data/product-category";
import { toast } from "react-toastify";

const SCHEMA = Yup.object().shape({
  product_category_id: Yup.number().required("required").min(1, "required"),
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

    ProductService.addProductPrice(values)
      .then((res) => {
        //  refreshQuery?.();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      })
      .finally(() => setIsSubmitting(false));
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

  const productCategories = useQuery(
    ["product-category"],
    () =>
      ProductService.productCategory().then((res) => {
        return res.data.data as IProductCategory[];
      }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 5 * 60 * 1000,
    }
  );

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <CustomStyledSelect
            name="product_category_id"
            value={values.product_category_id}
            onChange={handleChange}
            options={
              productCategories?.data?.filter(
                (x) => !x?.name?.toLowerCase()?.includes("oil")
              ) ||
              PRODUCT_CAT_OPTION?.filter(
                (x) => !x?.name?.toLowerCase()?.includes("oil")
              ) ||
              []
            }
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
            disabled={isSubmitting}
            className="btn">
            {isSubmitting ? <MuiCircularProgress size={16} /> : "Save"}
          </MuiButton>
        </div>
      </StyledForm>
    </FormikProvider>
  );
};

const StyledForm = styled.form`
  width: calc(100vw - 60px);
  max-width: 400px;
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
