import * as React from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

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
  styled
} from "@/lib/index";

import { IPagination, ISalesData } from "@/types/globalTypes";

import { TotalCard } from "@/components/index";
import CustomSearch from "@/components/input/CustomSearch";
import TableWrapper from "@/components/table/TableWrapper";
import useCachedDataStore from "@/config/store-config/lookup";
import { IconVisibility } from "@/lib/mui.lib.icons";
import TransactionService from "@/services/transaction-service";
import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";
import throttle from "lodash.throttle";
import {
  createPaginationData,
  formatCurrency,
  formatDate,
} from "utils/helper-funcs";

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

export function IncomeTable() {
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);
  const { pathname } = useLocation();

  const { dashboardFilter } = useCachedDataStore(
    (state) => state.cache?.lookup
  );
  const transformedFilter = dashboardFilter
    ?.map((x) => ({
      ...x,
      name: x?.name?.replace(/([a-z])([A-Z])/g, "$1 $2"),
    }))
    ?.filter((x) => x?.name?.toLowerCase() !== "active");

  const [searchText, setSearchText] = React.useState("");
  const [text, setText] = React.useState("");

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  const [current, setCurrent] = React.useState(() => {
    return 1;
  });

  const handleChangeIndex = (index: number) => () => {
    setCurrent(index);
  };

  const { data, isLoading, isError } = useQuery(
    ["sales-revenue", pagination.page, pagination.pageSize, text],
    ({ signal }) =>
      TransactionService.getAllSales(
        `?pageNumber=${pagination.page}&pageSize=${pagination.pageSize}&searchText=${text}`,
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
    }
  );

  const handleChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewDetails = (sales: ISalesData) => () => {
    navigate(`/app/orders/${sales?.id}`);
  };

  const handleSetSearchText = (value: string) => () => {
    if (value) {
      setSearchText(value);
    }
  };

  const throttledChangeHandler = React.useMemo(
    () => throttle(handleSetSearchText(text), 600),
    [text]
  );

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setText(value);
    throttledChangeHandler();
  };

  return (
    <StyledPage>
      <div className="cards">
        <TotalCard
          className="card"
          title="Total Sales (Count)"
          variant="order"
          showFilter
          filterType="minimal"
          defaultOptions={transformedFilter}
          queryKey="sales-total"
          serviceFunc={TransactionService.salesCount}
          defaultOptionId={5}
        />
        <TotalCard
          className="card"
          title="Total Sales (Amount)"
          variant="sales"
          showFilter
          filterType="minimal"
          defaultOptions={transformedFilter}
          queryKey="sales-amount"
          serviceFunc={TransactionService.salesAmount}
          defaultOptionId={5}
        />
        <TotalCard
          className="card"
          title="Revenue"
          variant="sales"
          showFilter
          filterType="minimal"
          defaultOptions={transformedFilter}
          queryKey="sales-revenue"
          serviceFunc={TransactionService.salesRevenue}
          defaultOptionId={5}
        />
      </div>
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            All Sales
          </MuiTypography>
        </div>
        <div className="action-section">
          <CustomSearch
            placeholder="Search order ID"
            value={text}
            onChange={handleChangeText}
          />
        </div>
      </div>

      <TableWrapper handleChangePagination={handleChange} showPagination pagination={pagination}>
        <MuiTableContainer
          sx={{
            maxWidth: "100%",
            minHeight: data?.length === 0 ? "inherit" : "unset",
          }}>
          <MuiTable
            sx={{
              minWidth: 750,
              minHeight: data?.length === 0 ? "inherit" : "unset",
              flex: 1,
            }}
            aria-label="simple table">
            <MuiTableHead>
              <MuiTableRow>
                {/* <MuiTableCell className="heading" align="left"></MuiTableCell> */}
                <MuiTableCell className="heading" align="left">
                  Order ID
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Date Created
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Item amount
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Delivery fee
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Buyer's Ser. fee
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Seller's Ser. fee
                </MuiTableCell>

                <MuiTableCell className="heading" align="left">
                  Sellers settl.
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Revenue
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
                  {/* <MuiTableCell align="left">
                    <OrderIcon type={row?. as IStatus} /> -
                  </MuiTableCell> */}
                  <MuiTableCell className="order-id" align="left">
                    Order <b>#{row?.orderNumber}</b>
                  </MuiTableCell>
                  <MuiTableCell>
                    {formatDate(row?.creationTime || "")}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦
                    {formatCurrency({
                      amount: row?.itemAmount,
                      style: "decimal",
                    })}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦
                    {formatCurrency({
                      amount: row?.maxDeliveryFee,
                      style: "decimal",
                    })}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦
                    {formatCurrency({
                      amount: row?.buyerServiceFee,
                      style: "decimal",
                    })}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦
                    {formatCurrency({
                      amount: row?.sellerServiceFee,
                      style: "decimal",
                    })}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦
                    {formatCurrency({
                      amount: row?.sellerSettlement,
                      style: "decimal",
                    })}
                  </MuiTableCell>
                  <MuiTableCell
                    align="left"
                    style={{ color: "#45B26B", fontWeight: "700" }}>
                    ₦
                    {formatCurrency({ amount: row?.revenue, style: "decimal" })}
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
                      title="No sales yet"
                      message="Recent sales will appear here"
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
                      message="Sorry, we couldn't fetch sales revenue. Try again later or contact Rensa support."
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {!data && isLoading && (
                <CustomTableSkeleton columns={8} rows={10} />
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
    display: grid;
    gap: 10px;
    /* grid-template-columns: repeat(5, minmax(auto-fit, 200px)); */
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

    & .card {
      /* width: calc((100% - 40px) / 5); */
      width: 100%;
    }
  }

  /* & .cards {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;

    & .card {
      width: calc((100% - 45px) / 3);
    }
  } */

  & .top-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
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
`;
