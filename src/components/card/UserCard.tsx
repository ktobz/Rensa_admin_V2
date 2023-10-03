import { styled, MuiTypography, MuiCardMedia } from "@/lib/index";
import { IconDefaultUserImage } from "lib/mui.lib.icons";

type IProps = {
  data: any;
};

export const UserDetailCard = ({ data }: IProps) => {
  return (
    <StyledSection>
      {data?.profile_image ? (
        <MuiCardMedia
          component="img"
          className="img"
          src={data?.profile_image}
        />
      ) : (
        <IconDefaultUserImage className="img" />
      )}

      <div className="details">
        <MuiTypography variant="body2" className="name">
          {data?.full_name}
        </MuiTypography>
        <MuiTypography className="email" variant="body2">
          {data?.phone || data?.email}
        </MuiTypography>
      </div>
    </StyledSection>
  );
};

const StyledSection = styled.section`
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
`;
