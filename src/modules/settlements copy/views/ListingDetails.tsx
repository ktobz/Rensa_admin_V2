import * as React from "react";
import { format } from "date-fns";

import {
  MuiButton,
  MuiCardMedia,
  MuiIconButton,
  MuiSelectChangeEvent,
  MuiTypography,
  styled,
} from "@/lib/index";
import { useLocation, useParams } from "react-router-dom";
import {
  IconBike,
  IconBranches,
  IconCopyFilled,
  IconCreditCard,
  IconEarning,
  IconLocation,
  IconPetrol,
  IconShipping,
  IconTicket,
} from "@/lib/mui.lib.icons";
import { useQuery, useQueryClient } from "react-query";
import OrderService from "@/services/order-service";
import { IListingData, IOrderDetails, IStatus } from "@/types/globalTypes";
import { UserDetailCard } from "@/components/card/UserCard";
import VendgramCustomModal from "@/components/modal/Modal";
import { OrderStatus } from "@/components/feedback/OrderStatus";
import { SettlementStatus } from "@/modules/settlements/components/OrderStatus";
import { useIds } from "@/utils/hooks";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import { ActionTimeStatus } from "../components/OrderStatus";
import SimpleBar from "simplebar-react";
import { ReportedComments } from "../components/ReportedComments";
import { SellerInfo } from "../components/SellerInfo";
import { BidsView } from "../components/BidsView";
import { ActionConfirm } from "../components/ActionConfirm";
import ListingService from "@/services/listing-service";
import { getIdName } from "@/utils/helper-funcs";
import useCachedDataStore from "@/config/store-config/lookup";

const options =
  ["Place On-hold", "Close listing"]?.map((x) => ({
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
  const { catalogueStatus, deliveryFeePickupMethod } = useCachedDataStore(
    (state) => state.cache?.lookup
  );
  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { reportId } = useIds();
  const [action, setAction] = React.useState("");
  const [show, setShow] = React.useState(false);
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
    setShow((prev) => !prev);
  };
  const handleRefresh = () => {
    queryClient.invalidateQueries(["order-details"]);
    setAction("");
    setShow(false);
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
    // ListingService.delete(ids?.[0] || 0)
    //   .then((res) => {
    //     handleRefresh?.();
    //     toast.success(res.data?.message || "");
    //   })
    //   .catch((err) => {
    //     toast.error(err?.response?.data?.message || "");
    //   })
    //   .finally(() => {
    //     callback();
    //   });
  };

  return (
    <PageContent>
      <div className="top-section">
        <div className="listing-heading">
          <MuiTypography variant="h3" className="title">
            Listing ID: <b style={{ color: "#1E75BB" }}>#{trimmedId}</b>
          </MuiTypography>
          <CustomStyledSelect
            // value={value}
            onChange={handleSetAction}
            options={options || []}
            optionTitle="name"
            label="Action item"
            optionValue="id"
            style={{ width: "130px" }}
            className="actions"
            placeholder="Action Items"
          />
          <SettlementStatus type="active" />
        </div>
      </div>
      <div className="listing">
        <div className="group-heading">
          <MuiTypography variant="h4" className="heading">
            Listing Info
          </MuiTypography>
          <MuiTypography variant="body2" className="timer">
            Auction
            {data?.catalogueStatus === 1 ? (
              <ActionTimeStatus type="error" time={300} />
            ) : (
              <OrderStatus
                type={
                  getIdName(
                    data?.catalogueStatus || 1,
                    catalogueStatus
                  )?.toLowerCase() as IStatus
                }
              />
            )}
          </MuiTypography>
        </div>

        <div className="listing-info">
          <div className="left">
            <div className="group">
              <MuiTypography variant="body1" className="header">
                Item name
              </MuiTypography>
              <MuiTypography variant="body2" className="body">
                {data?.name || "-"}
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
                {getIdName(data?.pickupMethod || 1, deliveryFeePickupMethod) ||
                  ""}
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
                {data?.catalogueAttachments?.map((file, index) => (
                  <MuiCardMedia
                    key={index}
                    component="img"
                    src={file?.url}
                    className="product"
                  />
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

      <VendgramCustomModal
        closeOnOutsideClick={false}
        handleClose={handleToggleShow}
        open={show}
        alignTitle="left"
        title=""
        showClose>
        <ActionConfirm
          handleAction={handleAction}
          handleClose={handleToggleShow}
          action={action}
        />
      </VendgramCustomModal>
    </PageContent>
  );
}

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
        border-color: #fb651e;
      }

      & .MuiOutlinedInput-input {
        background-color: #fff9f6;
      }
    }
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
