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

import { IPagination } from "@/types/globalTypes";
import CustomTableSkeleton from "@/components/skeleton/CustomTableSkeleton";
import { createPaginationData, formatCurrency } from "utils/helper-funcs";
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

const data = [
  {
    id: "43579",
    customer: "Timothy Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Lekki Branch",
    amount: 23000,
    amount_settled: 2000,
    service_fee: 2300,
    status: "hold",
    settlement: "active",

    time: 0,
  },
  {
    id: "4358",
    customer: "Jame Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "John Branch",
    amount: 33000,
    amount_settled: 1000,
    service_fee: 2200,
    status: "sold",
    settlement: "delivered",

    time: 0,
  },
  {
    id: "43577",
    customer: "Peter Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Ajah Branch",
    amount: 23000,
    amount_settled: 2000,
    service_fee: 2300,
    status: "closed",
    settlement: "closed",

    time: 0,
  },
  {
    id: "43570",
    customer: "Timothy Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Lekki Branch",
    amount: 2300,
    amount_settled: 2000,
    service_fee: 2300,
    status: "error",
    settlement: "closed",

    time: 20,
  },
  {
    id: "43589",
    customer: "Timothy OrbJamesik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "James Branch",
    amount: 23000,
    amount_settled: 2000,
    service_fee: 2300,
    status: "warning",
    settlement: "pending",
    time: 220,
  },
];

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
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  const [filter, setFilter] = React.useState<number[]>([]);

  const handleSetFilter = (values: number[]) => {
    setFilter(values);
  };

  // const { data, isLoading, isError } = useQuery(
  //   [
  //     "all-user-cards-transactions",
  //     pagination.page,
  //     pagination.pageSize,
  //     variant,
  //   ],
  //   () =>
  //     CardService.getAllTransactions(
  //       `?pgn=${pagination.page}&pgs=${pagination.pageSize}`
  //     ).then((res) => {
  //       const data = res.data?.data;
  //       const { hasNextPage, hasPrevPage, total, totalPages } =
  //         createPaginationData(data, pagination);

  //       setPagination((prev) => ({
  //         ...prev,
  //         total,
  //         totalPages,
  //         hasNextPage,
  //         hasPrevPage,
  //       }));

  //       return data.data as ITransactionHistoryData[];
  //     }),
  //   {
  //     retry: 0,
  //   }
  // );

  const handleChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewDetails = (id: string) => () => {
    navigate(`${id}`);
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
            />
            <CustomSearch placeholder="Search product name, product ID" />
          </div>
        )}
      </div>

      <TableWrapper showPagination={showPagination}>
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
                  style={{ minWidth: "250px" }}>
                  Listing
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Category
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
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
                  key={row?.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}>
                  {" "}
                  <MuiTableCell className="order-id" align="left">
                    <div className="info">
                      <MuiCardMedia
                        component="img"
                        src="https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3VycmVuY3l8ZW58MHwxfDB8fHww&auto=format&fit=crop&w=400&q=60"
                        className="img"
                        width="50px"
                        height="50px"
                      />
                      <div className="details">
                        <MuiTypography variant="body2" className="product-name">
                          {row?.branch}
                        </MuiTypography>
                        <MuiTypography variant="body2" className="list-id">
                          {" "}
                          Listing ID: #{row?.id}{" "}
                        </MuiTypography>
                      </div>
                    </div>
                  </MuiTableCell>
                  <MuiTableCell align="left">Appliances</MuiTableCell>
                  <MuiTableCell align="left">{row?.branch}</MuiTableCell>
                  <MuiTableCell align="left">
                    <SettlementStatus
                      style={{
                        display: "inline-block",
                        width: "100%",
                        border: "none",
                      }}
                      type={row?.settlement?.toLowerCase() as ISettlementStatus}
                    />
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    <MuiIconButton
                      onClick={handleViewDetails(row?.id)}
                      className="visible-btn">
                      <IconVisibility />
                    </MuiIconButton>
                  </MuiTableCell>
                </MuiTableRow>
              ))}

              {/* {!isLoading && data && data?.length === 0 && !isError && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={8}
                    align="center"
                    className="no-data-cell"
                    rowSpan={20}>
                    <NoData
                      title="No order yet"
                      message="Recent orders will appear here"
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )} */}

              {/* {isError && !data && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={8}
                    className="no-data-cell"
                    align="center">
                    <NoData
                      title="An Error Occurred"
                      message="Sorry, we couldn't fetch your orders. Try again later or contact Rensa support."
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )} */}

              {/* {!data && isLoading && (
                <CustomTableSkeleton columns={8} rows={10} />
              )} */}
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
