import * as React from "react";
import {
  styled,
  MuiTypography,
  MuiButton,
  IconOil,
  IconLPG,
  IconDiesel,
  IconPetrol,
} from "@/lib/index";

import { IProductData } from "../types";
import { CustomSwitch } from "@/components/input/CustomSwitch";
import CustomTabs from "@/components/other/CustomTabs";
import CustomTab from "@/components/other/CustomTab";
import { useQuery, useQueryClient } from "react-query";
import BranchService from "@/services/branches.service";
import CustomTableSkeleton from "@/components/skeleton/CustomTableSkeleton";
import VendgramCustomModal from "@/components/modal/Modal";

import { toast } from "react-toastify";
import LineListSkeleton from "@/components/skeleton/LineListSkeleton";
import { ProductVisibilityConfirm } from "@/modules/products/components/ProductVisibilityConfirm";

type IProps = {
  handleClose: () => void;
  branchId: number;
  partnerId: string;
};

export const BranchInventory = ({
  handleClose,
  branchId,
  partnerId,
}: IProps) => {
  const queryClient = useQueryClient();
  const [current, setCurrent] = React.useState(() => {
    return 1;
  });
  const [show, setShow] = React.useState({
    updateStatus: false,
  });
  const [updateData, setUpdateData] = React.useState<any[]>([]);

  const handleChangeIndex = (index: number) => () => {
    setCurrent(index);
  };

  const { data, isLoading } = useQuery(
    ["all-inventory", current, branchId, partnerId],
    () =>
      BranchService.inventory(partnerId, {
        branchId,
        productCat: current,
      }).then((res) => {
        const data = res.data?.data;
        return data as any[];
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleCloseModal = () => {
    setShow((prev) => ({
      updateStatus: false,
    }));
  };

  const handleToggleShow = (name: "updateStatus") => () => {
    setShow((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSetUpdateStatusData = (data: IProductData) => () => {
    setUpdateData(() => [data]);
    setShow((prev) => ({ ...prev, updateStatus: true }));
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      "all-inventory",
      current,
      branchId,
      partnerId,
    ]);
    handleCloseModal();
  };

  const handleUpdateProductStatus = (callback: () => void) => () => {
    const ids = updateData.map((data) => data?.id);
    // BranchService.changeBranchProductVisibility(ids?.[0] || 0)
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
    <StyledSection>
      <CustomTabs variant="scrollable" value={current || 0} className="tabs">
        <CustomTab
          onClick={handleChangeIndex(1)}
          value={1}
          label="Petrol"
          current={current}
          icon={<IconPetrol />}
          variant="primary"
        />
        <CustomTab
          onClick={handleChangeIndex(2)}
          value={2}
          label="Diesel"
          current={current}
          icon={<IconDiesel />}
          variant="primary"
        />
        <CustomTab
          onClick={handleChangeIndex(3)}
          value={3}
          label="LPG"
          current={current}
          icon={<IconLPG />}
          variant="primary"
        />
        <CustomTab
          onClick={handleChangeIndex(4)}
          value={4}
          label="Oils & Lubricants"
          current={current}
          icon={<IconOil />}
          variant="primary"
        />
      </CustomTabs>

      <div className="inventory">
        {data &&
          !isLoading &&
          data?.map((row, index) => (
            <MuiTypography key={index} variant="body2" className="item">
              <span>
                {row?.product?.product_category?.name} -{" "}
                {row?.product?.sale_quantity} LTR
              </span>{" "}
              <CustomSwitch
                color="primary"
                defaultChecked={row?.publish}
                value={row?.publish}
                checked={row?.publish}
                onClick={handleSetUpdateStatusData({
                  ...row?.product,
                  id: row?.id,
                })}
              />
            </MuiTypography>
          ))}
        {!data && isLoading && <LineListSkeleton rows={8} />}
      </div>

      <div className="action-group">
        <MuiButton
          type="button"
          variant="contained"
          onClick={handleClose}
          className="secondary-btn btn">
          Cancel
        </MuiButton>
        <MuiButton
          type="button"
          color="primary"
          variant="contained"
          className="primary-btn btn">
          Save Changes
        </MuiButton>
      </div>

      <VendgramCustomModal
        handleClose={handleToggleShow("updateStatus")}
        open={show.updateStatus}
        showClose>
        <ProductVisibilityConfirm
          data={updateData}
          handleUpdate={handleUpdateProductStatus}
          handleClose={handleToggleShow("updateStatus")}
          action="inactive"
        />
      </VendgramCustomModal>
    </StyledSection>
  );
};

const StyledSection = styled.section`
  width: calc(100vw - 40px);
  max-width: 450px;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  & .delete-icon {
    width: 130px;
    height: 130px;
  }

  & .heading {
    font-weight: 700;
    font-size: 18px;
  }

  & .product-name {
    color: #64748b;
    font-size: 12px;
  }

  & .action-group {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;

    & .secondary-btn {
      background: #fbfbfb;
      color: #363636;
    }
  }

  & .inventory {
    width: 100%;
    max-width: 430px;
    display: flex;
    gap: 6px;
    align-items: center;
    flex-direction: column;
    min-height: 300px;
  }

  & .item {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    background-color: #fbfbfb;
    border-radius: 5px;
  }

  & .branch {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;

    & .branch-name {
      background-color: #e8f1f8;
      padding: 15px 20px;
      border-radius: 30px;
      flex: 1;
      max-width: 350px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    & .img-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 51px;
      height: 51px;
      background-color: #f05b2a;
      border-radius: 50%;

      & svg {
        width: 30px;
        height: 30px;
        path {
          stroke: #fff;
        }
      }
    }
  }

  & .body {
    max-width: 350px;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
  }

  & .subtitle {
    color: #aeaeae;
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
`;
