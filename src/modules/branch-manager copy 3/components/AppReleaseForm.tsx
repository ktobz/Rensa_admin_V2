import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";

import { styled, MuiButton, MuiCircularProgress } from "@/lib/index";
import VendgramInput from "@/components/input";

import { toast } from "react-toastify";

import NotificationService from "@/services/notification-service";
import VendgramSelect from "@/components/select/autoComplete";
import AppReleaseService from "@/services/app-release-service";
import { IAppReleaseData } from "@/types/globalTypes";
import useCachedDataStore from "@/config/store-config/lookup";

const SCHEMA = Yup.object().shape({
  devicePlatform: Yup.number().required("required").min(1, "Required"),
  forceUpdate: Yup.boolean().required("required"),
  releaseNotes: Yup.string().required("required"),
  versionNumber: Yup.string().required("required"),
});

type IViewProps = {
  mode: "new" | "edit" | "view";
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const AppReleaseForm = ({
  mode,
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {
  const {
    lookup: { devicePlatform },
  } = useCachedDataStore((state) => state.cache);

  const initialData: IAppReleaseData = {
    id: initData?.id || "",
    devicePlatform: initData?.devicePlatform || 0,
    forceUpdate: initData?.forceUpdate,
    releaseNotes: initData?.releaseNotes || "",
    versionNumber: initData?.versionNumber || "",
  };

  const [show, setShow] = React.useState(false);
  const [action, setAction] = React.useState<"send" | "save" | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleNotificationAddEdit = (formValues: any) => {
    setIsSubmitting(true);

    (initialData?.id
      ? AppReleaseService.update(initialData?.id, formValues)
      : AppReleaseService.create(formValues)
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
      handleNotificationAddEdit(values);
    },
  });

  const { errors, handleSubmit, handleChange, values } = formik;

  const handleSetAction = (action: "save" | "send") => () => {
    setAction(() => action);
  };

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <VendgramSelect
            id="devicePlatform"
            name="devicePlatform"
            label="Device"
            placeholder="Select device"
            value={values.devicePlatform}
            onChange={handleChange}
            helperText={errors.devicePlatform}
            options={devicePlatform}
            error={!!errors.devicePlatform}
            required
          />

          <VendgramInput
            id="versionNumber"
            name="versionNumber"
            label="Version number"
            placeholder="Enter description"
            type="text"
            value={values.versionNumber}
            onChange={handleChange}
            helperText={errors.versionNumber}
            error={!!errors.versionNumber}
            required
          />

          <VendgramInput
            id="releaseNotes"
            name="releaseNotes"
            label="Update description"
            placeholder="Enter description"
            type="text"
            value={values.releaseNotes}
            onChange={handleChange}
            helperText={errors.releaseNotes}
            error={!!errors.releaseNotes}
            required
            rows={2}
            multiline
          />

          <VendgramSelect
            id="forceUpdate"
            name="forceUpdate"
            label="Update type"
            placeholder="Select device"
            value={values.forceUpdate}
            onChange={handleChange}
            helperText={errors.forceUpdate}
            options={updateType}
            error={!!errors.forceUpdate}
            required
          />

          <div className="btn-group">
            <MuiButton
              variant="contained"
              color="inherit"
              disabled={isSubmitting}
              className="btn cancel-btn">
              Cancel
            </MuiButton>
            <MuiButton
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              color="primary"
              startIcon={
                isSubmitting ? <MuiCircularProgress size={16} /> : null
              }
              className="btn">
              Submit
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

const devices = [
  {
    id: 1,
    name: "Android",
  },
  {
    id: 2,
    name: "IOS",
  },
];

const updateType = [
  {
    id: true,
    name: "Forced",
  },
  {
    id: false,
    name: "Optional",
  },
];
