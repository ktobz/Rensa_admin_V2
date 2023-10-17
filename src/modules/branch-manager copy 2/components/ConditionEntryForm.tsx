import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { toast } from "react-toastify";

import { styled, MuiButton, MuiCircularProgress } from "@/lib/index";
import VendgramInput from "@/components/input";
import ConfigService from "@/services/config-service";

const SCHEMA = Yup.object().shape({
  title: Yup.string().required("required"),
  description: Yup.string().required("required"),
});

type IViewProps = {
  mode: "new" | "edit";
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const ConditionEntryForm = ({
  mode,
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {
  const initialData = {
    id: initData?.id || "",
    title: initData?.title || "",
    description: initData?.description || "",
  };

  const [action, setAction] = React.useState<"send" | "save" | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleNotificationAddEdit = (formValues: any) => {
    setIsSaving(true);

    (initialData?.id
      ? ConfigService.updateFAQ(initialData?.id, formValues)
      : ConfigService.createFAQ(formValues)
    )
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
      handleNotificationAddEdit(values);
    },
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <VendgramInput
            id="title"
            name="title"
            label="Condition name"
            placeholder="Enter name"
            type="text"
            value={values.title}
            onChange={handleChange}
            helperText={errors.title}
            error={!!errors.title}
            required
          />

          <VendgramInput
            id="description"
            name="description"
            label="Brief Description"
            placeholder="Describe condition"
            type="text"
            value={values.description}
            onChange={handleChange}
            helperText={errors.description}
            error={!!errors.description}
            required
            rows={2}
            multiline
          />

          <div className="btn-group">
            <MuiButton
              type="submit"
              variant="contained"
              disabled={isSaving}
              color="primary"
              startIcon={isSaving ? <MuiCircularProgress size={16} /> : null}
              className="btn">
              {mode === "edit" ? "Save Condition" : "Add condition"}
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
