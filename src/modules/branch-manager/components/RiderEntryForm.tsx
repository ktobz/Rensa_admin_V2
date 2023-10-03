import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";

import {
  styled,
  MuiTypography,
  MuiButton,
  MuiCircularProgress,
  MuiCardMedia,
} from "@/lib/index";
import VendgramInput from "@/components/input";

import { IconDefaultUserImage } from "lib/mui.lib.icons";

import { toast } from "react-toastify";

import { dataURLtoBlob } from "@/utils/helper-funcs";
import RiderService from "@/services/rider-service";

const SCHEMA = Yup.object().shape({
  fullName: Yup.string().required("required"),
  email: Yup.string().required("required"),
  phone: Yup.string()
    .required("required")
    .min(9, "Please enter a valid number"),
});

type IViewProps = {
  mode: "new" | "edit";
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const RiderEntryForm = ({
  mode,
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);

  const initialData = {
    id: initData?.id || "",
    email: initData?.user?.email || "",
    phone: initData?.phone || "",
    fullName: initData?.full_name || "",
  };

  const [showPhoneModal, setShowPhoneModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fileURL, setFileURL] = React.useState<string | ArrayBuffer | null>(
    initData?.profile_image || ""
  );
  const profileImageRef = React.useRef<HTMLInputElement>(null);

  const [uploadFileState, setUploadFileState] = React.useState({
    isUploading: false,
    progress: 0,
  });

  const handleRiderAddEdit = (formValues: any) => {
    if (!fileURL) {
      toast.error("Upload rider photo");
      return;
    }
    setIsSubmitting(true);

    let bodyData = new FormData();
    bodyData.append("full_name", values.fullName);
    bodyData.append("email", values.email);
    bodyData.append("phone", values.phone);
    console.log(fileURL);
    bodyData.append(
      "profile_image",
      fileURL?.toString()?.includes("http")
        ? (fileURL as string)
        : dataURLtoBlob(fileURL as string)
    );

    (initialData?.id
      ? RiderService.update(initialData?.id, bodyData)
      : RiderService.create(bodyData)
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
      handleRiderAddEdit(values);
    },
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;

  const handleCloseModal = () => {
    setShow(false);
  };

  const uploadImage = (image: File) => {
    const formData = new FormData();
    formData.append("image", image);
  };

  const handleChangeProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setSelectedName(e.target.files[0].name);
    setUploadFileState((prev) => ({
      ...prev,
      isUploading: false,
      progress: 0,
    }));

    if (e.target?.files) {
      // setFile(e.target.files[0]);
      const file = new FileReader();

      file.onload = () => {
        if (file.readyState === 2) {
          setFileURL(file.result);
          uploadImage(e.target.files?.[0] as File);
        }
      };
      file.readAsDataURL(e.target.files[0]);
    }
  };

  const handleClickInputField = () => {
    if (profileImageRef.current) {
      profileImageRef?.current?.click();
    }
  };

  const handleCustomChange = (name: string, value: string | number) => {
    setFieldValue(name, value);
  };

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <input
            ref={profileImageRef}
            onChange={handleChangeProfileImage}
            name="profile-image"
            type="file"
            accept="image/*"
            style={{ visibility: "hidden" }}
          />
          <div className="image-wrapper">
            {uploadFileState.isUploading && (
              <MuiCircularProgress className="image-loader" />
            )}

            {fileURL ? (
              <MuiCardMedia
                image={fileURL as string}
                className="user-image"
                component="img"
                width={100}
                height={100}
              />
            ) : (
              <IconDefaultUserImage className="user-image" />
            )}

            <div className="image-control">
              <MuiButton
                // htmlFor="profile-image"
                onClick={handleClickInputField}
                className="change-image">
                Update photo
              </MuiButton>
              <MuiTypography variant="body2" className="info">
                Maximum file: 5MB
              </MuiTypography>
            </div>
          </div>
          <VendgramInput
            id="fullName"
            name="fullName"
            label="Full Name"
            placeholder="Enter name"
            type="text"
            value={values.fullName}
            onChange={handleChange}
            helperText={errors.fullName}
            error={!!errors.fullName}
            required
          />

          {/* {
            mode === 'new' && (
              
            )
          } */}
          <VendgramInput
            id="email"
            name="email"
            label="Email Address"
            placeholder="Enter email"
            type="email"
            value={values.email}
            onChange={handleChange}
            helperText={errors.email}
            error={!!errors.email}
            required
            disabled={mode === "edit"}
          />

          <VendgramInput
            id="phone"
            name="phone"
            label="Phone Number"
            placeholder="Enter phone number"
            type="number"
            value={values.phone}
            onChange={handleChange}
            error={!!errors.phone}
            required
            helperText={
              errors.branchManager ||
              "Phone number is needed to access the Rensa Rider app"
            }
          />

          <MuiButton
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className="btn">
            {isSubmitting ? (
              <MuiCircularProgress size={16} />
            ) : mode === "edit" ? (
              "Save Rider"
            ) : (
              "Add Rider"
            )}
          </MuiButton>
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

  & .image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding-top: 27px;
    position: relative;

    & .image-loader {
      position: absolute;
      margin: auto 0;
      left: 40%;
      right: 50%;
      top: 29%;
    }

    & .info {
      margin-top: 10px;
      color: #64748b;
      font-size: 13px;
    }

    & .change-image {
      min-height: fit-content;
      height: fit-content;
      padding: 5px;
      display: block;
      cursor: pointer;
      color: #f05b2a;
      font-size: 13px;
      background: #f05b2a1a;
      border-radius: 30px;
      padding: 10px 20px;
    }
  }
  & .user-image {
    border-radius: 50%;
    overflow: hidden;
    width: 160px;
    height: 160px;
    text-align: center;
    border: 1px solid #f1f2f5;
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
`;
