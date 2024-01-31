import { UserDetailCard } from "@/components/card/UserCard";
import {
  IconLocationBig,
  IconPhone,
  MuiDivider,
  MuiTypography,
  styled,
} from "@/lib/index";
import { IListingData } from "@/types/globalTypes";

type IProps = {
  listingData: IListingData | null;
  isLoading: boolean;
  isError: boolean;
};

export const SellerInfo = ({ listingData }: IProps) => {
  return (
    <StyledWrapper>
      <div className="group-heading">
        <MuiTypography variant="h4" className="heading">
          Seller Info
        </MuiTypography>
      </div>
      <UserDetailCard
        variant="user"
        data={{
          title: `${listingData?.sellerInfo?.firstName || "-"} ${
            listingData?.sellerInfo?.lastName || "-"
          }`,
          body: `${listingData?.sellerInfo?.email || "-"}`,
        }}
        viewDetailsLink={`/app/users/${listingData?.sellerInfo?.userId}`}
        className="user-card"
      />
      <MuiDivider className="divider" />
      <div className="info-group">
        <IconPhone />
        <div className="data">
          <MuiTypography variant="body1" className="title">
            Contact number
          </MuiTypography>
          <MuiTypography variant="body1" className="body">
            {listingData?.sellerInfo?.phoneNumber || "-"}
          </MuiTypography>
        </div>
      </div>

      <MuiDivider className="divider" />
      <div className="info-group">
        <IconLocationBig />
        <div className="data">
          <MuiTypography variant="body1" className="title">
            Item Pickup location
          </MuiTypography>
          <MuiTypography variant="body1" className="body">
            {listingData?.city || "-"}, {listingData?.state || "-"}
          </MuiTypography>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.section`
  height: 100%;
  width: 100%;
  padding: 20px;
  border: 1px solid #f4f4f4;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  flex-direction: column;

  & .info-group {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 15px 0;

    & .title {
      color: #64748b;
    }
    & .body {
      color: #282828;
      font-weight: 600;
    }
  }

  & .user-card {
    flex: unset;
  }

  & .heading {
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #f4f4f4;
  }
`;
