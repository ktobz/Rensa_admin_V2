import * as React from "react";
import { useQuery, useQueryClient } from "react-query";

import { MuiBox, MuiIconButton, MuiTypography, styled } from "@/lib/index";
import {
  IconEdit,
  IconOrder,
  IconFee,
  IconClock,
  IconWallet,
} from "@/lib/mui.lib.icons";
import VendgramCustomModal from "@/components/modal/Modal";

import {
  IDeliverySettingsData,
  IPagination,
  IServiceFeeData,
} from "@/types/globalTypes";
import ConfigService from "@/services/config-service";
import { ServiceFeeEntryForm } from "@/modules/branch-manager copy/components/ServiceFeeEntryForm";
import { DeliverySettingsForm } from "@/modules/branch-manager copy/components/DeliverySettingsForm";
import { formatCurrency } from "@/utils/helper-funcs";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

export function OperationSettingsView() {
  const queryClient = useQueryClient();

  const [show, setShow] = React.useState({
    service: false,
    delivery: false,
  });

  const [editData, setEditData] = React.useState<null | any>(null);

  const handleToggleShow = (type: "delivery" | "service") => () => {
    setShow((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const { data: deliverySetting, isLoading: deliveryIsLoading } = useQuery(
    ["delivery-fee"],
    () =>
      ConfigService.getDeliveryFeeSettings().then((res) => {
        const data = res.data?.data;
        return data as IDeliverySettingsData;
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
        const data = res.data?.data;
        return data as IServiceFeeData;
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
    });
    setEditData(undefined);
  };

  const handleRefreshService = () => {
    queryClient.invalidateQueries(["service-fee"]);
    handleCloseModal();
  };

  const handleRefreshDelivery = () => {
    queryClient.invalidateQueries(["delivery-fee"]);
    handleCloseModal();
  };

  return (
    <StyledPage>
      <div className="section">
        <div className="tab-section">
          <div className="top-section">
            <MuiTypography variant="body2" className="heading">
              Operations Settings
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
              <MuiTypography variant="body1" className="value">
                ₦{serviceSetting?.percentage || 0}
              </MuiTypography>
            </div>
            <div className="data-row">
              <MuiTypography variant="body1" className="label">
                Seller service fee
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: serviceSetting?.cap_price || 0,
                  style: "decimal",
                })}
              </MuiTypography>
            </div>
          </div>
        </div>
        <div className="settings-group">
          <IconOrder className="icon" />
          <div className="rows">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Delivery fees
              </MuiTypography>
              <MuiBox className="action-group">
                <MuiIconButton
                  color="warning"
                  onClick={handleToggleShow("delivery")}
                  className={`action-btn edit-btn btn `}>
                  <IconEdit />
                </MuiIconButton>
              </MuiBox>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
                Bike fee
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: deliverySetting?.base_fare || 0,
                  style: "decimal",
                })}
              </MuiTypography>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
                Van fee
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: deliverySetting?.base_fare || 0,
                  style: "decimal",
                })}
              </MuiTypography>
            </div>
            <div className="data-row border">
              <MuiTypography variant="body1" className="label">
                Base fare
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: deliverySetting?.base_fare || 0,
                  style: "decimal",
                })}
              </MuiTypography>
            </div>
            <div className="data-row ">
              <MuiTypography variant="body1" className="label">
                Per kilometer
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: deliverySetting?.per_kilometer || 0,
                  style: "decimal",
                })}
                /km
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
          <div className="rows">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Payout
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
                Pay seller after
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                {serviceSetting?.percentage || 0} hours
              </MuiTypography>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <IconWallet className="icon" />
          <div className="rows">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Termii
              </MuiTypography>
            </div>
            <div className="data-row">
              <MuiTypography variant="body1" className="label">
                Current balance
              </MuiTypography>
              <MuiTypography variant="body1" className="value">
                ₦
                {formatCurrency({
                  amount: deliverySetting?.base_fare || 0,
                  style: "decimal",
                })}
              </MuiTypography>
            </div>
          </div>
        </div>
      </div>

      <VendgramCustomModal
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
      </VendgramCustomModal>
      <VendgramCustomModal
        handleClose={handleToggleShow("delivery")}
        open={show.delivery}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={"Delivery fees"}
        showClose>
        <DeliverySettingsForm
          initData={deliverySetting}
          refreshQuery={handleRefreshDelivery}
          handleClose={handleCloseModal}
        />
      </VendgramCustomModal>
      {/* <VendgramCustomModal
        handleClose={handleToggleShow("delivery")}
        open={show.delivery}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={"Delivery fees"}
        showClose>
        <DeliverySettingsForm
          initData={deliverySetting}
          refreshQuery={handleRefreshDelivery}
          handleClose={handleCloseModal}
        />
      </VendgramCustomModal> */}
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
  }

  & .border {
    border-bottom: 1px solid #eeeeee;
  }
`;
