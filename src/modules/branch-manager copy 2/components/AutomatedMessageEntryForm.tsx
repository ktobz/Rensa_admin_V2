import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { toast } from "react-toastify";

import { styled, MuiButton, MuiCircularProgress } from "@/lib/index";
import VendgramInput from "@/components/input";
import ConfigService from "@/services/config-service";
import NotificationService from "@/services/notification-service";

const SCHEMA = Yup.object().shape({
  title: Yup.string().required("required"),
  message: Yup.string().required("required"),
  subject: Yup.string().required("required"),
});

type IViewProps = {
  mode: "new" | "edit";
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const AutomatedMessageEntryForm = ({
  mode,
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {
  const initialData = {
    id: initData?.id || "",
    title: initData?.title || "",
    subject: initData?.subject || "",
    message: initData?.message || "",
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleNotificationAddEdit = (formValues: any) => {
    setIsSubmitting(true);

    (initialData?.id
      ? NotificationService.updateAutomatedMessage(initialData?.id, formValues)
      : NotificationService.createAutomatedMessage(formValues)
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

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <VendgramInput
            id="subject"
            name="subject"
            label="Subject"
            placeholder="Enter subject"
            type="text"
            value={values.subject}
            helperText={errors.subject}
            error={!!errors.subject}
            onChange={() => null}
            disabled
          />

          <VendgramInput
            id="title"
            name="title"
            label="Title"
            placeholder="Enter title"
            type="text"
            value={values.title}
            helperText={errors.title}
            error={!!errors.title}
            required
          />

          <VendgramInput
            id="message"
            name="message"
            label="Message"
            placeholder="Enter message"
            type="text"
            value={values.message}
            onChange={handleChange}
            helperText={errors.message}
            error={!!errors.message}
            required
            rows={2}
            multiline
          />

          <div className="btn-group">
            <MuiButton
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              color="primary"
              startIcon={
                isSubmitting ? <MuiCircularProgress size={16} /> : null
              }
              className="btn">
              {mode === "edit" ? "Save message" : "Add message"}
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
