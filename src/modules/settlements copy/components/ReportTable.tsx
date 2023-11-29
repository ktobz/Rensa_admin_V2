import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiButton,
  MuiCardMedia,
  MuiIconButton,
  MuiPagination,
  MuiTable,
  MuiTableBody,
  MuiTableCell,
  MuiTableContainer,
  MuiTableHead,
  MuiTableRow,
  MuiTypography,
  styled,
} from "@/lib/index";

import { IPagination, IReportedListingData } from "@/types/globalTypes";
import CustomTableSkeleton from "@/components/skeleton/CustomTableSkeleton";
import {
  createPaginationData,
  formatCurrency,
  getIdName,
} from "utils/helper-funcs";
import TableWrapper from "@/components/table/TableWrapper";
import { IconVisibility } from "@/lib/mui.lib.icons";

import {
  ActionTimeStatus,
  IStatus,
  SettlementStatus,
  ISettlementStatus,
} from "./OrderStatus";
import CustomSearch from "@/components/input/CustomSearch";
import StatusFilter from "@/components/select/StatusFillter";
import ListingService from "@/services/listing-service";
import useCachedDataStore from "@/config/store-config/lookup";
import { OrderStatus } from "@/components/feedback/OrderStatus";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type IProps = {
  showPagination?: boolean;
  showFilter?: boolean;
  showMoreText?: boolean;
};

export function ReportTable({
  showMoreText = true,
  showFilter = false,
  showPagination = false,
}: IProps) {
  const navigate = useNavigate();
  const { reportedListingStatus } = useCachedDataStore(
    (state) => state.cache?.lookup
  );
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  const [filter, setFilter] = React.useState<number[]>([]);

  const handleSetFilter = (values: number[]) => {
    setFilter(values);
  };

  const { data, isLoading, isError, error } = useQuery(
    ["reported-listing", filter, pagination.page, pagination.pageSize],
    () =>
      ListingService.getAllReportedListing(
        `?pageNumber${pagination.page}&pageSize=${pagination?.pageSize}`
      ).then((res) => {
        const { data, ...paginationData } = res.data?.result;
        const { hasNextPage, hasPrevPage, total, totalPages } =
          createPaginationData(data, paginationData);

        setPagination((prev) => ({
          ...prev,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        }));

        return data;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewDetails = (data: IReportedListingData) => () => {
    navigate(`${data?.catalogueId}`, { state: data });
  };

  return (
    <StyledPage>
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Reported Listings
          </MuiTypography>
          <MuiTypography
            className="total"
            fontWeight="600"
            color="secondary"
            variant="body2">
            {data?.length || 0}
          </MuiTypography>
          {/* {showMoreText && (
            <MuiButton
              onClick={handleViewMore}
              className="view-all"
              variant="text">
              View all
            </MuiButton>
          )} */}
        </div>
        {showFilter && (
          <div className="action-section">
            <StatusFilter
              selectedValue={filter}
              handleSetValue={handleSetFilter}
              options={reportedListingStatus}
            />
            <CustomSearch placeholder="Search product name, product ID" />
          </div>
        )}
      </div>

      <TableWrapper showPagination={showPagination} pagination={pagination}>
        <MuiTableContainer
          sx={{
            maxWidth: "100%",
            minHeight: data?.length === 0 ? "inherit" : "unset",
            flex: 1,
          }}>
          <MuiTable
            sx={{
              minWidth: 750,
              minHeight: data?.length === 0 ? "inherit" : "unset",
            }}
            aria-label="simple table">
            <MuiTableHead>
              <MuiTableRow>
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "270px" }}>
                  Listing
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Category
                </MuiTableCell>
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "180px" }}>
                  Reason
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Status
                </MuiTableCell>

                <MuiTableCell className="heading" align="center"></MuiTableCell>
              </MuiTableRow>
            </MuiTableHead>

            <MuiTableBody>
              {data?.map((row) => (
                <MuiTableRow
                  key={row?.catalogueId}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}>
                  {" "}
                  <MuiTableCell className="order-id" align="left">
                    <div className="info">
                      <MuiCardMedia
                        component="img"
                        src={row?.coverPhoto}
                        className="img"
                        width="50px"
                        height="50px"
                      />
                      <div className="details" style={{ flex: "1" }}>
                        <MuiTypography variant="body2" className="product-name">
                          {row?.catalogueName}
                        </MuiTypography>
                        <MuiTypography variant="body2" className="list-id">
                          <b>Listing ID:</b> {row?.catalogueId}{" "}
                        </MuiTypography>
                      </div>
                    </div>
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    {row?.catalogue?.catalogueCategoryName}
                  </MuiTableCell>
                  <MuiTableCell align="left">{row?.reason || "-"}</MuiTableCell>
                  <MuiTableCell align="left">
                    <OrderStatus
                      style={{
                        display: "inline-block",
                        width: "100%",
                        border: "none",
                      }}
                      type={
                        getIdName(row?.status, reportedListingStatus) as any
                      }
                    />
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    <MuiIconButton
                      onClick={handleViewDetails(row)}
                      className="visible-btn">
                      <IconVisibility />
                    </MuiIconButton>
                  </MuiTableCell>
                </MuiTableRow>
              ))}

              {!isLoading && data && data?.length === 0 && !isError && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={8}
                    align="center"
                    className="no-data-cell"
                    rowSpan={20}>
                    <NoData
                      title="No Reported Listing yet"
                      message="Recent Reported listing will appear here"
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {isError && !data && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={8}
                    className="no-data-cell"
                    align="center">
                    <NoData
                      title="An Error Occurred"
                      message="Sorry, we couldn't fetch reported listings. Try again later or contact Rensa support."
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {!data && isLoading && (
                <CustomTableSkeleton columns={5} rows={10} />
              )}
            </MuiTableBody>
          </MuiTable>
        </MuiTableContainer>
      </TableWrapper>
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;

  & .info {
    display: flex;
    align-items: center;
    gap: 10px;
    & .img {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      background: #f2f2f2;
      border: none;
    }

    & .product-name {
      font-size: 14px;
      font-weight: 600;
    }
    & .list-id {
      color: #5d6c87;
      font-size: 12px;
    }
  }

  & .action-section {
    flex: 1;
    display: flex;
    /* gap: 20px; */
    justify-content: end;
    align-items: center;
    max-width: 700px;
  }

  & .top-section {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;

    & .view-all {
      height: fit-content;
      min-height: fit-content;
      font-family: "Helvetica";
    }

    & .heading {
      font-weight: 600;
      font-size: 18px;
    }
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 30px 0 15px 0;
  }

  & .visible-btn {
    background-color: #e8f1f8;
    border-radius: 10px;
    color: #1e75bb;
    padding: 12px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  & .order-id {
    b {
      color: #1e75bb;
    }
  }

  & .new > path {
    stroke: #d78950;
  }

  & .picked-up > path {
    stroke: #0f46b1;
  }

  & .confirmed > path {
    stroke: #7dc324;
  }
  & .cancelled > path {
    stroke: #ef5050;
  }
  & .delivered > path {
    stroke: #05a357;
  }
`;
