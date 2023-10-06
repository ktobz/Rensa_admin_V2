import * as React from "react";
import { useQuery } from "react-query";
import { format } from "date-fns";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiBox,
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
import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";
import { formatCurrency } from "utils/helper-funcs";
import TableWrapper from "@/components/table/TableWrapper";
import { IconVisibility } from "@/lib/mui.lib.icons";

import CustomSearch from "@/components/input/CustomSearch";

import VendgramCustomModal from "@/components/modal/Modal";
import { IPagination, IStatus, ITransactionData } from "@/types/globalTypes";
import { TransactionDetails } from "./TransactionDetails";
import TransactionService from "@/services/transaction-service";
import { OrderStatus } from "@/components/feedback/OrderStatus";
import StatusFilter from "@/components/select/StatusFillter";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type TShowMode = "branch" | "setPrice" | "info" | "delete";
type IProps = {
  variant?: "all" | "customer";
  title?: string;
  customerId?: string;
  showActionTab?: boolean;
};
export function TransactionTable({
  variant = "all",
  title = "Transactions",
  customerId,
  showActionTab = true,
}: IProps) {
  const [show, setShow] = React.useState(false);
  const [filter, setFilter] = React.useState<number[]>([]);

  const [currentData, setCurrentData] = React.useState<ITransactionData | null>(
    null
  );
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const handleToggleShow = () => {
    setShow((prev) => !prev);
  };

  const { data, isLoading, isError } = useQuery(
    ["all-transactions", customerId, pagination.page, pagination.pageSize],
    () =>
      TransactionService.getAll(
        `?page=${pagination.page}&perPage=${pagination.pageSize}`,
        customerId
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

        return data as ITransactionData[];
      }),
    {
      retry: 0,
    }
  );

  const handleChange = (page: number) => {
    setPagination((prev: any) => ({ ...prev, page }));
  };

  const handleViewDetails = (data: ITransactionData) => () => {
    setCurrentData(data);
    setShow(true);
  };

  const handleSetFilter = (values: number[]) => {
    setFilter(values);
  };

  return (
    <StyledPage>
      {showActionTab && (
        <div className="tab-section">
          <div className="top-section">
            <MuiTypography variant="body2" className="heading">
              {title}
            </MuiTypography>
          </div>
          <div className="action-section">
            <StatusFilter
              selectedValue={filter}
              handleSetValue={handleSetFilter}
            />
            <CustomSearch placeholder="Search amount, reference" />
          </div>
        </div>
      )}

      <TableWrapper showPagination>
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
                  style={{ minWidth: "150px" }}>
                  User full name
                </MuiTableCell>
                <MuiTableCell className="heading">Order Id</MuiTableCell>
                <MuiTableCell className="heading">Amount</MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Transaction reference
                </MuiTableCell>
                <MuiTableCell
                  className="heading"
                  style={{ minWidth: "140px" }}
                  align="left">
                  Payment purpose
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Date created
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Status
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Actions
                </MuiTableCell>
              </MuiTableRow>
            </MuiTableHead>

            <MuiTableBody>
              {data &&
                data?.map((row) => (
                  <MuiTableRow
                    key={row?.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}>
                    <MuiTableCell>{row?.user?.full_name || "-"}</MuiTableCell>
                    <MuiTableCell align="left">{row?.id}</MuiTableCell>
                    <MuiTableCell align="left">
                      {" "}
                      ₦{" "}
                      {formatCurrency({
                        amount: Math.abs(row?.amount),
                        style: "decimal",
                      })}
                    </MuiTableCell>

                    <MuiTableCell align="left">{row?.reference}</MuiTableCell>
                    <MuiTableCell align="left">{row?.description}</MuiTableCell>
                    <MuiTableCell align="left">
                      {" "}
                      {format(new Date(row?.created_at || ""), "LL MMMM, yyyy")}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      <OrderStatus
                        type={row?.status?.toLowerCase() as IStatus}
                      />
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      <MuiBox className="action-group">
                        <MuiIconButton
                          onClick={handleViewDetails(row)}
                          className="visible-btn">
                          <IconVisibility />
                        </MuiIconButton>
                      </MuiBox>
                    </MuiTableCell>
                  </MuiTableRow>
                ))}

              {!isLoading && data && data?.length === 0 && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={8}
                    className="no-data-cell"
                    align="center">
                    <NoData title="No Recent Transaction" message="" />
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
                      message="Sorry, we couldn't fetch all transactions. Try again later or contact Rensa support."
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

      <VendgramCustomModal
        title="Transaction details"
        handleClose={handleToggleShow}
        open={show}
        showClose>
        <TransactionDetails />
      </VendgramCustomModal>
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;

  & .group-selection {
    display: flex;
    gap: 20px;
    align-items: center;
    background-color: #fff;
    box-shadow: -1px 2px 32px 0px #00000021;
    padding: 10px;
    width: fit-content;
    border-radius: 10px;
    position: absolute;
    top: -30px;
    left: 60px;
    margin: 10px 0;
    & .info {
      font-size: 13px;
      color: #64748b;
    }
    & .label {
      color: #64748b;
      font-size: 12px;
    }

    & .publish-label {
      margin-right: 10px;
    }
    & .delete-label {
      color: #ef5050;
    }

    & .actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    & .delete-btn {
      background: #ef50501a;
      padding: 5px;
      border-radius: 5px;
    }
  }

  & .action-group {
    display: flex;
    gap: 10px;
    align-items: center;
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

  & .tabs {
    /* width: 50%; */
    flex: 1;
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 30px 0 15px 0;
    flex-wrap: wrap;
    gap: 20px;

    & .action-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      justify-content: end;
    }
  }

  & .btn {
    height: 36px;
    font-size: 12px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  & .action-btn {
    background-color: #e8f1f8;
    border-radius: 10px;
    padding: 12px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  & .edit-btn {
    background: #ffc5021a;
    color: #d78950;

    svg {
      color: #d78950;
    }
  }

  & .delete-btn {
    background: #ef50501a;
    color: #d78950;

    svg {
      color: #d78950;
    }
  }

  & .disabled {
    background: #fbfbfb;

    svg {
      color: #d1d1d1;
    }
  }
`;
