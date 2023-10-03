import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import { format } from "date-fns";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiIconButton,
  MuiTable,
  MuiTableBody,
  MuiTableCell,
  MuiTableContainer,
  MuiTableHead,
  MuiTableRow,
  MuiTypography,
  styled,
} from "@/lib/index";

import CustomTableSkeleton from "@/components/skeleton/CustomTableSkeleton";
import { formatCurrency } from "@/utils/helper-funcs";
import TableWrapper from "@/components/table/TableWrapper";
import { IconVisibility } from "@/lib/mui.lib.icons";
import CustomTabs from "@/components/other/CustomTabs";
import CustomTab from "@/components/other/CustomTab";
import CustomSearch from "@/components/input/CustomSearch";

import { TotalCard } from "@/components/index";
import OrderService from "@/services/order-service";
import {
  IOrderDetails,
  IOrderQuery,
  IOrderTotalStats,
  IPagination,
  IStatus,
} from "@/types/globalTypes";
import { OrderIcon, OrderStatus } from "@/components/feedback/OrderStatus";
import StatusFilter from "@/components/select/StatusFillter";

type IProps = {
  variant?: "page" | "section" | "home" | "cards";
  page: "orders" | "dashboard" | "branches" | "branch-order";
  apiFunc?: (
    id: string | number,
    query?: IOrderQuery
  ) => Promise<AxiosResponse<any, any>>;
  id?: string;
  queryKey?: string;
};

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

export function OrderTable({
  variant = "page",
  page,
  apiFunc = OrderService.getAll,
  id = "",
  queryKey = "all-orders",
}: IProps) {
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const { pathname } = useLocation();

  const [filter, setFilter] = React.useState<number[]>([]);

  const handleSetFilter = (values: number[]) => {
    setFilter(values);
  };

  const { data, isLoading, isError } = useQuery(
    [queryKey, id, filter, pagination.page, pagination.pageSize],
    () =>
      apiFunc(id, {
        currentPage: pagination.page,
        status: filter,
      }).then((res) => {
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
    ["all-orders-stats"],
    () =>
      OrderService.getTotals().then((res) => {
        const data = res.data?.data;

        return data as IOrderTotalStats;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: variant === "page" && page !== "branch-order",
    }
  );

  const handleChange = (page: number) => {
    setPagination((prev: any) => ({ ...prev, page }));
  };

  const handleViewDetails = (data: any) => () => {
    if (page === "dashboard") {
      navigate(`/app/orders/${data?.id}`, {
        state: data,
      });
    }

    if (page === "branches") {
      navigate(`${pathname}/orders/${data?.id}`, {
        state: data,
      });
    }

    if (page === "orders" || page === "branch-order") {
      navigate(`${data?.id}`, {
        state: data,
      });
    }
  };

  return (
    <StyledPage>
      {variant === "page" && page !== "branch-order" && (
        <>
          <div className="cards">
            <TotalCard
              className="card"
              title="New Orders"
              variant="order"
              // showFilter={false}
              defaultValue={orderStatsData?.new_orders}
              filterType="status"
              statusType="new"
            />
            <TotalCard
              className="card"
              title="Cancelled Orders"
              variant="order"
              // showFilter={false}
              defaultValue={orderStatsData?.confirmed_orders}
              filterType="status"
              statusType="cancelled"
            />
            <TotalCard
              className="card"
              title="Delivered Orders"
              variant="order"
              // showFilter={false}
              defaultValue={orderStatsData?.pickup_orders}
              filterType="status"
              statusType="delivered"
            />
          </div>

          <div className="tab-section">
            <div className="top-section">
              <MuiTypography variant="body2" className="heading">
                Recent Orders
              </MuiTypography>
            </div>
            <div className="action-section">
              <StatusFilter
                selectedValue={filter}
                handleSetValue={handleSetFilter}
              />
              <CustomSearch placeholder="Search order ID, customer name, vendor name" />
            </div>
          </div>
        </>
      )}

      <TableWrapper showPagination={variant === "page"}>
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
                <MuiTableCell className="heading" align="left"></MuiTableCell>
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "150px" }}>
                  Order Id
                </MuiTableCell>

                <MuiTableCell
                  className="heading"
                  style={{ minWidth: "100px" }}
                  align="left">
                  Item name
                </MuiTableCell>
                <MuiTableCell
                  className="heading"
                  style={{ minWidth: "100px" }}
                  align="left">
                  Buyer
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Date Created
                </MuiTableCell>

                <MuiTableCell className="heading" align="left">
                  Schedule Date
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Amount
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
                    <MuiTableCell align="left">
                      <OrderIcon type={row?.status as IStatus} />
                    </MuiTableCell>
                    <MuiTableCell className="order-id" align="left">
                      Order <b>#{row?.order_id}</b>
                    </MuiTableCell>
                    <MuiTableCell>{row?.user?.first_name || "-"}</MuiTableCell>
                    <MuiTableCell align="left">
                      {row?.user?.full_name || "-"}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {" "}
                      {format(new Date(row?.created_at || ""), "LL MMMM, yyyy")}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {row?.delivery_pickup_date}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      ₦
                      {formatCurrency({
                        amount: row?.total_product_price,
                        style: "decimal",
                      })}
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
                    rowSpan={15}>
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
                    rowSpan={15}
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
    margin-bottom: 30px;

    & .card {
      width: calc((100% - 40px) / 3);
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
    gap: 20px;
    justify-content: space-between;
    align-items: center;

    & .heading {
      font-weight: 600;
      color: #000;
      font-size: 18px;
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
