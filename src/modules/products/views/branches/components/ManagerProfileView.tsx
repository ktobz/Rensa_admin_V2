import * as Yup from "yup";

import { styled, MuiTypography, MuiCardMedia } from "@/lib/index";
import { IBranchManagerData } from "@/types/globalTypes";

const SCHEMA = Yup.object().shape({
  category: Yup.string().required("required"),
  price: Yup.string().required("required"),
});

type IProps = {
  initData: IBranchManagerData;
};
export const ManagerProfileView = ({ initData }: IProps) => {
  return (
    <StyledSection>
      <div className="wrapper">
        <div className="image-wrapper">
          <MuiCardMedia
            component="img"
            src={initData?.profile_image}
            width={"100%"}
            height={"100%"}
          />
        </div>
        <div className="data-wrapper">
          <MuiTypography variant="body2" className="label">
            Full Name
          </MuiTypography>
          <MuiTypography variant="body2" className="value">
            {initData?.full_name}
          </MuiTypography>
        </div>
        <div className="data-wrapper">
          <MuiTypography variant="body2" className="label">
            Registered Email
          </MuiTypography>
          <MuiTypography variant="body2" className="value">
            {initData?.email}
          </MuiTypography>
        </div>
        <div className="data-wrapper">
          <MuiTypography variant="body2" className="label">
            Phone Number
          </MuiTypography>
          <MuiTypography variant="body2" className="value">
            {initData?.phone}
          </MuiTypography>
        </div>
      </div>
    </StyledSection>
  );
};

const StyledSection = styled.section`
  width: calc(100vw - 40px);
  max-width: 530px;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;

  & .wrapper {
    max-width: 450px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    gap: 22px;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
  }

  & .subtitle {
    color: #aeaeae;
  }

  & .flex-wrapper {
    display: flex;
    gap: 30px;
    align-items: self-end;
  }

  & .image-wrapper {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background-color: #f9f9f9;
    object-fit: cover;
    overflow: hidden;
  }

  & .data-wrapper {
    width: 100%;
    display: flex;
    gap: 5px;
    flex-direction: column;

    & .label {
      font-weight: 600;
    }

    & .value {
      padding: 10px;
      background-color: #f9f9f9;
      height: 50px;
      display: flex;
      align-items: center;
      border-radius: 6px;
      color: #262626;
    }
  }

  & .btn {
    width: 100%;
    margin-top: 45px;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
`;
