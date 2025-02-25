import { FormikProvider, useFormik } from "formik";
import * as React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import AppInput from "@/components/input";
import { MuiButton, MuiCircularProgress, styled } from "@/lib/index";
import ConfigService from "@/services/config-service";
import { IPayoutData } from "@/types/globalTypes";

const SCHEMA = Yup.object().shape({
  waitTimeInHours: Yup.number().required("required"),
  offerExpirationInHours: Yup.number().required("required"),
  offerReminderIntervalInMinutes: Yup.number().required("required"),
  pendingCheckoutReminderInMinutes: Yup.number().required("required"),
  maxCheckoutReminders: Yup.number().required("required"),
});

type IViewProps = {
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const PayoutSettingsForm = ({
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {
  const initialData: IPayoutData = {
    id: initData?.id || "",
    waitTimeInHours: initData?.waitTimeInHours || "",
    offerExpirationInHours: initData?.offerExpirationInHours || "",
    offerReminderIntervalInMinutes: initData?.offerReminderIntervalInMinutes || "",
    pendingCheckoutReminderInMinutes: initData?.pendingCheckoutReminderInMinutes || "",
    maxCheckoutReminders: initData?.maxCheckoutReminders || "",
  };

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSetFees = (formValues: IPayoutData) => {
    setIsSaving(true);

    if (initData.id) {
      ConfigService.setPayoutSettings(initData?.id || 0, formValues)
        .then((res) => {
          refreshQuery?.();
          toast.success( "Payout config updated successfully");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "");
        })
        .finally(() => setIsSaving(false));
    } else {
      ConfigService.createPayoutSettings(formValues)
        .then((res) => {
          refreshQuery?.();
          toast.success(res.data?.message || "");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "");
        })
        .finally(() => setIsSaving(false));
    }

    if (initData.id) {
      ConfigService.setOfferSettings(initData?.id || 0, formValues)
        .then((res) => {
          refreshQuery?.();
          toast.success( "Offer config updated successfully");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "");
        })
        .finally(() => setIsSaving(false));
    } else {
      ConfigService.createOfferSettings(formValues)
        .then((res) => {
          refreshQuery?.();
          toast.success("Offer config set successfully");
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

  const { errors, handleSubmit, handleChange, values } = formik;

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <AppInput
            id="waitTimeInHours"
            name="waitTimeInHours"
            label="Payout: Pay Seller After (hours)"
            placeholder=""
            type="number"
            value={values.waitTimeInHours}
            onChange={handleChange}
            helperText={errors.waitTimeInHours}
            error={!!errors.waitTimeInHours}
            required
          />
               <AppInput
            id="offerExpirationInHours"
            name="offerExpirationInHours"
            label="Pending Offer Expiration (hours)"
            placeholder=""
            type="number"
            value={values.offerExpirationInHours}
            onChange={handleChange}
            helperText={errors.offerExpirationInHours}
            error={!!errors.offerExpirationInHours}
            required
          />
               <AppInput
            id="offerReminderIntervalInMinutes"
            name="offerReminderIntervalInMinutes"
            label="Pending Offer Reminder Interval (minutes)"
            placeholder=""
            type="number"
            value={values.offerReminderIntervalInMinutes}
            onChange={handleChange}
            helperText={errors.offerReminderIntervalInMinutes}
            error={!!errors.offerReminderIntervalInMinutes}
            required
          />
               <AppInput
            id="pendingCheckoutReminderInMinutes"
            name="pendingCheckoutReminderInMinutes"
            label="Pending Checkout Reminder (minutes)"
            placeholder=""
            type="number"
            value={values.pendingCheckoutReminderInMinutes}
            onChange={handleChange}
            helperText={errors.pendingCheckoutReminderInMinutes}
            error={!!errors.pendingCheckoutReminderInMinutes}
            required
          />
               <AppInput
            id="maxCheckoutReminders"
            name="maxCheckoutReminders"
            label="Max. Checkout Reminder (times)"
            placeholder=""
            type="number"
            value={values.maxCheckoutReminders}
            onChange={handleChange}
            helperText={errors.maxCheckoutReminders}
            error={!!errors.maxCheckoutReminders}
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
  width: calc(100vw - 80px);

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
