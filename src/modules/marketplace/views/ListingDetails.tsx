import * as React from "react";
import { Lightbox } from "react-modal-image";

import { OrderStatus } from "@/components/feedback/OrderStatus";
import AppCustomModal from "@/components/modal/Modal";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import {
  MuiButton,
  MuiCardMedia,
  MuiCircularProgress,
  MuiIconButton,
  MuiInputLabel,
  MuiSelectChangeEvent,
  MuiTypography,
  styled,
} from "@/lib/index";
import { IconEdit, IconEye, IconPlay } from "@/lib/mui.lib.icons";
import {
  ActionTimeStatus,
  IActiveStatus,
} from "@/modules/settlements/components/OrderStatus";
import { IListingData, IStatus } from "@/types/globalTypes";
import { useIds } from "@/utils/hooks";
import { useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { CustomSwitch } from "@/components/input/CustomSwitch";
import useCachedDataStore from "@/config/store-config/lookup";
import ListingService from "@/services/listing-service";
import { formatCurrency, getIdName, getListingTimeRemaining } from "@/utils/helper-funcs";
import { toast } from "react-toastify";
import SimpleBar from "simplebar-react";
import { ActionConfirm } from "../components/ActionConfirm";
import { BidsView } from "../components/BidsView";
import { ReportedComments } from "../components/ReportedComments";
import { SellerInfo } from "../components/SellerInfo";

const options =
  ["Close listing"]?.map((x) => ({
    id: x,
    name: x,
  })) || [];

const trimText = (text: string) => {
  if (typeof text === "string") {
    return `... ${text?.substring(text.length - 8, text.length)}`;
  }
  return "";
};

export function ListingDetails() {
  const navigate = useNavigate();
  const { catalogueStatus, deliveryFeePickupMethod, listingType } =
    useCachedDataStore((state) => state.cache?.lookup);
  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { reportId } = useIds();
  const [action, setAction] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState("");
  const [show, setShow] = React.useState({
    video: false,
    image: false,
    action: false,
  });
  const trimmedId = trimText(reportId);

  const { data, isLoading, isError } = useQuery(
    ["listing-details", reportId],
    () =>
      ListingService.getDetails(reportId || "").then((res) => {
        const data = res.data?.result;
        return data;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: !!reportId,
      initialData: state as IListingData,
    }
  );




  const handleToggleShow = () => {
    setShow((prev) => ({ ...prev, action: !prev.action }));
  };

  const handleClose = () => {
    setShow((prev) => ({
      action: false,
      image: false,
      video: false,
    }));
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(["listing-details", reportId]);
    setAction("");
    handleClose();
  };

  const handleSetAction = (
    e: MuiSelectChangeEvent<any>,
    newValue: React.ReactNode
  ) => {
    const { value } = e.target;
    setAction(value);
    handleToggleShow();
  };

  const handleAction = (callback: () => void) => () => {
    ListingService.closeListing(reportId || 0)
      .then((res) => {
        handleRefresh?.();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      })
      .finally(() => {
        callback();
      });
  };

  const timeRemaining = getListingTimeRemaining(
    data?.creationTime ?? "",
    data?.durationInHours ?? 0
  );

  const handleSetImage = (image: string) => () => {
    setSelectedImage(image);
    setShow((prev) => ({ ...prev, image: true }));
  };

  const handleSetVideo = (video: string) => () => {
    setSelectedVideo(video);
    setShow((prev) => ({ ...prev, video: true }));
  };

  const handleCloseImageModal = () => {
    setShow((prev) => ({ ...prev, image: false }));
  };

  const videoFile = data?.catalogueAttachments?.filter((x) =>
    x?.cleansedName?.includes("mp4")
  );
  const imageFiles = data?.catalogueAttachments?.filter(
    (x) => !x?.cleansedName?.includes("mp4")
  );

  const handleEdit =  () => {
    navigate(`/app/marketplace/edit/${data?.id}`, {
      state: data,
    });
  };

  const handleToggleUserActiveStatus = async () => {
    setIsSubmitting(true);
   await  ListingService.toggleIsFeatured(reportId || 0)
      .then((res) => {
        handleRefresh?.();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      });
    setIsSubmitting(false);
  };



  const hideActions = data?.catalogueStatus === 1 && data;

  return (
    <PageContent>
      <div className="top-section">
        <div className="listing-heading">
          <MuiTypography variant="h3" className="title">
            Listing ID: <b style={{ color: "#1E75BB" }}>#{trimmedId}</b>
          </MuiTypography>
          {hideActions && (
            <CustomStyledSelect
              // value={value}
              onChange={handleSetAction}
              options={options || []}
              optionTitle="name"
              color="info"
              label="Action item"
              optionValue="id"
              style={{ width: "130px" }}
              className="actions"
              placeholder="Action Items"
            />
          )}

          <OrderStatus
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
            type={
              getIdName(
                data?.catalogueStatus ?? 1,
                catalogueStatus
              )?.toLowerCase() as IStatus
            }
          />
        </div>
      </div>
      <div className="listing">
        <div className="group-heading">
          <section className='info-section'>
          <MuiTypography variant="h4" className="heading">
            Listing Info
          </MuiTypography>
          <MuiIconButton
                          onClick={handleEdit}
                          className="edit-btn">
                          <IconEdit />
                        </MuiIconButton>
          </section>
          <section style={{display:'flex', alignItems:'center', gap:'20px'}} className="flex gap-2 items-center">
          <MuiInputLabel
              style={{ cursor: "pointer", display:'flex',
                alignItems:'center',
                flexWrap:'nowrap' }}
              onClick={handleToggleUserActiveStatus}>
              <span
                style={{
                  fontWeight: "700",
                  color: "#475367",
                  paddingRight: "10px",
                
                }}>
                Featured{" "}
              </span>
              {
                isSubmitting ? (
                  <MuiCircularProgress size={18} />
                ):(

                  <CustomSwitch
                    
                    checked={data?.isFeatured}
                    defaultChecked={data?.isFeatured}
                  />
                )
              }
            </MuiInputLabel>
          <MuiTypography variant="body2" className="timer">
            Auction
            <ActionTimeStatus
              type={
                timeRemaining > 0
                  ? (data?.catalogueStatusDescription?.toLowerCase() as IActiveStatus)
                  : "closed"
              }
              catelogueStatus={
                getIdName(
                  data?.catalogueStatus ?? 1,
                  catalogueStatus
                )?.toLowerCase() as IStatus
              }
              time={timeRemaining}
            />
          </MuiTypography>
          </section>
        </div>

        <div className="listing-info">
          <div className="left">
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Item name
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.name ?? "-"}
              </MuiTypography>
            </div>
          </div>
          <div className="right">
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Category
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.catalogueCategory?.name}
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Listing type
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {getIdName(data?.listingType ?? 1, listingType, " ") || ""}
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Condition
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.catalogueCondition?.name}
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Pickup method
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {getIdName(data?.pickupMethod ?? 1, deliveryFeePickupMethod) ||
                  ""} { data?.isPickupEnabled && '& Pickup'}
              </MuiTypography>
            </div>
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Listing Price
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
               {formatCurrency({amount:data?.price,})}
              </MuiTypography>
            </div>
          </div>
        </div>
        <div className="listing-info">
          <div className="left">
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Description
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.description}
              </MuiTypography>
            </div>
          </div>
          <div className="">
            <SimpleBar className="">
              <div className="image-wrapper">
                {videoFile?.map((file, index) => (
                  <div
                    className="listing-image"
                    key={file?.cleansedName || index}>
                    <MuiCardMedia
                      component="img"
                      src={imageFiles?.[0]?.url}
                      className="product"
                    />

                    <MuiButton
                      className="image-view"
                      onClick={handleSetVideo(file?.url)}>
                      <IconPlay className="play-icon" />
                    </MuiButton>
                  </div>
                ))}
                {imageFiles?.map((file, index) => (
                  <div
                    className="listing-image"
                    key={file?.cleansedName || index}>
                    <MuiCardMedia
                      component="img"
                      src={file?.url}
                      className="product"
                    />

                    <MuiButton
                      className="image-view"
                      onClick={handleSetImage(file?.url)}>
                      <IconEye />
                    </MuiButton>
                  </div>
                ))}
              </div>
            </SimpleBar>
          </div>
        </div>
      </div>
      <div className="bid-info">
        <div className="bid">
          <BidsView
            listingData={data || null}
            isLoading={isLoading}
            isError={isError}
    
            handleRefresh={handleRefresh}
          />
        </div>
        <div className="seller-info">
          <SellerInfo
            listingData={data || null}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
      <ReportedComments listingId={reportId} />
      <AppCustomModal
        closeOnOutsideClick={false}
        handleClose={handleToggleShow}
        open={show.action}
        alignTitle="left"
        title=""
        showClose>
        <ActionConfirm
          handleAction={handleAction}
          handleClose={handleToggleShow}
          action={action}
        />
      </AppCustomModal>
      {show.image && (
        <Lightbox
          small={selectedImage}
          large={selectedImage}
          alt="Listing image"
          onClose={handleCloseImageModal}
        />
      )}
      <AppCustomModal
        closeOnOutsideClick={false}
        handleClose={handleClose}
        open={show.video}
        alignTitle="left"
        title=""
        showClose>
        <StyledVideo>
          <MuiCardMedia
            src={selectedVideo}
            className="video"
            component="video"
            width={100}
            height={100}
            controls={true}
            autoPlay
          />
        </StyledVideo>
      </AppCustomModal>
    </PageContent>
  );
}
const StyledVideo = styled.section`
  width: 100%;

  width: calc(100vw - 80px);
  max-width: 800px;

  & .video {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    max-height: 600px;
  }
`;
const PageContent = styled.section`
  width: 100%;
  margin: auto;

  & .bid-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;

    & .seller-info {
      grid-column: 2/3;
    }
  }

  & .listing-image {
    display: flex;
    position: relative;

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

    & .play-icon {
      width: 30px;
      height: 30px;
      color: #ffffffbb;
    }
  }

  & .listing-heading {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    & .title {
      font-size: 20px;
      font-weight: bold;
      flex: 1;
    }

    & .actions {
      flex: 1;
      max-width: 130px;
      min-width: 130px;
      justify-content: end;

      & .MuiOutlinedInput-notchedOutline {
        border-color: #c6c6c6;
      }

      & .MuiOutlinedInput-input {
        background-color: #ffffffbb;
      }
    }
  }

     & .edit-btn {
    border-radius: 10px;
    background: #ffc5021a;
    color: #d78950;
    padding: 12px;


    svg {
      color: #d78950;
        width: 15px;
      height: 15px;
    }
  }


  & .info-section {
    display: flex;
    gap: 10px;
    align-items: center;
    
  }

  & .listing-info {
    display: grid;
    grid-template-columns: 40% calc(60% - 30px);
    gap: 30px;

    & .right {
      display: flex;
      gap: 40px;
      /* justify-content: space-between; */
    }

    & .image-wrapper {
      display: flex;
      gap: 10px;
      & .product {
        width: 90px;
        height: 90px;
        border-radius: 10px;
        border: 1px solid #e8e8e870;
      }
    }
  }

  & .timer {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    color: #64748b;
  }

  & .listing {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #f4f4f4;
    border-radius: 5px;
    padding: 20px 15px;

    & .group-heading {
      font-weight: 700;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      & .heading {
        font-weight: 600;
        font-size: 16px;
      }
    }
    & .group {
      & .header {
        color: #64748b;
        font-size: 13px;
      }

      & .body {
        display: flex;
        gap: 5px;
        align-items: center;
        color: #282828;
        font-weight: 500;

        & span {
          font-size: 5px;
        }
      }
    }
  }
`;
