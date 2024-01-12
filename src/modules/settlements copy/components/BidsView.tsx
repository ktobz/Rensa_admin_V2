import * as React from "react";
import { useQueryClient } from "react-query";
import SimpleBar from "simplebar-react";

import { NoData } from "@/components/feedback/NoData";
import { MuiBox, MuiTypography, styled } from "@/lib/index";
import { IconNotificationInfo } from "@/lib/mui.lib.icons";

import { IListingData, ISettlementStatus } from "@/types/globalTypes";
import CustomTabs from "@/components/other/CustomTabs";
import CustomTab from "@/components/other/CustomTab";
import { UserDetailCard } from "@/components/card/UserCard";
import { BidStatus } from "./BidStatus";
import useCachedDataStore from "@/config/store-config/lookup";
import { formatCurrency, formatDate } from "@/utils/helper-funcs";

type IProps = {
  listingData: IListingData | null;
  isLoading: boolean;
  isError: boolean;
};
export function BidsView({ isLoading, listingData, isError }: IProps) {
  const queryClient = useQueryClient();
  const { bidType } = useCachedDataStore((state) => state.cache.lookup);

  const [show, setShow] = React.useState(false);

  const [current, setCurrent] = React.useState(() => {
    return 0;
  });

  const handleChangeIndex = (index: number) => () => {
    setCurrent(index);
  };

  const handleToggleShow = () => {
    setShow((prev) => !prev);
  };

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(["all-bids"]);
    handleCloseModal();
  };

  const bids = listingData?.catalogueBids?.filter((x) => x?.bidType === 2);
  const offers = listingData?.catalogueBids?.filter((x) => x?.bidType === 1);

  const biddersAndCount = bids?.reduce((acc, v) => {
    if (v?.userId in acc) {
      acc[v.userId] += 1;
    } else {
      acc[v.userId] = 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const numberOfBidders = Object.values(biddersAndCount || {})?.length || 0;

  return (
    <StyledPage>
      <div className="tab-section">
        <CustomTabs
          variant="fullWidth"
          style={{ width: "100%" }}
          value={current || 0}>
          <CustomTab
            onClick={handleChangeIndex(0)}
            value={0}
            label="Bid"
            current={current}
            hideIcon
            variant="primary"
            className="custom-tab"
          />
          <CustomTab
            onClick={handleChangeIndex(1)}
            value={1}
            label="Offers"
            current={current}
            hideIcon
            variant="primary"
            className="custom-tab"
          />
        </CustomTabs>
      </div>
      <div className="rows-wrapper">
        {current === 0 ? (
          <div className="heading">
            <MuiTypography variant="body1" className="section-heading">
              Recent bids
            </MuiTypography>

            <div className="totals">
              <MuiTypography variant="body1" className="total">
                <b>{bids?.length || 0}</b> bids
              </MuiTypography>
              <span>|</span>
              <MuiTypography variant="body1" className="total">
                <b>{numberOfBidders || 0}</b> bidders
              </MuiTypography>
            </div>
          </div>
        ) : (
          <div className="heading">
            <MuiTypography variant="body1" className="section-heading">
              Recent offers
            </MuiTypography>
            <MuiTypography variant="body1" className="total">
              <b>{offers?.length || 0}</b> offers
            </MuiTypography>
          </div>
        )}
        {current === 0 && (
          <SimpleBar className="list-wrapper">
            {!isLoading &&
              bids &&
              bids?.map((row) => (
                <div key={row?.id} className="notif-row">
                  <UserDetailCard
                    variant="bidder"
                    data={{
                      fullName: `${row?.bidderInfo?.firstName || "-"} ${
                        row?.bidderInfo?.lastName || "-"
                      }`,
                      date: formatDate(
                        row?.creationTime || "",
                        "do LLLL yyyy, HH:MM:ss"
                      ),
                      image: row?.bidderInfo?.profilePictureUrl || "",
                      verStatus: row?.bidderInfo?.isVerified || false,
                    }}
                  />
                  <MuiBox className="bid-value">
                    <MuiTypography variant="body1" className="amount">
                      ₦
                      {formatCurrency({
                        amount: row?.bidPrice,
                        style: "decimal",
                      })}
                    </MuiTypography>
                  </MuiBox>
                </div>
              ))}

            {!isLoading && bids && bids?.length === 0 && !isError && (
              <div className="no-data-cell">
                <NoData
                  title="No bids yet"
                  icon={<IconNotificationInfo className="icon" />}
                  message="Bids will show here"></NoData>
              </div>
            )}
          </SimpleBar>
        )}
        {current === 1 && (
          <SimpleBar className="list-wrapper">
            {!isLoading &&
              offers &&
              offers?.map((row) => (
                <div key={row?.id} className="notif-row">
                  <UserDetailCard
                    variant="bidder"
                    data={{
                      fullName: `${row?.bidderInfo?.firstName || "-"} ${
                        row?.bidderInfo?.lastName || "-"
                      }`,
                      date: formatDate(
                        row?.creationTime || "",
                        "do LLLL yyyy, HH:MM:ss"
                      ),
                      image: row?.bidderInfo?.profilePictureUrl || "",
                      verStatus: row?.bidderInfo?.isVerified || false,
                    }}
                  />
                  <MuiBox className="bid-value">
                    <MuiTypography variant="body1" className="amount">
                      ₦
                      {formatCurrency({
                        amount: row?.bidPrice,
                        style: "decimal",
                      })}
                    </MuiTypography>
                    {current == 1 && (
                      <BidStatus
                        status={row?.bidStatusDescription as ISettlementStatus}
                      />
                    )}
                  </MuiBox>
                </div>
              ))}

            {!isLoading && offers && offers?.length === 0 && !isError && (
              <div className="no-data-cell">
                <NoData
                  title="No offers yet"
                  icon={<IconNotificationInfo className="icon" />}
                  message="Offers will show here"></NoData>
              </div>
            )}
          </SimpleBar>
        )}
      </div>

      {/* {isError && !data && (
        <div className="no-data-cell">
          <NoData
            title="An Error Occurred"
            message="Sorry, we couldn't fetch bids. Try again later or contact Rensa support."
            icon={<IconNotificationInfo className="icon" />}
          />
        </div>
      )} */}

      {/* {!data && isLoading && (
                <CustomTableSkeleton columns={7} rows={10} />
              )} */}
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;
  height: 450px;
  padding: 20px;
  border: 1px solid #f4f4f4;
  border-radius: 10px;

  & .action-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  & .tabs {
    /* width: 50%; */
    flex: 1;
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;

    & .custom-tab {
      flex: 1;
      width: 100%;
    }

    & .action-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      justify-content: end;
    }
  }

  & .rows-wrapper {
    padding: 10px;

    & .heading {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: center;
      margin-bottom: 10px;

      & .section-heading {
        color: #64748b;
        font-size: 14px;
        font-weight: 600;
      }

      & .total {
        color: #fb651e;
        font-size: 14px;
      }

      & .totals {
        display: flex;
        justify-content: end;
        gap: 10px;
        align-items: center;
        & span {
          color: #f4f4f4;
        }
      }
    }
  }

  & .notif-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: center;
    border-bottom: 1px solid #f4f4f4;
    border-top: 1px solid #f4f4f4;
    padding: 5px 0;

    & .bid-value {
      display: flex;
      gap: 0px;
      align-items: end;
      flex-direction: column;

      & .amount {
        font-weight: 500;
      }
    }
  }

  & .list-wrapper {
    height: 320px;
    padding-right: 20px;
    width: calc(100% + 20px);
  }
`;
