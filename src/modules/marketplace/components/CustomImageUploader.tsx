import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { toast } from "react-toastify";
import { Lightbox } from "react-modal-image";

import {
  MuiButton,
  MuiIconButton,
  MuiTypography,
  IconAdd,
  IconDelete,
  IconEdit,
  styled,
  IconEye,
  IconClose,
  IconPlus,
} from "@/lib/index";
import AppCustomModal from "@/components/modal/Modal";

interface IUploaderProps {
  getFleList: (fileList: File[] | File, photosPreview: any[]) => any;
  // variant: "profile-image" | "photo-list";
  multiple?: boolean;
  initialFileData?: any[];
  initialPreviewData?: any[];
  maxPhoto?: number;
  label?: string;
  instruction?: string;
  required?: boolean;
  name: string;
  handleReset?: boolean;
  buttonHeight?: string;
  buttonWidth?: string;
  iconSize?: string;
  aspect?: number;
  generateName?: boolean;
  readOnly?: boolean;
}

export default function CustomImageUploader(props: IUploaderProps) {
  const {
    getFleList,
    multiple = false,
    initialPreviewData = [],
    initialFileData = [],
    maxPhoto = 1,
    instruction = "",
    label = "",
    required,
    name,
    handleReset = false,
    buttonHeight,
    buttonWidth,
    iconSize,
    // aspect = 3 / 4,
    generateName = false,
    readOnly = false,
  } = props;

  const uploadRef = React.useRef<HTMLInputElement>(null)!;

  const [fileList, setFileList] = React.useState<File[]>(initialFileData);
  const [, setFile] = React.useState<File[] | undefined>(initialFileData);

  const [newPhoto, setNewPhoto] = React.useState("");

  const [croppedImages, setCroppedImages] =
    React.useState<string[]>(initialPreviewData);
  const [croppedImage, setCroppedImage] = React.useState(initialPreviewData);

  const [currentPhotoName, setCurrentPhotoName] = React.useState("");
  const [showCropper, setShowCropper] = React.useState(false);
  const [previewImageModal, setPreviewImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState("");

  const [photoList, setPhotoList] = React.useState<string[]>([]);

  const photoValidation = {
    size: { maxSize: 5000000, errorMessage: "File too large" },
    type: { format: "image/", errorMessage: "File type not supported" },
  };

  const [cropper, setCropper] = useState<any>();

  const onChange = (e: any) => {
    e.preventDefault();
    let files;

    const file = e.target?.files[0];
    const fileType = file?.type;
    const fileSize = file?.size;

    if (photoValidation.size.maxSize < fileSize) {
      return toast.error("Image Size error");
    } else if (!fileType.includes(photoValidation.type.format)) {
      return toast.error("Image type error");
    } else {
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
        // setImage(reader.result as any);
        if (multiple) {
          const newList = [...photoList];
          newList.unshift(reader.result as any);
          setPhotoList(newList);
        }

        setCurrentPhotoName(file.name);
        setNewPhoto(reader.result as any);
        setShowCropper(true);
        if (uploadRef.current) {
          uploadRef.current.value = "";
        }
      };

      reader.readAsDataURL(files[0]);
    }
  };

  const handleChangePhoto = () => {
    if (uploadRef) {
      uploadRef?.current?.click();
      // console.log(uploadRef);
    }
  };

  const handleClose = () => {
    setShowCropper(false);
  };

  const handleHideCropper = async () => {
    // Update the cropped Images List

    let file = await fetch(newPhoto)
      .then((r) => r.blob())
      .then(
        (blobFile) =>
          new File(
            [blobFile],
            `${generateName ? name + "_" : currentPhotoName}`,
            {
              type: "image/jpeg",
            }
          )
      );

    if (typeof cropper !== "undefined") {
      const dataURL = cropper.getCroppedCanvas().toDataURL();
      // setCropData(cropper.getCroppedCanvas().toDataURL());
      // alert(cropper.getCroppedCanvas().toDataURL());

      if (multiple) {
        const newList = [...croppedImages];
        newList.unshift(dataURL);
        setCroppedImages(newList);

        //update the Files List
        const newFiles = [...fileList];
        newFiles.unshift(file);
        setFileList(newFiles);
        getFleList(newFiles, newList);
      } else {
        // console.log(currentPhoto, multiple, "SET IMAGE", currentPhoto, file);
        setCroppedImage([dataURL]);
        getFleList(file, [dataURL]);
        setFile([file]);

        // URL.revokeObjectURL(newPhoto); //remove previous
      }

      setShowCropper(false);
    }

    // URL.revokeObjectURL(newPhoto); //remove previous
  };

  const handleDeletePhoto = (index: number) => () => {
    const newCroppedList = [...croppedImages];
    const newFileList = [...fileList];

    newCroppedList.splice(index, 1);
    newFileList.splice(index, 1);

    setCroppedImages(newCroppedList);
    setFileList(newFileList);
    getFleList(newFileList, newCroppedList);
  };

  const handleSetImage = (image: string) => () => {
    setSelectedImage(image);
    setPreviewImageModal((prev) => !prev);
  };

  const handleCloseImageModal = () => {
    setPreviewImageModal((prev) => !prev);
  };

  React.useEffect(() => {
    if (handleReset && initialPreviewData.length < 1) {
      // handleReset(lists:)
      setCroppedImages([]);
      setFileList([]);
    }
  }, [handleReset, initialPreviewData]);

  return (
    <StyledWrapper
      buttonHeight={buttonHeight || "120px"}
      buttonWidth={buttonWidth || "120px"}
      iconSize={iconSize || "unset"}>
      <div className={name + "image-upload-section"}>
        <MuiTypography variant="body1" className="label">
          {label} {required && <span style={{ color: "tomato" }}>*</span>}
        </MuiTypography>
        {instruction && (
          <MuiTypography variant="subtitle2" className="subtitle">
            {" "}
            {instruction}
          </MuiTypography>
        )}
        <div className="images-and-btn-section">
          {multiple ? (
            <>
              {croppedImages.length > 0 &&
                croppedImages.map((photo, index) => (
                  <div
                    key={index}
                    className="image-wrapper"
                    style={{
                      width: "120px",
                      height: "120px",
                      backgroundImage: `url(${photo})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      borderRadius: "10px",
                      backgroundPosition: "center center",
                      border: "1px solid #F0F0F0 ",
                    }}>
                    {!readOnly && (
                      <MuiIconButton
                        aria-label="Delete photo"
                        className="close-btn"
                        onClick={handleDeletePhoto(index)}>
                        <IconClose />
                      </MuiIconButton>
                    )}
                    <MuiButton
                      className="image-view"
                      onClick={handleSetImage(photo)}>
                      <IconEye />
                    </MuiButton>
                  </div>
                ))}
              {croppedImages.length < maxPhoto && !readOnly && (
                <label
                  htmlFor={name + "-upload-button"}
                  className="add-image-button">
                  <input
                    type="file"
                    accept="image/*"
                    id={name + "-upload-button"}
                    onChange={onChange}
                    ref={uploadRef}
                  />

                  <span className="button-content">
                    <IconPlus htmlColor="#380719" className="upload__icon" />
                    <span>Add Photo</span>
                  </span>
                </label>
              )}
            </>
          ) : (
            <>
              <div
                className="image-wrapper"
                style={{
                  width: buttonWidth || "120px",
                  display: `${croppedImage.length > 0 ? "unset" : "none"}`,
                  height: buttonHeight || "120px",
                  backgroundImage: `url(${croppedImage[0]})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  borderRadius: "10px",
                  backgroundPosition: "center center",
                  border: "1px solid #F0F0F0 ",
                }}>
                <MuiIconButton
                  aria-label="change image"
                  style={{
                    color: "green",
                    backgroundColor: "#fff",
                    padding: "5px",
                    margin: "5px",
                  }}
                  onClick={handleChangePhoto}>
                  <IconEdit />
                </MuiIconButton>
              </div>
              <label
                style={{
                  visibility: `${
                    croppedImage.length > 0 ? "hidden" : "visible"
                  }`,
                }}
                htmlFor={name + "-upload-button"}
                className="add-image-button">
                <input
                  type="file"
                  accept="image/*"
                  id={name + "-upload-button"}
                  ref={uploadRef}
                  onChange={onChange}
                />

                <span className="button-content">
                  <IconPlus htmlColor="#380719" className="upload__icon" />
                  <span>Upload Photo</span>
                </span>
              </label>
            </>
          )}
        </div>
      </div>
      {showCropper && !readOnly ? (
        <AppCustomModal
          closeOnOutsideClick={false}
          showClose
          title="Crop Image"
          handleClose={handleClose}
          open={showCropper}>
          <div
            id={name}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              position: "relative",
              width: "calc(100vw - 80px)",
              maxWidth: "600px",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Cropper
              style={{ height: "100%", width: "100%" }}
              zoomTo={0}
              // initialAspectRatio={1}
              // preview=".img-preview"
              src={newPhoto}
              // viewMode={1}
              // minCropBoxHeight={10}
              // minCropBoxWidth={10}
              // background={false}
              // responsive={true}
              // autoCropArea={1}
              // checkOrientation={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              // guides={true}
            />

            <MuiButton
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disableElevation
              onClick={handleHideCropper}>
              Crop
            </MuiButton>
          </div>
        </AppCustomModal>
      ) : null}

      {previewImageModal && (
        <Lightbox
          small={selectedImage}
          large={selectedImage}
          alt="Listing image"
          onClose={handleCloseImageModal}
        />
      )}
    </StyledWrapper>
  );
}

interface ICustomProps {
  buttonWidth: string;
  buttonHeight: string;
  iconSize: string;
}

const StyledWrapper = styled.div<ICustomProps>`
  width: 100%;
  margin-bottom: 25px;
  display: block;

  & .subtitle {
    color: #98a2b3;
    margin-bottom: 10px;
  }

  & .label {
    color: #000;
    font-weight: 700;
  }

  & .images-and-btn-section {
    display: flex;
    gap: 10px;
    flex-direction: row-reverse;
    width: 100%;
    justify-content: start;
  }

  & .image-wrapper {
    position: relative;

    & .close-btn {
      position: absolute;

      z-index: 2;
      padding: 0;
      top: -10px;
      right: -10px;

      svg {
        width: 30px;
        height: 30px;
        background: #fff;
        border-radius: 50%;
      }
      path {
        fill: #f53139;
      }
    }
  }

  & .image-view {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #0000005f;
  }

  .add-image-button {
    width: ${(props) => props.buttonWidth};
    height: ${(props) => props.buttonHeight};
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    overflow: hidden;
    cursor: pointer;
    & input[type="file"] {
      display: none;
    }
  }
  .button-content {
    /* display: none; */
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #b1b5c3;
    font-size: 10px;
    /* border: 1px solid #f0f0f0; */
    gap: 5px;
    .upload__icon {
      font-size: 30px;
    }
  }
`;
