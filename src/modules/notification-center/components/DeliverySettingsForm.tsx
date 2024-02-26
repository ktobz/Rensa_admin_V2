import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";

import { styled, MuiButton, MuiCircularProgress } from "@/lib/index";
import AppInput from "@/components/input";

import { toast } from "react-toastify";

import NotificationService from "@/services/notification-service";
import ConfigService from "@/services/config-service";
import {
  ICategory,
  IDeliverySettingsData,
  IDeliverySettingsReq,
} from "@/types/globalTypes";

const SCHEMA = Yup.object().shape({
  deliveryPickupMethod: Yup.number().required("required"),
  baseFee: Yup.number().required("required"),
  pricePerKm: Yup.number().required("required"),
});

type IViewProps = {
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
  method?: null | ICategory;
};

export const DeliverySettingsForm = ({
  initData,
  handleClose,
  refreshQuery,
  method,
}: IViewProps) => {
  const initialData: IDeliverySettingsData = {
    id: initData?.id || "",
    deliveryPickupMethod: initData?.deliveryPickupMethod || method?.id || "",
    pricePerKm: initData?.pricePerKm || "",
    baseFee: initData?.baseFee || "",
  };

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSetFees = (formValues: any) => {
    setIsSaving(true);
    if (initData) {
      ConfigService.setDeliveryFeeSettings(initData?.id, formValues)
        .then((res) => {
          refreshQuery?.();
          toast.success(res.data?.message || "");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "");
        })
        .finally(() => setIsSaving(false));
    } else {
      ConfigService.createDeliveryFeeSettings(formValues)
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

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          {initData?.deliveryPickupMethod === 1 ? (
            <AppInput
              id="baseFee"
              name="baseFee"
              label="Bike base fee"
              placeholder="₦0.00"
              type="number"
              value={values.baseFee}
              onChange={handleChange}
              helperText={errors.baseFee}
              error={!!errors.baseFee}
              required
            />
          ) : (
            <AppInput
              id="baseFee"
              name="baseFee"
              label="Van base fee"
              placeholder="₦0.00"
              type="number"
              value={values.baseFee}
              onChange={handleChange}
              helperText={errors.baseFee}
              error={!!errors.baseFee}
              required
            />
          )}

          <AppInput
            id="pricePerKm"
            name="pricePerKm"
            label={
              initData?.deliveryPickupMethod === 1
                ? "Bike fee per km"
                : "Van fee per km"
            }
            placeholder="₦0.00"
            type="number"
            value={values.pricePerKm}
            onChange={handleChange}
            helperText={errors.pricePerKm}
            error={!!errors.pricePerKm}
            required
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
