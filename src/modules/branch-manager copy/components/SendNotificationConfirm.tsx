import * as React from "react";
import {
  styled,
  MuiTypography,
  MuiButton,
  MuiInputAdornment,
  MuiCircularProgress,
} from "@/lib/index";
import { VendgramSelectInput } from "components/input";
import FormTitle from "components/text/FormTitle";
import { IconDeleteLarge, IconSendNotification } from "lib/mui.lib.icons";

type IProps = {
  handleClose: () => void;
  data: any[];
  handleSend: (callback: () => void) => () => void;
};

export const SendNotificationConfirm = ({
  handleClose,
  data,
  handleSend,
}: IProps) => {
  const [isSending, setIsSending] = React.useState(false);

  const isMorThanOne = data?.length > 1;
  const notificationData = data?.[0];

  const callback = () => {
    setIsSending(false);
  };

  const handleSubmit = () => {
    setIsSending(true);
    handleSend(callback)();
  };

  return (
    <StyledSection>
      <div className="icon-wrapper">
        <IconSendNotification className="icon" />
      </div>
      <MuiTypography variant="body2" className="heading">
        Send Notification{isMorThanOne ? "s" : ""}
      </MuiTypography>
      <MuiTypography variant="body2" className="body">
        Are you sure you want to send {isMorThanOne ? "these" : "this"}{" "}
        notification{isMorThanOne ? "s" : ""}?
      </MuiTypography>

      {!isMorThanOne && (
        <div className="delete-data">
          <div className="details">
            <MuiTypography variant="body2" className="name">
              {notificationData?.title}
            </MuiTypography>
            <MuiTypography className="email" variant="body2">
              {notificationData?.description}
            </MuiTypography>
          </div>
        </div>
      )}

      <div className="action-group">
        <MuiButton
          type="button"
          variant="contained"
          onClick={handleClose}
          disabled={isSending}
          className="secondary-btn btn">
          Cancel
        </MuiButton>
        <MuiButton
          type="button"
          color="error"
          variant="contained"
          disabled={isSending}
          startIcon={isSending ? <MuiCircularProgress size={18} /> : null}
          onClick={handleSubmit}
          className="primary-btn btn">
          Send notification{isMorThanOne ? "s" : ""}
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

  & .icon-wrapper {
    background-color: #05a3571a;
    border-radius: 50%;
    padding: 20px;
  }
  & .notice {
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 400px;
    margin-top: 20px;
    /* align-items: baseline; */

    & .text {
      color: #64748b;
    }
  }

  & .delete-data {
    display: flex;
    gap: 10px;
    align-items: center;
    background: #fbfbfb;
    padding: 15px;
    border-radius: 8px;
    width: 100%;
    max-width: 410px;
    margin: auto;
    & .img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      overflow: hidden;
      object-fit: cover;
    }

    & .name {
      color: #1e75bb;
      font-weight: 500;
      margin-bottom: 5px;
      font-size: 14px;
    }

    & .email {
      color: #64748b;
      font-size: 14px;
    }
  }

  & .icon {
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
    max-width: 400px;
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
