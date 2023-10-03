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
} from "lib/mui.lib.icons";
import CardService from "@/services/branches.service";
import { toast } from "react-toastify";
import { IProductData } from "../types";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import { IPartnerDataProps } from "@/types/globalTypes";

type IProps = {
  handleClose: () => void;
  data: IPartnerDataProps[];
  handleDelete: (callback: () => void) => () => void;
};

export const DeleteProductConfirm = ({
  handleClose,
  data,
  handleDelete,
}: IProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const isMorThanOne = data?.length > 1;

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
        Delete branch{isMorThanOne ? "es" : ""}
      </MuiTypography>
      <MuiTypography variant="body2" className="body">
        Are you sure you want to delete {isMorThanOne ? "these" : "this"} branch
        {isMorThanOne ? "es" : ""}?
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
          disabled={isDeleting}
          onClick={handleSubmit}
          className="primary-btn btn">
          {isDeleting ? (
            <MuiCircularProgress size={22} />
          ) : (
            `Delete Branch${isMorThanOne ? "es" : ""}`
          )}
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
    margin-top: 45px;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
`;
