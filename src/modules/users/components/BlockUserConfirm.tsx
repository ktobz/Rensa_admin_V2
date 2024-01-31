import * as React from "react";
import {
  styled,
  MuiTypography,
  MuiButton,
  MuiCircularProgress,
} from "@/lib/index";

import { IconBlock, IconUnblock } from "lib/mui.lib.icons";

type IProps = {
  handleClose: () => void;
  data: any;
  handleAction: (callback: () => void) => () => void;
  action: "block" | "unblock";
};

export const BlockUserConfirm = ({
  handleClose,
  data,
  handleAction,
  action = "unblock",
}: IProps) => {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const isToClose = action === "block";

  const callback = () => {
    setIsUpdating(false);
  };

  const handleSubmit = () => {
    setIsUpdating(true);
    handleAction(callback)();
  };

  return (
    <StyledSection>
      {isToClose ? (
        <IconBlock className="delete-icon" />
      ) : (
        <IconUnblock className="delete-icon" />
      )}
      <MuiTypography variant="body2" className="heading">
        {isToClose ? "Block" : "Unblock"} this user
      </MuiTypography>
      <MuiTypography variant="body2" className="body">
        {isToClose
          ? "Are you sure you want to block this user. User wont be able to buy or sell on the platform"
          : "Are you sure you want to unblock this user. User will be able to buy or sell on the platform"}
      </MuiTypography>

      <div className="action-group">
        <MuiButton
          type="button"
          variant="contained"
          onClick={handleClose}
          disabled={isUpdating}
          className="secondary-btn btn">
          No
        </MuiButton>
        <MuiButton
          type="button"
          color="error"
          variant="contained"
          disabled={isUpdating}
          onClick={handleSubmit}
          startIcon={isUpdating ? <MuiCircularProgress size={14} /> : null}
          className="primary-btn btn">
          {isToClose ? "Block " : "Unblock"}
        </MuiButton>
      </div>
    </StyledSection>
  );
};

const StyledSection = styled.section`
  width: calc(100vw - 40px);
  max-width: 445px;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  & .notice {
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 300px;
    margin-top: 20px;
    /* align-items: baseline; */

    & .text {
      color: #64748b;
    }
  }

  & .delete-icon {
    width: 130px;
    height: 130px;
  }

  & .heading {
    font-weight: 700;
    font-size: 24px;
  }

  & .action-group {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    border-top: 1px solid #fbfbfb;
    margin-top: 25px;
    padding-top: 25px;
    & .secondary-btn {
      background: #fbfbfb;
      color: #363636;
    }
  }

  & .wrapper {
    width: 100%;
    display: flex;
    gap: 30px;
    align-items: center;
    justify-content: center;
    margin-top: 10px;

    & .assets {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      & .img-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 51px;
        height: 51px;
        background-color: #e8f1f8;

        border-radius: 50%;

        & svg {
          width: 30px;
          height: 30px;
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

    display: flex !important;
    align-items: center;
    justify-content: center;
  }
`;
