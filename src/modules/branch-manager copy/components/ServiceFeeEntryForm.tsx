import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";

import { styled, MuiButton, MuiCircularProgress } from "@/lib/index";
import VendgramInput from "@/components/input";

import { toast } from "react-toastify";

import NotificationService from "@/services/notification-service";
import ConfigService from "@/services/config-service";

const SCHEMA = Yup.object().shape({
  percentage: Yup.number().required("required"),
  cap_price: Yup.number().required("required"),
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
  const initialData = {
    id: initData?.id || "",
    percentage: initData?.percentage || "",
    cap_price: initData?.cap_price || "",
  };

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSetFees = (formValues: any) => {
    setIsSaving(true);

    ConfigService.setServiceFeeSettings(formValues)
      .then((res) => {
        refreshQuery?.();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      })
      .finally(() => setIsSaving(false));
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
          <VendgramInput
            id="percentage"
            name="percentage"
            label="Percentage (based off item)"
            placeholder="0%"
            type="number"
            value={values.percentage}
            onChange={handleChange}
            helperText={errors.percentage}
            error={!!errors.percentage}
            required
          />

          <VendgramInput
            id="cap_price"
            name="cap_price"
            label="Cap price"
            placeholder="₦0.00"
            type="number"
            value={values.cap_price}
            onChange={handleChange}
            helperText={errors.cap_price}
            error={!!errors.cap_price}
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
