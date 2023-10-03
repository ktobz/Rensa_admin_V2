import * as React from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useQuery } from "react-query";

import {
  IconDefaultUserImage,
  IconInfo,
  MuiButton,
  MuiCardMedia,
  MuiCircularProgress,
  MuiInputAdornment,
  MuiTypography,
  styled,
} from "@/lib/index";
import InputRowVariant from "@/components/input/InputRowVariant";
import VendgramCustomModal from "@/components/modal/Modal";
import AuthService from "@/services/auth.service";
import { dataURLtoBlob } from "@/utils/helper-funcs";
import PartnerService from "@/services/partner-service";
import { IPartnerDataProps } from "@/types/globalTypes";
import { CustomActionCard } from "@/components/card/CustomActionCard";

export default function ProfileView({ partnerId }: { partnerId: string }) {
  const { data, isSuccess } = useQuery(
    ["partner-profile", partnerId],
    () =>
      PartnerService.getOne(partnerId).then((res) => {
        const data = res.data?.data;

        return data as IPartnerDataProps;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: !!partnerId,
    }
  );

  const [show, setShow] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fileURL, setFileURL] = React.useState<string | ArrayBuffer | null>(
    data?.profile_image || ""
  );
  const profileImageRef = React.useRef<HTMLInputElement>(null);

  const [uploadFileState, setUploadFileState] = React.useState({
    isUploading: false,
    progress: 0,
  });

  const handleToggleShow = () => {
    setShow((prev) => !prev);
  };

  const uploadImage = (image: string | ArrayBuffer) => {
    const formData = new FormData();
    formData.append("profile_image", dataURLtoBlob(image as string));

    AuthService.updateImage(formData, {
      onUploadProgress: (progressEvent) => {
        setUploadFileState((prev) => ({
          ...prev,
          isUploading: true,
          progress: Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          ),
        }));
      },
      timeout: 30000,
      timeoutErrorMessage: "File took too long to upload",
    })
      .then((res) => {
        const data = res.data;
        if (data.status_code === 200 || data.status_code === 201) {
          toast.success(data.message || data.status);
        } else {
          toast.error(data?.message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.message);
      })
      .finally(() => {
        setUploadFileState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 0,
        }));
      });
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
          uploadImage(file.result as string);
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
  return (
    <PageContent>
      <div className="form-wrapper">
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

        <div className="input-wrapper">
          <InputRowVariant
            name="full_name"
            label="Partner Name"
            type="text"
            value={data?.name || ""}
          />
        </div>
        <div className="input-wrapper">
          <InputRowVariant
            name="phone"
            label="Contact Number"
            type="text"
            value={data?.contact_phone || ""}
          />
        </div>
        <div className="input-wrapper">
          <InputRowVariant
            name="email"
            label="Email Address"
            type="text"
            value={data?.email || ""}
          />
        </div>
        <div className="input-wrapper">
          <InputRowVariant
            name="created_at"
            label="Date Registered"
            type="text"
            value={format(
              isSuccess ? new Date(data?.created_at) : new Date(),
              "LL MMMM, yyyy"
            )}
          />
        </div>
        <div className="input-wrapper">
          <InputRowVariant
            name="password"
            label="Password"
            id="password-input"
            type="text"
            value={"⚫⚫⚫⚫⚫⚫⚫⚫"}
            InputProps={{
              endAdornment: (
                <MuiInputAdornment position="end">
                  <MuiButton
                    style={{ color: "#f05b2a !important" }}
                    onClick={handleToggleShow}
                    className="change-image">
                    Reset Password
                  </MuiButton>
                </MuiInputAdornment>
              ),
            }}
            helperText={
              <MuiTypography
                variant="body2"
                style={{
                  marginTop: "15px",
                  fontSize: "12px",
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}>
                <IconInfo htmlColor="#F05B2A" /> Partner will get a reset email
                to create new password
              </MuiTypography>
            }
          />
        </div>
      </div>

      <VendgramCustomModal
        handleClose={handleToggleShow}
        open={show}
        alignTitle="left"
        title=""
        showClose>
        <CustomActionCard
          buttonAction={handleToggleShow}
          message="Are you sure you want to reset the password of this partner?"
          buttonText="Yes, Reset"
          showIcon={false}
          title="Reset Password"
          isSubmitting={isSubmitting}
        />
      </VendgramCustomModal>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  padding: 20px;
  background: #fff;
  border-radius: 10px;

  & #password-input {
    & .MuiOutlinedInput-input {
      font-size: 7px;
    }
    & .change-image {
      color: #f05b2a;
    }
  }

  & .form-wrapper {
    width: 100%;
    max-width: 840px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;

    & .input-wrapper {
      width: calc((100% - 20px) / 2);
    }

    & .MuiFormControlLabel-root {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      width: 100%;
      font-size: 12px;
    }

    & .MuiFormControlLabel-label {
      font-size: 13px;
      color: #000 !important;
    }

    @media screen and (max-width: 530px) {
      & .MuiFormControl-root {
        flex-direction: column !important;
        margin-bottom: 10px;
      }
    }
  }

  & .actions {
    display: flex;
    gap: 20px;
    align-items: center;

    & .cta-btn {
      transition: all 0.3s ease;
    }
  }

  & .form-section {
    display: flex;
    gap: 20px;
    align-items: start;
    width: 100%;
  }
  & .form-group {
    width: 100%;
  }

  & .change-image {
    min-height: fit-content;
    height: fit-content;
    padding: 5px;
    display: block;
    cursor: pointer;
    /* color: #f05b2a !important; */
    font-size: 10px;
    background: #f05b2a1a;
    border-radius: 30px;
    padding: 5px 10px;
    -webkit-text-fill-color: #f05b2a !important;
  }

  & .image-wrapper {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    gap: 20px;
    width: 100%;
    padding-bottom: 27px;
    position: relative;

    & .image-loader {
      position: absolute;
      margin: auto 0;
      left: 40%;
      right: 50%;
      top: 29%;
    }

    & .change-image {
      border-radius: 30px;
      padding: 10px 20px;
    }

    & .info {
      margin-top: 10px;
      color: #64748b;
      font-size: 13px;
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
    }
  }
  & .Mui-disabled {
    color: #0f172a !important;
    margin-bottom: 0 !important;
  }

  @media screen and (max-width: 375px) {
    padding: 20px;
  }
`;
