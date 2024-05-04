import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import debounce from "lodash.debounce";
import { AxiosPromise } from "axios";

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

import {
  IListingData,
  IListingResponse,
  IPagination,
  IStatus,
} from "@/types/globalTypes";
import CustomTableSkeleton from "@/components/skeleton/CustomTableSkeleton";
import {
  convertDateToTimZone,
  createPaginationData,
  formatCurrency,
  getIdName,
  getListingTimeRemaining,
} from "utils/helper-funcs";
import TableWrapper from "@/components/table/TableWrapper";
import { IconAdd, IconVisibility } from "@/lib/mui.lib.icons";

import { ActionTimeStatus, IActiveStatus } from "./OrderStatus";

import CustomSearch from "@/components/input/CustomSearch";
import StatusFilter from "@/components/select/StatusFillter";
import ListingService from "@/services/listing-service";
import useCachedDataStore from "@/config/store-config/lookup";
import { OrderStatus } from "@/components/feedback/OrderStatus";
import throttle from "lodash.throttle";

const defaultQuery: IPagination = {
  pageSize: 10,
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
  showAddNew?: boolean;
  id?: string;
  apiFunc?: (
    query?: string,
    signal?: AbortSignal
  ) => AxiosPromise<IListingResponse>;
  queryKey?: string;
};

export function SettlementTable({
  showMoreText = true,
  showFilter = false,
  showPagination = false,
  showAddNew = false,
  id = "",
  apiFunc = ListingService.getAll,
  queryKey = "all-orders",
}: IProps) {
  const { catalogueStatus } = useCachedDataStore(
    (state) => state.cache?.lookup
  );
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  const [filter, setFilter] = React.useState<number[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const [text, setText] = React.useState("");

  const handleSetFilter = (values: number[]) => {
    setFilter(values);
  };

  const { data, isLoading, isError } = useQuery(
    [queryKey, id, filter, pagination.page, pagination.pageSize, searchText],
    ({ signal }) =>
      apiFunc(
        `?pageNumber=${pagination.page}&pageSize=${
          pagination?.pageSize
        }&searchText=${searchText}${
          filter?.length > 0
            ? `${filter.reduce((acc, val) => {
                acc += `&status=${val}`;
                return acc;
              }, "")}`
            : ""
        }`,
        signal
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

  const handleAddNew = () => {
    navigate("/app/marketplace/listings/add-listing");
  };

  const handleChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewMore = () => {
    navigate("listings");
  };

  const handleViewDetails = (data: IListingData) => () => {
    navigate(`${data?.id}`, {
      state: data,
    });
  };

  const handleSetSearchText = (value: string) => () => {
    if (value) {
      setSearchText(value);
    }
  };

  const debouncedChangeHandler = React.useMemo(
    () => throttle(handleSetSearchText(text), 500),
    [text]
  );

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setText(value);
    debouncedChangeHandler();
  };

  return (
    <StyledPage>
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Listings
          </MuiTypography>
          <MuiTypography
            className="total"
            fontWeight="600"
            color="secondary"
            variant="body2">
            {pagination?.total || 0}
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

        <div className="action-section">
          <StatusFilter
            selectedValue={filter}
            handleSetValue={handleSetFilter}
            options={catalogueStatus}
            style={{
              width: "150px",
            }}
          />
          <CustomSearch
            placeholder="Search catalogue ID, name or description"
            value={text}
            onChange={handleChangeText}
          />

          {showAddNew && (
            <MuiButton
              startIcon={<IconAdd />}
              variant="contained"
              color="primary"
              style={{ whiteSpace: "nowrap" }}
              onClick={handleAddNew}
              className="btn">
              Add New
            </MuiButton>
          )}
        </div>
      </div>

      <TableWrapper
        showPagination
        handleChangePagination={handleChange}
        pagination={pagination}>
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
                <MuiTableCell className="heading" align="left">
                  Bids
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Bidders
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Offers
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Offerers
                </MuiTableCell>
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "250px" }}>
                  Location
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Auction
                </MuiTableCell>
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "120px" }}>
                  Price
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Status
                </MuiTableCell>
                <MuiTableCell className="heading" align="center"></MuiTableCell>
              </MuiTableRow>
            </MuiTableHead>

            <MuiTableBody>
              {!isLoading &&
                data?.map((row) => {
                  const timeRemaining = getListingTimeRemaining(
                    row?.creationTime,
                    row?.durationInHours
                  );

                  return (
                    <MuiTableRow
                      key={row?.id}
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
                            <MuiTypography
                              variant="body2"
                              className="product-name">
                              {row?.name}
                            </MuiTypography>
                            <MuiTypography variant="body2" className="list-id">
                              <b>Listing ID:</b> {row?.id}
                            </MuiTypography>
                          </div>
                        </div>
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        {row?.catalogueCategoryName}
                      </MuiTableCell>
                      <MuiTableCell align="left">{row?.totalBids}</MuiTableCell>
                      <MuiTableCell align="left">
                        {row?.totalBidders}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        {row?.totalOffers}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        {row?.totalOfferers || 0}
                      </MuiTableCell>
                      <MuiTableCell align="left">{row?.location}</MuiTableCell>
                      <MuiTableCell align="left">
                        <ActionTimeStatus
                          type={
                            timeRemaining > 0
                              ? (row?.catalogueStatusDescription?.toLowerCase() as IActiveStatus)
                              : "closed"
                          }
                          catelogueStatus={
                            getIdName(
                              row?.catalogueStatus,
                              catalogueStatus
                            )?.toLowerCase() as IStatus
                          }
                          time={timeRemaining}
                        />
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        ₦
                        {formatCurrency({
                          amount: row?.price,
                          style: "decimal",
                        })}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        <OrderStatus
                          style={{
                            display: "inline-block",
                            whiteSpace: "nowrap",
                          }}
                          type={
                            getIdName(
                              row?.catalogueStatus,
                              catalogueStatus
                            )?.toLowerCase() as IStatus
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
                  );
                })}

              {!isLoading && data && data?.length === 0 && !isError && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={8}
                    align="center"
                    className="no-data-cell"
                    rowSpan={20}>
                    <NoData
                      title="No Listings yet"
                      message="Recent Listings will appear here"
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
                      message="Sorry, we couldn't fetch all Listing. Try again later or contact Rensa support."
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {!data && isLoading && (
                <CustomTableSkeleton columns={10} rows={10} />
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
    /* max-width: 700px; */
    gap: 10px;
    flex-wrap: wrap;
  }

  & .top-section {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

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
    flex-wrap: wrap;
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

  & .btn {
    height: 36px;
    font-size: 12px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    width: fit-content;
  }
`;
