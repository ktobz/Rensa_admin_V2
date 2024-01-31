import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";

import { styled, MuiButton, MuiCircularProgress } from "@/lib/index";
import AppInput from "@/components/input";

import { toast } from "react-toastify";

import NotificationService from "@/services/notification-service";

const SCHEMA = Yup.object().shape({
  title: Yup.string().required("required"),
  message: Yup.string().required("required"),
});

type IViewProps = {
  mode: "new" | "edit" | "view";
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const NotificationEntryForm = ({
  mode,
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {
  const [show, setShow] = React.useState(false);

  const initialData = {
    id: initData?.id || "",
    title: initData?.title || "",
    message: initData?.message || "",
  };

  const [action, setAction] = React.useState<"send" | "save" | null>(null);
  const [isSending, setIsSending] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleNotificationAddEdit = (formValues: any) => {
    setIsSaving(true);

    (initialData?.id
      ? NotificationService.update(initialData?.id, formValues)
      : NotificationService.create(formValues)
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

  const handleSendNotification = (formValues: any) => {
    setIsSending(true);
    NotificationService.sendNotification(formValues)
      .then((res) => {
        refreshQuery?.();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      })
      .finally(() => setIsSending(false));
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      if (action === "save") {
        handleNotificationAddEdit(values);
      } else {
        handleSendNotification(values);
      }
    },
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;

  const handleSetAction = (action: "save" | "send") => () => {
    setAction(() => action);
  };

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <AppInput
            id="title"
            name="title"
            label="Title"
            placeholder="Enter title"
            type="text"
            value={values.title}
            onChange={handleChange}
            helperText={errors.title}
            error={!!errors.title}
            required
            disabled={mode === "view"}
          />

          <AppInput
            id="message"
            name="message"
            label="Body"
            placeholder="Enter message"
            type="text"
            value={values.message}
            onChange={handleChange}
            helperText={errors.message}
            error={!!errors.message}
            required
            rows={4}
            multiline
            disabled={mode === "view"}
          />

          <div className="btn-group">
            <MuiButton
              type="submit"
              variant="contained"
              color="secondary"
              onClick={handleSetAction("save")}
              disabled={isSending || isSaving}
              startIcon={isSaving ? <MuiCircularProgress size={16} /> : null}
              className="btn cancel-btn">
              Save
            </MuiButton>
            <MuiButton
              type="submit"
              variant="contained"
              disabled={isSending || isSaving}
              color="primary"
              onClick={handleSetAction("send")}
              startIcon={isSending ? <MuiCircularProgress size={16} /> : null}
              className="btn">
              Send
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
