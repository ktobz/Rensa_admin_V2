import * as React from "react";
import { useQuery, useQueryClient } from "react-query";

import AppCustomModal from "@/components/modal/Modal";
import { MuiBox, MuiIconButton, MuiTypography, styled } from "@/lib/index";
import {
  IconBankList,
  IconBike,
  IconClock,
  IconEdit,
  IconFee,
  IconOrder,
  IconWallet
} from "@/lib/mui.lib.icons";

import ConfigService from "@/services/config-service";
import {
  ICategory,
  IDeliverySettingsReq,
  IPagination,
} from "@/types/globalTypes";

import useCachedDataStore from "@/config/store-config/lookup";
import { BankList } from "@/modules/notification-center/components/BankList";
import { DeliverySettingsForm } from "@/modules/notification-center/components/DeliverySettingsForm";
import { PayoutSettingsForm } from "@/modules/notification-center/components/PayoutSettingsForm";
import { PickupLocation } from "@/modules/notification-center/components/PickupLocation";
import { ServiceFeeEntryForm } from "@/modules/notification-center/components/ServiceFeeEntryForm";
import { formatCurrency } from "@/utils/helper-funcs";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type IDeliverType = { [key: string]: any };

export function OperationSettingsView() {
  const queryClient = useQueryClient();
  const { deliveryFeePickupMethod } = useCachedDataStore(
    (state) => state?.cache?.lookup
  );

  const [show, setShow] = React.useState({
    service: false,
    delivery: false,
    payout: false,
    bank: false,
    pickup: false,
  });

  const [editData, setEditData] = React.useState<null | IDeliverySettingsReq>(
    null
  );
  const [method, setMethod] = React.useState<null | ICategory>(null);

  const handleToggleShow =
    (
      type: "delivery" | "service" | "payout" | "bank" | "pickup",
      data?: any,
      method?: ICategory
    ) =>
    () => {
      setShow((prev) => ({ ...prev, [type]: !prev[type] }));
      if (type === "delivery") {
        if (data) {
          setEditData(data);
        } else {
          setMethod(method || null);
        }
      }
    };

  const { data: deliverySetting, isLoading: deliveryIsLoading } = useQuery(
    ["delivery-fee"],
    () =>
      ConfigService.getDeliveryFeeSettings().then((res) => {
        const data = res.data?.result;
        const keyedData: IDeliverType = {};
        for (let i = 0; i < deliveryFeePickupMethod.length; i += 1) {
          const option = deliveryFeePickupMethod?.[i];
          keyedData[option?.name?.toLowerCase() || ""] = data?.find(
            (x) => x?.deliveryPickupMethod === option?.id
          );
        }
        return keyedData;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const { data: serviceSetting, isLoading: serviceIsLoading } = useQuery(
    ["service-fee"],
    () =>
      ConfigService.getServiceFeeSettings().then((res) => {
        const data = res.data?.result;
        return data?.[0] || {};
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const { data: payoutSetting, isLoading: payoutIsLoading } = useQuery(
    ["payout-setting"],
    () =>
      ConfigService.getPayoutSettings().then((res) => {
        const data = res.data?.result;
        return data?.[0] || {};
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const { data: offerSetting, isLoading: offerIsLoading } = useQuery(
    ["offer-setting"],
    () =>
      ConfigService.getOfferSettings().then((res) => {
        const data = res.data?.result;
        return data || {};
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const { data: termiiBalance, isLoading: termiiBalanceIsLoading } = useQuery(
    ["termii-balance"],
    () =>
      ConfigService.getTermiBalance().then((res) => {
        const data = res.data?.result;
        return data;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleCloseModal = () => {
    setShow({
      delivery: false,
      service: false,
      payout: false,
      bank: false,
      pickup: false,
    });
    setEditData(null);
    setMethod(null);
  };

  const handleRefreshService = () => {
    queryClient.invalidateQueries(["service-fee"]);
    handleCloseModal();
  };

  const handleRefreshDelivery = () => {
    queryClient.invalidateQueries(["delivery-fee"]);
    handleCloseModal();
  };
  const handleRefreshPayout = () => {
    queryClient.invalidateQueries(["payout-setting"]);
    queryClient.invalidateQueries(["offer-setting"]);
    handleCloseModal();
  };

  return (
    <StyledPage>
      <div className="section">
        <div className="tab-section">
          <div className="top-section">
            <MuiTypography variant="body2" className="heading">
              Pricing
            </MuiTypography>
          </div>
        </div>

        <div className="settings-group">
          <IconFee className="icon" />
          <div className="rows">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Service fees
              </MuiTypography>
              <MuiBox className="action-group">
                <MuiIconButton
                  color="warning"
                  onClick={handleToggleShow("service")}
                  className={`action-btn edit-btn btn `}>
                  <IconEdit />
                </MuiIconButton>
              </MuiBox>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
                Buyer service fee
              </MuiTypography>
              <div className="price-group">
                <MuiTypography variant="body1" className="value">
                  {serviceSetting?.buyerServiceFee ?? 0}%
                </MuiTypography>
                <MuiTypography variant="body1" className="value">
                  {serviceSetting?.buyerServiceFeeCapAmount
                    ? `₦${formatCurrency({
                        amount: serviceSetting?.buyerServiceFeeCapAmount || 0,
                        style: "decimal",
                      })}`
                    : "-"}
                </MuiTypography>
              </div>
            </div>
            <div className="data-row">
              <MuiTypography variant="body1" className="label">
                Seller service fee
              </MuiTypography>

              <div className="price-group">
                <MuiTypography variant="body1" className="value">
                  {serviceSetting?.sellerServiceFee ?? 0}%
                </MuiTypography>
                <MuiTypography variant="body1" className="value">
                  {serviceSetting?.sellerServiceFeeCapAmount
                    ? `₦${formatCurrency({
                        amount: serviceSetting?.sellerServiceFeeCapAmount || 0,
                        style: "decimal",
                      })}`
                    : "-"}
                </MuiTypography>
              </div>
            </div>
          </div>
        </div>
        <div className="settings-group">
          <IconOrder className="icon" />
          <div className="rows">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Van Delivery fees
              </MuiTypography>
              <MuiBox className="action-group">
                <MuiIconButton
                  color="warning"
                  onClick={handleToggleShow(
                    "delivery",
                    deliverySetting?.van,
                    deliveryFeePickupMethod[1]
                  )}
                  className={`action-btn edit-btn btn `}>
                  <IconEdit />
                </MuiIconButton>
              </MuiBox>
            </div>

            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
                Van Base fee
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: deliverySetting?.van?.baseFee || 0,
                  style: "decimal",
                })}
              </MuiTypography>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
                Van fee per km
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: deliverySetting?.van?.pricePerKm || 0,
                  style: "decimal",
                })}
              </MuiTypography>
            </div>
          </div>
        </div>
        <div className="settings-group">
          <IconBike className="icon" />
          <div className="rows">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Bike Delivery fees
              </MuiTypography>
              <MuiBox className="action-group">
                <MuiIconButton
                  color="warning"
                  onClick={handleToggleShow(
                    "delivery",
                    deliverySetting?.bike,
                    deliveryFeePickupMethod[0]
                  )}
                  className={`action-btn edit-btn btn `}>
                  <IconEdit />
                </MuiIconButton>
              </MuiBox>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
                Bike Base fee
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: deliverySetting?.bike?.baseFee || 0,
                  style: "decimal",
                })}
              </MuiTypography>
            </div>

            <div className="data-row ">
              <MuiTypography variant="body1" className="label">
                Bike fee per km
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: deliverySetting?.bike?.pricePerKm || 0,
                  style: "decimal",
                })}
              </MuiTypography>
            </div>
          </div>
        </div>

        
      </div>

      <div className="section">
        <div className="tab-section">
          <div className="top-section">
            <MuiTypography variant="body2" className="heading">
              Others
            </MuiTypography>
          </div>
        </div>

        <div className="settings-group">
          <IconClock className="icon" />
          <div className="rows ">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Payout
              </MuiTypography>
              <MuiBox className="action-group">
                <MuiIconButton
                  color="warning"
                  onClick={handleToggleShow("payout")}
                  className={`action-btn edit-btn btn `}>
                  <IconEdit />
                </MuiIconButton>
              </MuiBox>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
              Payout: Pay Seller After
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                {payoutSetting?.waitTimeInHours || 0} hours
              </MuiTypography>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
              Pending Offer Expiration
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                {offerSetting?.offerExpirationInHours || 0} hours
              </MuiTypography>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
              Pending Offer Reminder Interval
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                {offerSetting?.offerReminderIntervalInMinutes || 0} mins
              </MuiTypography>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
              Pending Checkout Reminder
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                {offerSetting?.pendingCheckoutReminderInMinutes || 0} mins
              </MuiTypography>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
              Max. Checkout Reminder
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                {offerSetting?.maxCheckoutReminders || 0} times
              </MuiTypography>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <IconWallet className="icon" />
          <div className="rows border">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Third-party balance
              </MuiTypography>
            </div>
            <div className="data-row">
              <MuiTypography variant="body1" className="label">
                Termii balance
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: termiiBalance?.balance || 0,
                  style: "decimal",
                })}
              </MuiTypography>
            </div>
          </div>
        </div>
        {/* <div className="settings-group">
          <IconWallet className="icon" />
          <div className="rows border">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Approved Pickup Location
              </MuiTypography>
              <MuiBox className="action-group">
                <MuiIconButton
                  color="info"
                  onClick={handleToggleShow("pickup")}
                  className={`action-btn visible-btn btn `}>
                  <IconVisibility />
                </MuiIconButton>
              </MuiBox>
            </div>
            <div className="data-row">
              <MuiTypography variant="body1" className="label">
                Manage approved pickup locations for Pro-sellers
              </MuiTypography>
            </div>
          </div>
        </div> */}
        <div className="settings-group">
          <IconBankList className="icon" />
          <div className="rows">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Bank list
              </MuiTypography>
              <MuiBox className="action-group">
                <MuiIconButton
                  color="warning"
                  onClick={handleToggleShow("bank")}
                  className={`action-btn edit-btn btn `}>
                  <IconEdit />
                </MuiIconButton>
              </MuiBox>
            </div>
            <div className="data-row">
              <MuiTypography variant="body1" className="label">
                Update bank list
              </MuiTypography>
            </div>
          </div>
        </div>
      </div>

      <AppCustomModal
        handleClose={handleToggleShow("service")}
        open={show.service}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={"Service fees"}
        showClose>
        <ServiceFeeEntryForm
          initData={serviceSetting}
          refreshQuery={handleRefreshService}
          handleClose={handleCloseModal}
        />
      </AppCustomModal>
      <AppCustomModal
        handleClose={handleCloseModal}
        open={show.delivery}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={`${
          editData?.deliveryPickupMethod === 2 || method?.id === 2
            ? "Van"
            : "Bike"
        } Delivery Fees`}
        showClose>
        <DeliverySettingsForm
          initData={editData}
          refreshQuery={handleRefreshDelivery}
          handleClose={handleCloseModal}
          method={method}
        />
      </AppCustomModal>

      <AppCustomModal
        handleClose={handleToggleShow("payout")}
        open={show.payout}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={"Timer Config"}
        showClose>
        <PayoutSettingsForm
          initData={{...payoutSetting, ...offerSetting}}
          refreshQuery={handleRefreshPayout}
          handleClose={handleCloseModal}
        />
      </AppCustomModal>

      <AppCustomModal
        handleClose={handleToggleShow("pickup")}
        open={show.pickup}
        alignTitle="left"
        closeOnOutsideClick={false}
        title="Approved Pickup Location"
        showClose>
        <PickupLocation />
      </AppCustomModal>

      <AppCustomModal
        handleClose={handleToggleShow("bank")}
        open={show.bank}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={"Bank Lists"}
        showClose>
        <BankList handleClose={handleCloseModal} />
      </AppCustomModal>
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;
  padding: 0 10px;
  display: flex;
  gap: 20px;
  flex-direction: column;

  & .section {
  }

  & .visible-btn {
    background-color: #e8f1f8;
    border-radius: 10px;
    color: #1e75bb;
    padding: 12px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  & .action-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  & .top-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    & .heading {
      font-weight: 600;
      color: #000;
      font-size: 20px;
      font-family: "Helvetica";
    }
  }

  & .tabs {
    /* width: 50%; */
    flex: 1;
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 25px 0;
    flex-wrap: wrap;
    gap: 20px;

    & .action-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      justify-content: end;
    }
  }

  & .btn {
    height: 36px;
    font-size: 12px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  & .action-btn {
    background-color: #e8f1f8;
    border-radius: 10px;
    padding: 12px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  & .edit-btn {
    background: #ffc5021a;
    color: #d78950;

    svg {
      color: #d78950;
    }
  }

  & .rows-wrapper {
    padding: 10px;
  }

  & .rows {
    flex: 1;
  }
  & .settings-group {
    display: flex;
    gap: 20px;
    align-items: start;
    width: 100%;
    margin-bottom: 20px;

    & .icon {
      width: 30px;
      height: 30px;
    }

    & .heading {
      width: 100%;
      display: flex;
      gap: 20px;
      align-items: center;
      justify-content: space-between;

      & .group-heading {
        color: #000;
        font-weight: 500;
        font-size: 15px;
      }
    }
  }

  & .data-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: center;
    padding: 10px 0;
    width: 100%;

    & .label {
      color: #64748b;
    }

    & .value {
      color: #05a357;
      background: #9bdf461a;
      padding: 5px 10px;
      border-radius: 30px;
      font-weight: 600;
    }

    & .price-group {
      display: flex;
      align-items: center;
      gap: 16px;
      justify-items: flex-end;
    }
  }

  & .visible-btn {
    background-color: #e8f1f8;
    border-radius: 10px;
    color: #1e75bb;
    padding: 12px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  & .border {
    border-bottom: 1px solid #eeeeee;
  }
`;
