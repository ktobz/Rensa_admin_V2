import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import { format } from "date-fns";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiButton,
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
import { formatCurrency, formatDate } from "@/utils/helper-funcs";
import TableWrapper from "@/components/table/TableWrapper";
import {
  IconVisibility,
  IconGridActive,
  IconGridInactive,
  IconListActive,
  IconListInactive,
  IconChevronLeft,
  IconChevronRight,
} from "@/lib/mui.lib.icons";
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
import Calendar from "react-calendar";

const DATE_LIST = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type IProps = {
  variant?: "page" | "section" | "home" | "cards";
  page: "orders" | "dashboard" | "branches" | "branch-order";
  apiFunc?: (
    id: string | number,
    query?: IOrderQuery
  ) => Promise<AxiosResponse<any, any>>;
  id?: string;
  queryKey?: string;
  viewMode?: "grid" | "list";
  title?: string;
  showPagination?: boolean;
  showFilter?: boolean;
  showViewMore?: boolean;
  showMetrics?: boolean;
};

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};
const ONE_DAY_TIME = 1000 * 60 * 60 * 24;

const constructOrderKey = (date: Date | string) => {
  const _date = new Date(date || "");
  const constructedKey = `${_date?.getDate()}_${_date?.getMonth()}_${_date?.getFullYear()}`;

  return constructedKey;
};

