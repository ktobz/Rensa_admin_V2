import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";

import {
  styled,
  MuiTypography,
  MuiButton,
  MuiCircularProgress,
  MuiInputAdornment,
} from "@/lib/index";
import VendgramInput from "@/components/input";

import VendgramCustomModal from "components/modal/Modal";
import { IconListIcon } from "lib/mui.lib.icons";
import CardService from "@/services/branches.service";
import { toast } from "react-toastify";
import { IProductCategory, IProductEntryProps } from "../types";
import VendgramSelect from "@/components/select/autoComplete";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import { DURATION_OPTION, PRODUCT_CAT_OPTION } from "@/data/product-category";
import { useQuery } from "react-query";
import ProductService from "@/services/product-service";

const SCHEMA = Yup.object().shape({
  product_category_id: Yup.number().required("required").min(1, "required"),
  sale_quantity: Yup.number().required("required").min(1, "required"),
  price_litre: Yup.number(),
  gross_price: Yup.number(),
  name: Yup.string().when("product_category_id", {
    is: 4,
    then: Yup.string().required("required"),
    otherwise: Yup.string(),
  }),
});

type IViewProps = {
  mode: "new" | "edit";
  initData?: any;
  handleShowSetPrice: () => void;
  refreshQuery?: () => void;
  partnerId: string;
};

export const ProductEntryForm = ({
  mode,
  initData,
  handleShowSetPrice,
  refreshQuery,
  partnerId,
}: IViewProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const initialData = {
    product_category_id: initData?.product_category?.id || 0,
    price_litre: initData?.price_litre || "",
    sale_quantity: initData?.sale_quantity || "",
    name: initData?.name || "",
    gross_price: initData?.gross_price || "",
  };

  const handleAddProduct = (values: any) => {
    setIsSubmitting(true);
    (initData?.id
      ? ProductService.update(partnerId, initData?.id, {
          ...values,
          name: values?.name?.trim() || "",
          sale_quantity: +values?.sale_quantity,
        })
      : ProductService.create(partnerId, {
          ...values,
          name: values?.name?.trim() || "",
          sale_quantity: +values?.sale_quantity,
        })
    )
      .then((res) => {
        refreshQuery?.();
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
      handleAddProduct(values as IProductEntryProps);
    },
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;

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

  useQuery(
    ["product-price", values.product_category_id],
    () =>
      ProductService.getAProductPrice(values.product_category_id).then(
        (res) => {
          const data = res.data?.data?.price;
          setFieldValue("price_litre", data || 150);
          setFieldValue("gross_price", (data || 150) * values.sale_quantity);
          return data;
        }
      ),
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!values.product_category_id && values.product_category_id !== 4,
    }
  );

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setFieldValue("gross_price", +value * (values.price_litre || 300));
    handleChange(e);
  };

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
            value={values.product_category_id}
            onChange={handleChange}
            name="product_category_id"
            options={productCategories?.data || PRODUCT_CAT_OPTION}
            optionTitle="name"
            optionValue="id"
            style={{ width: "100%" }}
            label="Product category"
            error={!!errors.product_category_id}
            placeholder="Select"
            iconName="image"
            helperText={
              errors.product_category_id || values.product_category_id === 4 ? (
                ""
              ) : !values.price_litre ? (
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
              ) : (
                <MuiTypography variant="subtitle2" className="price-unit">
                  Price/Litre <span>₦{values.price_litre}/ltr</span>
                </MuiTypography>
              )
            }
          />

          {values?.product_category_id === 4 && (
            <>
              <VendgramInput
                id="name"
                name="name"
                label="Product Name"
                placeholder="Enter Name"
                type="text"
                value={values.name}
                onChange={handleChange}
                helperText={errors.name}
                error={!!errors.name}
              />
              <VendgramInput
                id="gross_price"
                name="gross_price"
                label="Price"
                placeholder="Enter price"
                type="number"
                value={values.gross_price}
                onChange={handleChange}
                helperText={errors.gross_price}
                error={!!errors.gross_price}
                startAdornment={
                  <MuiInputAdornment position="start">₦</MuiInputAdornment>
                }
              />

              <VendgramInput
                id="sale_quantity"
                name="sale_quantity"
                label="Quantity"
                placeholder="Enter quantity"
                type="number"
                value={values.sale_quantity}
                onChange={handleChange}
                helperText={errors.sale_quantity}
                error={!!errors.sale_quantity}
              />
            </>
          )}

          {values?.product_category_id !== 4 &&
            values?.product_category_id > 0 && (
              <>
                <VendgramInput
                  id="sale_quantity"
                  name="sale_quantity"
                  label="Sale Quantity (LTRS)"
                  placeholder="Enter quantity"
                  type="number"
                  value={values.sale_quantity}
                  onChange={handleCustomChange}
                  helperText={errors.sale_quantity}
                  error={!!errors.sale_quantity}
                />
                <VendgramInput
                  id="gross_price"
                  name="gross_price"
                  label="Calculated Unit Price"
                  placeholder="₦0/unit "
                  type="text"
                  value={values.gross_price}
                  onChange={() => null}
                  helperText={errors.gross_price}
                  error={!!errors.gross_price}
                  disabled
                />
              </>
            )}
        </div>
        <MuiButton
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          className="btn">
          {isSubmitting ? (
            <MuiCircularProgress size={16} />
          ) : mode === "edit" ? (
            "Save Item"
          ) : (
            "Add Item"
          )}
        </MuiButton>
      </StyledForm>
    </FormikProvider>
  );
};

const StyledForm = styled.form`
  width: calc(100vw - 40px);
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  max-width: 450px;
  min-height: 300px;
  display: flex;
  flex-direction: column;

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
    flex: 1;
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

  & .Mui-disabled {
    margin-bottom: 0 !important;
  }
`;
