import { FormikProvider, useFormik } from "formik";
import * as React from "react";
import * as Yup from "yup";

import AppInput from "@/components/input";
import { MuiButton, MuiCircularProgress, styled } from "@/lib/index";

import { toast } from "react-toastify";

import ConfigService from "@/services/config-service";
import { IServiceFeeReq } from "@/types/globalTypes";
import { isValidNumberInput } from "@/utils/helper-funcs";

const SCHEMA = Yup.object().shape({
  buyerServiceFee: Yup.number().required("required"),
  sellerServiceFee: Yup.number().required("required"),
});

type IViewProps = {
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const ServiceFeeEntryForm = ({
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {
  const initialData: IServiceFeeReq = {
    id: initData?.id || "",
    buyerServiceFee: initData?.buyerServiceFee || "",
    buyerServiceFeeCapAmount: initData?.buyerServiceFeeCapAmount || "",
    sellerServiceFee: initData?.sellerServiceFee || "",
    sellerServiceFeeCapAmount: initData?.sellerServiceFeeCapAmount || "",
  };

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSetFees = (formValues: IServiceFeeReq) => {
    setIsSaving(true);

    if (initData?.id) {
      ConfigService.setServiceFeeSettings(initData?.id || 0, {
        ...formValues,
        buyerServiceFeeCapAmount: +formValues.buyerServiceFeeCapAmount || 0,
        sellerServiceFeeCapAmount: +formValues.sellerServiceFeeCapAmount || 0,
      })
        .then((res) => {
          refreshQuery?.();
          toast.success(res.data?.message || "");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "");
        })
        .finally(() => setIsSaving(false));
    } else {
      ConfigService.createServiceFeeSettings(formValues)
        .then((res) => {
          refreshQuery?.();
          toast.success(res.data?.message || "");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "");
        })
        .finally(() => setIsSaving(false));
    }
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      handleSetFees(values);
    },
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (isValidNumberInput(value)) {
      setFieldValue(name, value);
    }
  };

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <AppInput
            id="buyerServiceFee"
            name="buyerServiceFee"
            label="Buyer service fee"
            placeholder="₦0.00"
            type="text"
            value={values.buyerServiceFee}
            onChange={handleInputChange}
            helperText={errors.buyerServiceFee}
            error={!!errors.buyerServiceFee}
            required
            inputMode="numeric"
            InputProps={{}}
          />
          <AppInput
            id="buyerServiceFeeCapAmount"
            name="buyerServiceFeeCapAmount"
            label="Buyer service fee"
            placeholder="₦0.00"
            type="text"
            value={values.buyerServiceFeeCapAmount}
            onChange={handleInputChange}
            helperText={errors.buyerServiceFeeCapAmount}
            error={!!errors.buyerServiceFeeCapAmount}
            required
            inputMode="numeric"
            InputProps={{}}
          />
          <AppInput
            id="sellerServiceFee"
            name="sellerServiceFee"
            label="Seller service fee"
            placeholder="₦0.00"
            type="text"
            value={values.sellerServiceFee}
            onChange={handleInputChange}
            helperText={errors.sellerServiceFee}
            error={!!errors.sellerServiceFee}
            required
            inputMode="numeric"
          />
          <AppInput
            id="sellerServiceFeeCapAmount"
            name="sellerServiceFeeCapAmount"
            label="Seller service fee"
            placeholder="₦0.00"
            type="text"
            value={values.sellerServiceFeeCapAmount}
            onChange={handleInputChange}
            helperText={errors.sellerServiceFeeCapAmount}
            error={!!errors.sellerServiceFeeCapAmount}
            required
            inputMode="numeric"
          />
          <div className="btn-group">
            <MuiButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSaving}
              startIcon={isSaving ? <MuiCircularProgress size={16} /> : null}
              className="btn">
              Save
            </MuiButton>
          </div>
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

  & .wrapper {
    max-width: 450px;
    width: 100%;
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

  & .btn-group {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
  }

  & .MuiOutlinedInput-root {
    & .Mui-disabled {
      -webkit-text-fill-color: rgba(0, 0, 0, 0.68) !important;
      margin-bottom: 0 !important;
    }
  }
  & .Mui-disabled {
    color: #000;
    margin-bottom: 0;
  }

  & textarea {
    padding: 0 !important;
  }
`;
