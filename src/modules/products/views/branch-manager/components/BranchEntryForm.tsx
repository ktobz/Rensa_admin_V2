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

import VendgramCustomModal from "components/modal/Modal";
import { IconDefaultUserImage, IconListIcon } from "lib/mui.lib.icons";
import CardService from "@/services/branches.service";
import { toast } from "react-toastify";
import { IProductEntryProps } from "../types";
import VendgramSelect from "@/components/select/autoComplete";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import { DURATION_OPTION } from "@/data/product-category";
import BranchManagerService from "@/services/branch-manager-service";
import VendgramVirtualizedCountriesSelect from "@/components/select/test";
import { useQuery } from "react-query";
import BranchService from "@/services/branches.service";
import { dataURLtoBlob } from "@/utils/helper-funcs";
import { useIds } from "@/utils/hooks";

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
  partnerId?: string;
};

export const BranchEntryFormView = ({
  mode,
  initData,
  handleClose,
  refreshQuery,
  partnerId,
}: IViewProps) => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);

  const initialData = {
    branchId: initData?.branch?.id || "",
    email: initData?.email || "",
    phone: initData?.phone || "",
    fullName: initData?.full_name || "",
  };

  const [showPhoneModal, setShowPhoneModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // const [file, setFile] = React.useState<null | File>(null);
  const [fileURL, setFileURL] = React.useState<string | ArrayBuffer | null>(
    initData?.profile_image || ""
  );
  const profileImageRef = React.useRef<HTMLInputElement>(null);

  const [uploadFileState, setUploadFileState] = React.useState({
    isUploading: false,
    progress: 0,
  });

  const handleCreateCard = (formValues: IProductEntryProps) => {
    if (!fileURL) {
      toast.error("Upload manager photo");
      return;
    }
    setIsSubmitting(true);

    let bodyData = new FormData();
    bodyData.append("full_name", values.fullName);
    bodyData.append("email", values.email);
    bodyData.append("phone", values.phone);
    bodyData.append("profile_image", dataURLtoBlob(fileURL as string));
    if (values.branchId) {
      bodyData.append("branch_id", values.branchId);
    }

    (initData?.id
      ? BranchManagerService.update(initData?.id, bodyData)
      : BranchManagerService.create(bodyData)
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
      handleCreateCard(values);
    },
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleChangeProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      // setFile(e.target.files[0]);
      const file = new FileReader();

      file.onload = () => {
        if (file.readyState === 2) {
          setFileURL(file.result);
          // uploadImage(e.target.files?.[0] as File);
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

  const branches = useQuery(
    ["all-branches", partnerId],
    () =>
      BranchService.getAll(partnerId || "").then((res) => {
        return res.data.data;
      }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );

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

          <VendgramInput
            id="email"
            name="email"
            label="Registered Email"
            placeholder="Enter email"
            type="email"
            value={values.email}
            onChange={handleChange}
            helperText={
              errors.email ||
              "Email is needed to access the Rensa Partner Branch app linked to a Branch."
            }
            required
            error={!!errors.email}
          />

          <VendgramInput
            id="phone"
            name="phone"
            label="Phone Number"
            placeholder="Enter phone number"
            type="number"
            value={values.phone}
            onChange={handleChange}
            helperText={errors.phone}
            error={!!errors.phone}
            required
          />

          <VendgramVirtualizedCountriesSelect
            label="Assigned Branch"
            placeholder="Select branch"
            value={values.branchId}
            // helperText={errors.branchId}
            error={!!errors.branchId}
            // onBlur={handleBlur}
            options={branches.data || []}
            optionValue="id"
            optionTitle="name"
            updateFieldValue={(value: { id: number; name: string }) =>
              handleCustomChange("branchId", value.id)
            }
            selectedValue={values.branchId}
            wrapperStyle={{ width: "auto" }}
            showCheck={false}
            showPills={false}
            required
          />
          <div className="btn-group">
            <MuiButton
              type="button"
              variant="contained"
              onClick={handleClose}
              className="btn cancel-btn">
              Cancel
            </MuiButton>
            <MuiButton
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              color="primary"
              className="btn">
              {isSubmitting ? (
                <MuiCircularProgress size={16} />
              ) : mode === "edit" ? (
                "Save Branch Manager"
              ) : (
                "Add Branch Manager"
              )}
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

    & .cancel-btn {
      background-color: #fbfbfb;
      color: #363636;
    }
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
`;
