import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { toast } from "react-toastify";

import {
  styled,
  MuiButton,
  MuiCircularProgress,
  MuiInputAdornment,
  IconAttachment,
} from "@/lib/index";
import AppInput from "@/components/input";
import ConfigService from "@/services/config-service";
import NotificationService from "@/services/notification-service";

const SCHEMA = Yup.object().shape({
  name: Yup.string().required("required"),
  fileUrl: Yup.string().required("required"),
});

type IViewProps = {
  mode: "new" | "edit";
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const CategoryForm = ({
  mode,
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {
  const initialData = {
    id: initData?.id || "",
    name: initData?.name || "",
    file: initData?.fileUrl || "",
  };

  const [isSaving, setIsSaving] = React.useState(false);
  const [fileURL, setFileURL] = React.useState<string | File | null>(
    initData?.fileUrl || ""
  );
  const profileImageRef = React.useRef<HTMLInputElement>(null);

  const handleNotificationAddEdit = (formValues: any) => {
    const formData = new FormData();
    formData.append("name", formValues?.name);
    formData.append("file", fileURL as File);
    setIsSaving(true);

    (initialData?.id
      ? NotificationService.updateCategory(initialData?.id, formData)
      : NotificationService.createCategory(formData)
    )
      .then((res) => {
        refreshQuery?.();
        // toast.success(res. || "");
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

  const handleChangeProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      const file = e.target?.files?.[0];
      // setFile(e.target.files[0]);
      const fileName = file?.name;
      const fileType = file?.type;

      if (fileType !== "image/svg+xml") {
        setFieldValue("fileUrl", "");
        return toast.error("Please upload an SVG file");
      }

      setFieldValue("fileUrl", fileName);
      setFileURL(e.target.files?.[0] as File);
      // uploadImage(e.target.files?.[0] as File);
    }
  };

  const handleClickInputField = () => {
    if (profileImageRef.current) {
      profileImageRef?.current?.click();
    }
  };

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <AppInput
            id="name"
            name="name"
            label="Category name"
            placeholder="Enter a question"
            type="text"
            value={values.name}
            onChange={handleChange}
            helperText={errors.name}
            error={!!errors.name}
            required
          />

          <input
            ref={profileImageRef}
            onChange={handleChangeProfileImage}
            name="profile-image"
            type="file"
            accept="image/*"
            style={{ visibility: "hidden" }}
          />
          <AppInput
            id="fileUrl"
            name="fileUrl"
            label="Upload icon (SVG only)"
            placeholder="Choose file"
            type="text"
            value={values.fileUrl}
            onChange={() => null}
            helperText={errors.fileUrl}
            error={!!errors.fileUrl}
            onClick={handleClickInputField}
            required
            InputProps={{
              endAdornment: (
                <MuiInputAdornment position="end">
                  <IconAttachment />
                </MuiInputAdornment>
              ),
            }}
          />

          <div className="btn-group">
            <MuiButton
              type="submit"
              variant="contained"
              disabled={isSaving}
              color="primary"
              startIcon={isSaving ? <MuiCircularProgress size={16} /> : null}
              className="btn">
              {mode === "edit" ? "Save Category" : "Add category"}
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

  & #file-upload-button {
    width: 30px;
    background: red;
  }
`;
