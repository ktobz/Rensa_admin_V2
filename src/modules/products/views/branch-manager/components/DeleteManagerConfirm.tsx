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
import {
  IconDiesel,
  IconLPG,
  IconListIcon,
  IconPetrol,
  IconDeleteLarge,
  IconInfo,
  IconDefaultUserImage,
} from "lib/mui.lib.icons";
import CardService from "@/services/branches.service";
import { toast } from "react-toastify";
import { IProductData, IProductPriceProps } from "../types";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";

type IProps = {
  handleClose: () => void;
  data: any[];
  handleDelete: (callback: () => void) => () => void;
};

export const DeleteManagerConfirm = ({
  handleClose,
  data,
  handleDelete,
}: IProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isMorThanOne = data?.length > 1;
  const deleteData = data?.[0];

  const callback = () => {
    setIsDeleting(false);
  };

  const handleSubmit = () => {
    setIsDeleting(true);
    handleDelete(callback)();
  };

  return (
    <StyledSection>
      <IconDeleteLarge className="delete-icon" />
      <MuiTypography variant="body2" className="heading">
        Delete Manager{isMorThanOne ? "s" : ""}
      </MuiTypography>
      <MuiTypography variant="body2" className="body">
        Are you sure you want to delete {isMorThanOne ? "these" : "this"}{" "}
        manager{isMorThanOne ? "s" : ""}?
      </MuiTypography>

      {!isMorThanOne && (
        <div className="delete-data">
          <IconDefaultUserImage className="img" />
          <div className="details">
            <MuiTypography variant="body2" className="name">
              {deleteData?.full_name}
            </MuiTypography>
            <MuiTypography className="email" variant="body2">
              {deleteData?.email}
            </MuiTypography>
          </div>
        </div>
      )}

      <div className="notice">
        <IconInfo htmlColor="#F05B2A" />

        <MuiTypography variant="body2" className="text">
          Manager wont have access to the Rensa Branch app and account will be
          deleted permanently.{" "}
        </MuiTypography>
      </div>

      <div className="action-group">
        <MuiButton
          type="button"
          variant="contained"
          onClick={handleClose}
          disabled={isDeleting}
          className="secondary-btn btn">
          Cancel
        </MuiButton>
        <MuiButton
          type="button"
          color="error"
          variant="contained"
          disabled={isDeleting}
          onClick={handleSubmit}
          startIcon={isDeleting ? <MuiCircularProgress size={18} /> : null}
          className="primary-btn btn">
          Delete manager{isMorThanOne ? "s" : ""}
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
