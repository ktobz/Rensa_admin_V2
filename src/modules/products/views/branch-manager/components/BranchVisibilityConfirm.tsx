import * as React from "react";
import {
  styled,
  MuiTypography,
  MuiButton,
  IconLock,
  IconBranches,
  IconUnlock,
} from "@/lib/index";

import { IProductData } from "../types";
import { CustomSwitch } from "@/components/input/CustomSwitch";

type IProps = {
  handleClose: () => void;
  data: IProductData[];
  action: "open" | "close";
  handleUpdateData: () => void;
};

export const BranchVisibilityConfirm = ({
  handleClose,
  data,
  action = "close",
  handleUpdateData,
}: IProps) => {
  const isMorThanOne = data?.length > 1;
  const isToClose = action === "close";
  return (
    <StyledSection>
      {isToClose ? (
        <IconLock className="delete-icon" />
      ) : (
        <IconUnlock className="delete-icon" />
      )}
      <MuiTypography variant="body2" className="heading">
        {isToClose ? "Close" : "Open"} branch{isMorThanOne ? "s" : ""}
      </MuiTypography>
      <MuiTypography variant="body2" className="body">
        Are you sure you want to {isToClose ? "close" : "open"}{" "}
        {isMorThanOne ? "these" : "this"} branch
        {isMorThanOne ? "es" : ""}?
      </MuiTypography>
      <div className="branch">
        <div className="img-wrapper">
          <IconBranches className="icon" />
        </div>
        <MuiTypography variant="body2" className="branch-name">
          Sangotedo Outlet
        </MuiTypography>
      </div>
      <MuiTypography variant="body2" className="visibility">
        <span>Managers can change availability</span>{" "}
        <div className="actions">
          <CustomSwitch color="primary" />{" "}
          <span className="label publish-label">No</span>
        </div>
      </MuiTypography>

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
          onClick={handleUpdateData}
          className="primary-btn btn">
          {isToClose ? "Close" : "Open"} Branch{isMorThanOne ? "es" : ""}
        </MuiButton>
      </div>
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

  & .visibility {
    width: 100%;
    display: flex;
    gap: 10px;
    max-width: 400px;
    align-items: center;
    margin-top: 20px;
    justify-content: space-between;
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
