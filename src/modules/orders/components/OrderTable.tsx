import { AxiosPromise } from "axios";
import { format } from "date-fns";
import * as React from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

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
import TableWrapper from "@/components/table/TableWrapper";
import {
  IconChevronLeft,
  IconChevronRight,
  IconGridActive,
  IconGridInactive,
  IconListActive,
  IconListInactive,
  IconVisibility,
} from "@/lib/mui.lib.icons";
import {
  createPaginationData,
  formatCurrency,
  formatDate,
  getIdName,
} from "@/utils/helper-funcs";

import CustomSearch from "@/components/input/CustomSearch";

import { OrderStatus } from "@/components/feedback/OrderStatus";
import { TotalCard } from "@/components/index";
import StatusFilter from "@/components/select/StatusFillter";
import useCachedDataStore from "@/config/store-config/lookup";
import OrderService from "@/services/order-service";
import {
  IOrderData,
  IOrderResponse,
  IPagination,
  IStatus
} from "@/types/globalTypes";
import throttle from "lodash.throttle";
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
    query?: string,
    signal?: AbortSignal
  ) => AxiosPromise<IOrderResponse>;
  id?: string;
  queryKey?: string;
  viewMode?: "grid" | "list";
  title?: string;
  showPagination?: boolean;
  showFilter?: boolean;
  showViewMore?: boolean;
  showMetrics?: boolean;
  orderDate?: string;
};

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 0,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 0,
};
const ONE_DAY_TIME = 1000 * 60 * 60 * 24;

const constructOrderKey = (date: Date | string) => {
  const _date = new Date(date || "");
  const constructedKey = `${_date?.getDate()}_${
    _date?.getMonth() + 1
  }_${_date?.getFullYear()}`;

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
  orderDate = "",
}: IProps) {
  const { catalogueOrderStatus } = useCachedDataStore(
    (state) => state.cache?.lookup
  );

  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const { pathname } = useLocation();

  const calendarRef = React.useRef<any>();
  const [filter, setFilter] = React.useState<number[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const [text, setText] = React.useState("");

  const [date, setDate] = React.useState<{ year: number; month: number }>(
    () => {
      const today = new Date();
      return {
        month: today.getMonth(),
        year: today.getFullYear(),
      };
    }
  );
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
    [queryKey, id, filter, pagination.page, pagination.pageSize, text],
    ({ signal }) =>
      apiFunc(
        `?pageNumber=${pagination.page}&pageSize=${
          pagination?.pageSize
        }&searchText=${text}${
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

  const { data: calendarOrders, isLoading: calendarOrdersLoading } = useQuery(
    [queryKey, id, date.month, date.year],
    () =>
      OrderService.getByMonthAndYear(
        `?month=${date.month + 1}&year=${date?.year}`
      ).then((res) => {
        const data = res.data?.result;

        const orderSortedByDate = data?.reduce((acc, val) => {
          const constructedKey = `${val.day}_${val?.month}_${val?.year}`;

          acc[constructedKey] = val?.totalCount;

          return acc;
        }, {} as { [key: string]: number });

        return orderSortedByDate;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: view === "grid",
    }
  );

  const { data: orderStatsData } = useQuery(
    ["all-orders-stats"],
    () =>
      OrderService.getTotals().then((res) => {
        const data = res.data?.result;

        return data;
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

  const handleViewDetails = (data: IOrderData) => () => {
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
    setDate({ month: selectedMonth, year: selectedYear });
  };

  const handleViewMore = () => {
    navigate("/app/orders");
  };

  const handleSetSearchText = (value: string) => () => {
    // if (value) {
    setSearchText(value);
    // }
  };

  const throttleChangeHandler = React.useMemo(
    () => throttle(handleSetSearchText(text), 600),
    [text]
  );

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    throttleChangeHandler();
    setText(value);
  };

  return (
    <StyledPage>
      {showMetrics && (
        <div className="cards">
          <TotalCard
            className="card"
            title=""
            variant="order"
            // showFilter={false}
            defaultValue={orderStatsData?.pending}
            filterType="status"
            statusType="pending"
          />
          <TotalCard
            className="card"
            title=""
            variant="order"
            // showFilter={false}
            defaultValue={orderStatsData?.cancelled}
            filterType="status"
            statusType="cancelled"
          />
          <TotalCard
            className="card"
            title=""
            variant="order"
            // showFilter={false}
            defaultValue={orderStatsData?.inTransit}
            filterType="status"
            statusType="intransit"
          />
          <TotalCard
            className="card"
            title=""
            variant="order"
            // showFilter={false}
            defaultValue={orderStatsData?.pendingCancellation}
            filterType="status"
            statusType="pending_cancellation"
          />
          <TotalCard
            className="card"
            title=""
            variant="order"
            // showFilter={false}
            defaultValue={orderStatsData?.delivered}
            filterType="status"
            statusType="delivered"
          />
          <TotalCard
            className="card"
            title="Total Orders"
            variant="order"
            showFilter={false}
            defaultValue={orderStatsData?.total}
            filterType="minimal"
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
            {view === "list" && (
              <>
                <StatusFilter
                  selectedValue={filter}
                  handleSetValue={handleSetFilter}
                  options={catalogueOrderStatus}
                />
                <CustomSearch
                  placeholder="Search Order ID, name or description"
                  value={text}
                  onChange={handleChangeText}
                />
              </>
            )}
            {view === "grid" && (
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
            )}

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
              const numberOfOrders = calendarOrders
                ? calendarOrders?.[orderKey]
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
        <TableWrapper showPagination={showPagination} pagination={pagination} handleChangePagination={handleChange}  >
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
                  <MuiTableCell
                    className="heading"
                    align="center"></MuiTableCell>
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
                        {/* <OrderIcon type={row?.status as IStatus} /> */}
                      </MuiTableCell>
                      <MuiTableCell className="order-id" align="left">
                        <b>#{row?.orderNumber}</b>
                      </MuiTableCell>
                      <MuiTableCell>{row?.catalogueName || "-"}</MuiTableCell>
                      <MuiTableCell align="left">
                        {row?.firstName} {row?.lastName}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        {formatDate(row?.creationTime)}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        {formatDate(row?.deliveryDate)}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        ₦
                        {formatCurrency({
                          amount: row?.maxTotalAmount,
                          style: "decimal",
                        })}
                      </MuiTableCell>

                      <MuiTableCell align="left">
                        <OrderStatus
                          type={
                            getIdName(
                              row?.status,
                              catalogueOrderStatus
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
                  ))}

                {!isLoading && data && data?.length === 0 && !isError && (
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
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 30px;

    & .card {
      width: calc((100% - 50px) / 6);
    }

    display: grid;
    gap: 10px;
    /* grid-template-columns: repeat(5, minmax(auto-fit, 200px)); */
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

    & .card {
      /* width: calc((100% - 40px) / 5); */
      width: 100%;
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

    @media screen and (max-width: 700px) {
      & .orders {
        font-size: 10px;
        min-width: 20px;
      }

      & abbr {
        font-size: 12px;
      }
    }

    @media screen and (max-width: 500px) {
      & .react-calendar > button {
        display: flex;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
      }
    }
  }

  & .action-section {
    flex: 1;
    display: flex;
    gap: 10px;
    justify-content: end;
    align-items: center;
    max-width: 700px;
    flex-wrap: wrap;
  }
  & .top-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

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
    flex-wrap: wrap;
    gap: 20px;
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

  @media screen and (max-width: 500px) {
    & .calendar {
      width: 100%;
      padding: 0;
      margin: 30px auto;
      border-radius: 10px;
      border: none;
    }
  }
`;
