import * as React from "react";
import { useNavigate } from "react-router-dom";
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

import { IPagination } from "@/types/globalTypes";
import CardService from "@/services/branches.service";

import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";
import { createPaginationData, formatCurrency } from "utils/helper-funcs";
import { format } from "date-fns";
import TableWrapper from "@/components/table/TableWrapper";
import { IconOrder, IconVisibility } from "@/lib/mui.lib.icons";
import CustomTabs from "@/components/other/CustomTabs";
import CustomTab from "@/components/other/CustomTab";
import CustomSearch from "@/components/input/CustomSearch";
import { OrderIcon, OrderStatus } from "./OrderStatus";
import { IStatus } from "../types";

type IProps = {
  variant?: "page" | "section" | "home" | "cards";
};

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
    status: "settled",
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
    status: "pending",
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
    status: "pending",
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
    status: "settled",
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
    status: "settled",
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

export function SettlementTable() {
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  const [current, setCurrent] = React.useState(() => {
    return 0;
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
    navigate(`/app/orders/${id}`);
  };

  return (
    <StyledPage>
      <div className="tab-section">
        <CustomTabs variant="fullWidth" value={current || 0} className="tabs">
          <CustomTab
            onClick={handleChangeIndex(0)}
            value={0}
            label="All"
            current={current}
          />
          <CustomTab
            onClick={handleChangeIndex(1)}
            value={1}
            label="Pending"
            current={current}
          />
          <CustomTab
            onClick={handleChangeIndex(2)}
            value={2}
            label="Settled"
            current={current}
          />
        </CustomTabs>

        <CustomSearch placeholder="Search order ID" />
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
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "150px" }}>
                  Order Id
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Date Created
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Order Amount
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Service fee
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Amount settled
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Settlement status
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
                    Order <b>#{row?.id}</b>
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    {format(new Date(row?.created_at || ""), "LL MMMM, yyyy")}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦{" "}
                    {formatCurrency({ amount: row?.amount, style: "decimal" })}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    {" "}
                    ₦{" "}
                    {formatCurrency({
                      amount: row?.service_fee,
                      style: "decimal",
                    })}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    ₦{" "}
                    {formatCurrency({
                      amount: row?.amount_settled,
                      style: "decimal",
                    })}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    <OrderStatus type={row?.status?.toLowerCase() as IStatus} />
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

  & .top-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

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
