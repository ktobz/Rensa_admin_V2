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

import { IPagination, IStatus } from "@/types/globalTypes";

import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";
import { formatCurrency } from "utils/helper-funcs";
import { format } from "date-fns";
import TableWrapper from "@/components/table/TableWrapper";
import { IconOrder, IconVisibility } from "@/lib/mui.lib.icons";
import CustomTabs from "@/components/other/CustomTabs";
import CustomTab from "@/components/other/CustomTab";
import CustomSearch from "@/components/input/CustomSearch";
import { TotalCard } from "@/components/index";
import { OrderIcon } from "@/components/feedback/OrderStatus";

type IProps = {
  variant?: "page" | "section" | "home" | "cards";
  page: "orders" | "dashboard" | "branches" | "branch-order";
};

const data = [
  {
    id: "43579",
    customer: "Timothy Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Lekki Branch",
    amount: 23000,
    status: "new",
    scheduled: true,
  },
  {
    id: "4358",
    customer: "Jame Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "John Branch",
    amount: 23000,
    status: "picked-up",
    scheduled: false,
  },
  {
    id: "43577",
    customer: "Peter Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Ajah Branch",
    amount: 23000,
    status: "cancelled",
    scheduled: true,
  },
  {
    id: "43570",
    customer: "Timothy Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Lekki Branch",
    amount: 2300,
    status: "delivered",
    scheduled: true,
  },
  {
    id: "43589",
    customer: "Timothy OrbJamesik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "James Branch",
    amount: 23000,
    status: "confirmed",
    scheduled: false,
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

export function IncomeTable() {
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const { pathname } = useLocation();

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  const [current, setCurrent] = React.useState(() => {
    return 1;
  });

  const handleChangeIndex = (index: number) => () => {
    setCurrent(index);
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
    return;
  };

  return (
    <StyledPage>
      <div className="cards">
        <TotalCard
          className="card"
          title="Total Sales (Count)"
          variant="sales"
          showFilter
          filterType="standard"
        />
        <TotalCard
          className="card"
          title="Total Sales (Amount)"
          variant="sales"
          showFilter
          filterType="standard"
        />
        <TotalCard
          className="card"
          title="Revenue"
          variant="sales"
          showFilter
          filterType="standard"
        />
      </div>
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            All Sales
          </MuiTypography>
        </div>
        <div className="action-section">
          <CustomSearch placeholder="Search order ID" />
        </div>
      </div>

      {/* 
        <CustomTabPanel index={current} value={0}></CustomTabPanel>
        <CustomTabPanel index={current} value={3}></CustomTabPanel>
        <CustomTabPanel index={current} value={4}></CustomTabPanel> */}
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
              flex: 1,
            }}
            aria-label="simple table">
            <MuiTableHead>
              <MuiTableRow>
                <MuiTableCell className="heading" align="left"></MuiTableCell>
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
                  Buyers Ser. fee
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
                  <MuiTableCell align="left">
                    <OrderIcon type={row?.status as IStatus} />
                  </MuiTableCell>
                  <MuiTableCell className="order-id" align="left">
                    Order <b>#{row?.id}</b>
                  </MuiTableCell>
                  <MuiTableCell>
                    {format(new Date(row?.created_at || ""), "LL MMMM, yyyy")}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦{formatCurrency({ amount: row?.amount, style: "decimal" })}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦{formatCurrency({ amount: row?.amount, style: "decimal" })}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦{formatCurrency({ amount: row?.amount, style: "decimal" })}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦{formatCurrency({ amount: row?.amount, style: "decimal" })}
                  </MuiTableCell>
                  <MuiTableCell
                    align="left"
                    style={{ color: "#45B26B", fontWeight: "700" }}>
                    ₦{formatCurrency({ amount: row?.amount, style: "decimal" })}
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

  & .cards {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;

    & .card {
      width: calc((100% - 45px) / 3);
    }
  }

  & .top-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

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
