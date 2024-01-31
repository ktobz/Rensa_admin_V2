import * as React from "react";
import {
  styled,
  MuiTypography,
  MuiButton,
  MuiCircularProgress,
} from "@/lib/index";
import { IconDeleteLarge } from "lib/mui.lib.icons";
import { IUserData } from "@/types/globalTypes";
import AppInput from "@/components/input";

type IProps = {
  handleClose: () => void;
  data: IUserData[];
  handleDelete: (callback: () => void) => () => void;
};

export const DeleteUserConfirm = ({
  handleClose,
  data,
  handleDelete,
}: IProps) => {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const isMorThanOne = data?.length > 1;

  const callback = () => {
    setIsDeleting(false);
  };

  const handleSubmit = () => {
    if (value === "DELETE") {
      setError("");
      setIsDeleting(true);
      handleDelete(callback)();
    } else {
      setError("Confirmation incorrect");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };

  return (
    <StyledSection>
      <IconDeleteLarge className="delete-icon" />
      <MuiTypography variant="body2" className="heading">
        Delete User{isMorThanOne ? "s" : ""}
      </MuiTypography>
      <MuiTypography variant="body2" className="body">
        Are you sure you want to delete {isMorThanOne ? "these" : "this"} user
        {isMorThanOne ? "s" : ""}?
      </MuiTypography>

      <div className="cover-wrapper">
        <AppInput
          id="name"
          name="confirm"
          label={
            <p style={{ margin: "0 0 -5px" }}>
              Type "<b>DELETE</b>" to confirm
            </p>
          }
          placeholder="Enter text"
          type="text"
          value={value}
          onChange={handleChange}
          helperText={error}
          error={!!error}
        />
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
          disabled={isDeleting}
          onClick={handleSubmit}
          className="primary-btn btn">
          {isDeleting ? (
            <MuiCircularProgress size={22} />
          ) : (
            `Delete user${isMorThanOne ? "s" : ""}`
          )}
        </MuiButton>
      </div>
    </StyledSection>
  );
};

const StyledSection = styled.section`
  width: calc(100vw - 80px);
  max-width: 450px;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  & .cover-wrapper {
    width: 100%;
    max-width: 415px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
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
