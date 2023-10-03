import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiButton,
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

import CardService from "@/services/branches.service";

import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";
import { createPaginationData, formatCurrency } from "utils/helper-funcs";
import { format } from "date-fns";
import TableWrapper from "@/components/table/TableWrapper";
import { IconOrder, IconVisibility } from "@/lib/mui.lib.icons";
import CustomTabs from "@/components/other/CustomTabs";
import CustomTab from "@/components/other/CustomTab";
import CustomSearch from "@/components/input/CustomSearch";

import { TotalCard } from "@/components/index";
import OrderService from "@/services/order-service";
import {
  IOrderDetails,
  IOrderTotalStats,
  IPagination,
  IStatus,
} from "@/types/globalTypes";
import { OrderIcon, OrderStatus } from "@/components/feedback/OrderStatus";

type IProps = {
  variant?: "page" | "section" | "home" | "cards";
  page: "orders" | "dashboard" | "branches" | "branch-order";
};

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

export function RiderOrderTable() {
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const { pathname } = useLocation();

  const [current, setCurrent] = React.useState(() => {
    return 1;
  });

  const handleChangeIndex = (index: number) => () => {
    setCurrent(index);
  };

  const { data, isLoading, isError } = useQuery(
    ["all-orders", pagination.page, pagination.pageSize],
    () =>
      OrderService.getAll(
        `?page=${pagination.page}&perPage=${pagination.pageSize}`
      ).then((res) => {
        const data = res.data?.data;

        // const { hasNextPage, hasPrevPage, total, totalPages } =
        //   createPaginationData(data, pagination);

        // setPagination((prev) => ({
        //   ...prev,
        //   total,
        //   totalPages,
        //   hasNextPage,
        //   hasPrevPage,
        // }));

        return data as IOrderDetails[];
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const { data: orderStatsData } = useQuery(
    ["all-rider-order"],
    () =>
      OrderService.getTotals().then((res) => {
        const data = res.data?.data;

        // const { hasNextPage, hasPrevPage, total, totalPages } =
        //   createPaginationData(data, pagination);

        // setPagination((prev) => ({
        //   ...prev,
        //   total,
        //   totalPages,
        //   hasNextPage,
        //   hasPrevPage,
        // }));

        return data as IOrderTotalStats;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  // const handleChange = (page: number) => {
  //   setPagination((prev: any) => ({ ...prev, page }));
  // };

  const handleViewDetails = (data: any) => () => {
    navigate(`${data?.id}`, {
      state: data,
    });
  };

  return (
    <StyledPage>
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Rider's Orders
          </MuiTypography>
          <MuiTypography
            className="total"
            fontWeight="600"
            color="secondary"
            variant="body2">
            {data?.length || 0}
          </MuiTypography>
        </div>
        <div className="action-section">
          <CustomSearch placeholder="Search rider name" />
        </div>
      </div>

      <TableWrapper showPagination>
        <MuiTableContainer
          sx={{
            maxWidth: "100%",
            minHeight: data?.length === 0 ? "inherit" : "unset",
          }}>
          <MuiTable
            sx={{
              minWidth: 750,
              minHeight: data?.length === 0 ? "inherit" : "unset",
            }}
            aria-label="simple table">
            <MuiTableHead>
              <MuiTableRow>
                <MuiTableCell className="heading" align="left"></MuiTableCell>
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "150px" }}>
                  Order Id
                </MuiTableCell>
                <MuiTableCell className="heading">Customer</MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Date Created
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Scheduled Date
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Vendor
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Amount
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Schedule
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Status
                </MuiTableCell>
                <MuiTableCell className="heading" align="center"></MuiTableCell>
              </MuiTableRow>
            </MuiTableHead>

            <MuiTableBody>
              {!isLoading &&
                data &&
                data?.map((row) => (
                  <MuiTableRow
                    key={row?.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}>
                    {" "}
                    <MuiTableCell align="left">
                      <OrderIcon type={row?.status as IStatus} />
                    </MuiTableCell>
                    <MuiTableCell className="order-id" align="left">
                      Order <b>#{row?.order_id}</b>
                    </MuiTableCell>
                    <MuiTableCell>{row?.user?.full_name || "-"}</MuiTableCell>
                    <MuiTableCell align="left">
                      {format(new Date(row?.created_at || ""), "LL MMMM, yyyy")}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {format(new Date(row?.created_at || ""), "LL MMMM, yyyy")}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {row?.partner?.name}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      ₦
                      {formatCurrency({
                        amount: row?.total_product_price,
                        style: "decimal",
                      })}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {row?.scheduled ? "Yes" : "No"}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      <OrderStatus
                        type={row?.status?.toLowerCase() as IStatus}
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
                    colSpan={9}
                    align="center"
                    className="no-data-cell"
                    rowSpan={20}>
                    <NoData
                      title="No order yet"
                      message="Recent orders will appear here"
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {isError && !data && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={9}
                    className="no-data-cell"
                    align="center">
                    <NoData
                      title="An Error Occurred"
                      message="Sorry, we couldn't fetch your orders. Try again later or contact Rensa support."
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {!data && isLoading && (
                <CustomTableSkeleton columns={9} rows={10} />
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

  & .cards {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;

    & .card {
      width: calc((100% - 80px) / 5);
    }
  }

  & .top-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    & .heading {
      font-weight: 700;
    }

    & .view-all {
      height: fit-content;
      min-height: fit-content;
      font-family: "Helvetica";
    }

    & .card-name {
      font-weight: 600;
      color: #000;
      font-size: 14px;
      font-family: "Helvetica";
    }
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 25px 0;
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