export function OrderTable({
  variant = "page",
  page,
  apiFunc = OrderService.getAll,
  id = "",
  queryKey = "all-orders",
  viewMode = "grid",
  title = "Recent Orders",
  showFilter = false,
  showPagination = false,
  showViewMore = false,
  showMetrics = false,
}: IProps) {
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const { pathname } = useLocation();

  const calendarRef = React.useRef<any>();
  const [filter, setFilter] = React.useState<number[]>([]);
  const [view, setView] = React.useState(viewMode);
  const [currentDate, setCurrentDate] = React.useState(() => {
    const today = new Date();
    const defaultDate = `${
      DATE_LIST[today.getMonth()]
    } ${new Date()?.getFullYear()}`;

    return { date: today, dateString: defaultDate };
  });

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
        const data = res.data?.data as IOrderDetails[];

        const orderSortedByDate = data?.reduce((acc, val) => {
          const constructedKey = constructOrderKey(val?.created_at);
          if (constructedKey in acc) {
            acc[constructedKey] += 1;
          } else {
            acc[constructedKey] = 1;
          }
          return acc;
        }, {} as { [key: string]: number });

        // const { hasNextPage, hasPrevPage, total, totalPages } =
        //   createPaginationData(data, pagination);

        // setPagination((prev) => ({
        //   ...prev,
        //   total,
        //   totalPages,
        //   hasNextPage,
        //   hasPrevPage,
        // }));

        return {
          orderList: data,
          orderSortedByDate,
        };
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
      enabled: showFilter,
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

  const handleToggleView = (view: "grid" | "list") => () => {
    setView(view);
  };
  const handleNavigateToSchedule = (value: Date, event: any) => {
    const date = value?.toJSON();
    navigate(`scheduled-orders/?date=${date}`);
  };

  const handleChangeMonth = (dir: "next" | "prev") => () => {
    const current = { ...currentDate };
    const currentMonth = current?.date?.getMonth();
    const currentYear = current?.date?.getFullYear();
    let selectedMonth = 0;
    let selectedYear = 2023;
    if (dir === "prev") {
      selectedMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      selectedYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    } else {
      selectedMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      selectedYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    }

    setCurrentDate((prev) => ({
      ...prev,
      date: new Date(selectedYear, selectedMonth, 1),
      dateString: `${DATE_LIST[selectedMonth]} ${selectedYear}`,
    }));
  };

  const handleViewMore = () => {
    navigate("/app/orders");
  };

  return (
    <StyledPage>
      {showMetrics && (
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
      )}

      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            {title}
          </MuiTypography>
          {showViewMore && (
            <MuiButton
              onClick={handleViewMore}
              className="view-all"
              variant="text">
              View all
            </MuiButton>
          )}
        </div>
        {showFilter && (
          <div className="action-section">
            <StatusFilter
              selectedValue={filter}
              handleSetValue={handleSetFilter}
            />
            <CustomSearch placeholder="Search order ID, customer name, vendor name" />

            <div className="toggle-mode">
              <MuiIconButton
                className="mode-btn"
                onClick={handleToggleView("grid")}>
                {view === "grid" ? <IconGridActive /> : <IconGridInactive />}
              </MuiIconButton>
              <MuiIconButton
                className="mode-btn"
                onClick={handleToggleView("list")}>
                {view === "list" ? <IconListActive /> : <IconListInactive />}
              </MuiIconButton>
            </div>
          </div>
        )}
      </div>

      {view == "grid" && showFilter ? (
        <>
          <div className="calendar-nav">
            <MuiIconButton
              className="nav-btn"
              onClick={handleChangeMonth("prev")}>
              <IconChevronLeft />
            </MuiIconButton>
            <MuiTypography variant="body2" className="nav-date">
              {currentDate?.dateString}
            </MuiTypography>
            <MuiIconButton
              className="nav-btn"
              onClick={handleChangeMonth("next")}>
              <IconChevronRight />
            </MuiIconButton>
          </div>
          <Calendar
            ref={calendarRef}
            className="calendar"
            showNavigation={false}
            view="month"
            formatShortWeekday={(locale: any, date: Date) =>
              format(date, "EEEE")
            }
            activeStartDate={currentDate?.date}
            onClickDay={handleNavigateToSchedule}
            // showNeighboringMonth={false}
            tileContent={(v) => {
              const orderKey = constructOrderKey(v.date);
              const numberOfOrders = data
                ? data?.orderSortedByDate?.[orderKey]
                : 0;
              if (!!numberOfOrders) {
                return (
                  <MuiTypography
                    variant="body2"
                    className={`orders ${
                      v?.date?.getTime() + ONE_DAY_TIME < new Date()?.getTime()
                        ? "old"
                        : ""
                    }`}>
                    {numberOfOrders}
                  </MuiTypography>
                );
              }

              return null;
            }}
          />
        </>
      ) : (
        <TableWrapper showPagination={showPagination}>
          <MuiTableContainer
            sx={{
              maxWidth: "100%",
              minHeight: data?.orderList?.length === 0 ? "inherit" : "unset",
              flex: 1,
            }}>
            <MuiTable
              sx={{
                minWidth: 750,
                minHeight: data?.orderList?.length === 0 ? "inherit" : "unset",
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
                  <MuiTableCell
                    className="heading"
                    align="center"></MuiTableCell>
                </MuiTableRow>
              </MuiTableHead>

              <MuiTableBody>
                {!isLoading &&
                  data &&
                  data?.orderList?.map((row) => (
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
                      <MuiTableCell>
                        {row?.user?.first_name || "-"}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        {row?.user?.full_name || "-"}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        {formatDate(row?.created_at)}
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

                {!isLoading &&
                  data &&
                  data?.orderList?.length === 0 &&
                  !isError && (
                    <MuiTableRow>
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
      )}
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

  & .toggle-mode {
    display: flex;
    gap: 5px;
    align-items: center;
    margin-left: 10px;

    & .mode-btn {
      background: #fbfbfb;
      border-radius: 10px;
      padding: 6px 8px;

      & svg {
        width: 25px;
        height: 25px;
      }
    }
  }

  & .calendar-nav {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: end;

    & .nav-btn {
      background-color: #fb651e;
      border-radius: 10px;
      color: #fff;
      height: 30px;
      width: 32px;
      padding: 0;
    }

    & .nav-date {
      background-color: #fbfbfb;
      padding: 5px 10px;
      font-weight: 600;
      border-radius: 10px;
    }
  }

  & .calendar {
    width: 100%;
    padding: 20px;
    margin: 30px auto;
    border-radius: 10px;
    border: 1px solid #f4f4f4;

    & abbr {
      text-decoration: none;
    }

    & .orders {
      align-self: end;
      padding: 4px 10px;
      border-radius: 30px;
      background-color: #fb651e;
      color: #fff;
      font-size: 12px;
      min-width: 35px;
    }

    & .old {
      background-color: #777e90;
    }

    & .react-calendar > button {
      display: flex;
      flex-direction: column !important;
      justify-content: space-between !important;
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
