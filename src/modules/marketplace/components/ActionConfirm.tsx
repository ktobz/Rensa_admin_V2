import * as React from "react";
import {
  styled,
  MuiTypography,
  MuiButton,
  MuiCircularProgress,
  IconWarning,
} from "@/lib/index";

type IProps = {
  handleClose: () => void;
  action: any;
  handleAction: (callback: () => void) => () => void;
};

export const ActionConfirm = ({
  handleClose,
  action,
  handleAction,
}: IProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const callback = () => {
    setIsSubmitting(false);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    handleAction(callback)();
  };

  return (
    <StyledSection>
      <IconWarning className="delete-icon" />
      <MuiTypography variant="body2" className="heading">
        Are you sure?
      </MuiTypography>

      <div className="action-group">
        <MuiButton
          type="button"
          variant="contained"
          onClick={handleClose}
          disabled={isSubmitting}
          className="secondary-btn btn">
          Cancel
        </MuiButton>
        <MuiButton
          type="button"
          color="primary"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <MuiCircularProgress size={18} /> : null}
          onClick={handleSubmit}
          className="primary-btn btn">
          {action}
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
    font-size: 18px;
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
