import * as React from "react";
import { useQuery, useQueryClient } from "react-query";

import { NoData } from "@/components/feedback/NoData";
import TableWrapper from "@/components/table/TableWrapper";
import {
  MuiBox,
  MuiCircularProgress,
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
import { IconVerify, IconVisibility } from "@/lib/mui.lib.icons";
import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";
import {
  createPaginationData,
  formatCurrency,
  formatDate,
  getIdName,
  usePageNavigationParam,
} from "utils/helper-funcs";

import CustomSearch from "@/components/input/CustomSearch";

import { OrderStatus } from "@/components/feedback/OrderStatus";
import StatusFilter from "@/components/select/StatusFillter";
import useCachedDataStore from "@/config/store-config/lookup";
import TransactionService from "@/services/transaction-service";
import {
  IPagination,
  IStatus,
  ITransactions,
  ITransactionsResponse
} from "@/types/globalTypes";
import { AxiosPromise } from "axios";
import throttle from "lodash.throttle";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  showActionTab?: boolean;
  id?: string;
  apiFunc?: (
    query?: string,
    signal?: AbortSignal
  ) => AxiosPromise<ITransactionsResponse>;
  queryKey?: string;
};
export function TransactionTable({
  variant = "all",
  title = "Transactions",
  id,
  showActionTab = true,
  apiFunc = TransactionService.getAll,
  queryKey = "all-transactions",
}: IProps) {
  const {
    lookup: { catalogueTransactionStatus },
  } = useCachedDataStore((state) => state.cache);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {page,perPage,resetAllNavigationQueries, txStatus, setTxStatus } = usePageNavigationParam();

  const [show, setShow] = React.useState(false);

  const [searchText, setSearchText] = React.useState("");
  const [text, setText] = React.useState("");
  const [verifyId, setVerifyId] = React.useState("");

  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const handleToggleShow = () => {
    setShow((prev) => !prev);
  };

  const { data, isLoading, isError } = useQuery(
    [queryKey, id, page, perPage, text, txStatus],
    ({ signal }) =>
      apiFunc(
        `?pageNumber=${page}&pageSize=${
          perPage
        }&searchText=${text}${
          txStatus?.length > 0
            ? `${txStatus.reduce((acc, val) => {
                acc += `&status=${val}`;
                return acc;
              }, "")}`
            : ""
        }`,
        signal
      ).then((res) => {
        const { data, ...paginationData } = res.data?.result;
        const { hasNextPage, hasPrevPage, total, totalPages ,page,pageSize} =
        createPaginationData(data, paginationData);

      setPagination((prev) => ({
        ...prev,
        page,
        pageSize,
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
    setPagination((prev: any) => ({ ...prev, page }));
  };

  const handleViewDetails = (data: ITransactions) => () => {
    navigate(`/app/orders/${data?.transactionReference}`);
  };

  const handleSetFilter = (values: number[]) => {
    resetAllNavigationQueries();
    setTxStatus(values);
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
    resetAllNavigationQueries();
    setText(value);
    debouncedChangeHandler();
  };

  const handleVerifyTransaction = (data: ITransactions) => async () => {
    setVerifyId(data?.transactionReference || "");

    try {
      const { data: resData } = await TransactionService.verifyTransaction(
        data?.transactionReference || ""
      );

      toast.success(resData?.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
    queryClient.invalidateQueries([
      queryKey,
      id,
      pagination.page,
      pagination.pageSize,
      searchText,
      txStatus,
    ]);
    setVerifyId("");
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
              selectedValue={txStatus}
              handleSetValue={handleSetFilter}
              options={catalogueTransactionStatus}
            />
            <CustomSearch
              placeholder="Search transaction ref ID"
              value={text}
              onChange={handleChangeText}
            />{" "}
          </div>
        </div>
      )}

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
                  style={{ minWidth: "150px" }}>
                  User Full name
                </MuiTableCell>
                <MuiTableCell className="heading">Order Id</MuiTableCell>
                <MuiTableCell className="heading">Amount</MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Transaction reference
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
                data?.map((row) => {
                  const type = getIdName(
                    row?.status,
                    catalogueTransactionStatus
                  )?.toLowerCase() as IStatus;
                  const disableVerifyBtn = type !== "pending";
                  const disableView = type === "cancelled";
                  return (
                    <MuiTableRow
                      key={row?.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}>
                      <MuiTableCell>
                        {row?.firstName} {row?.lastName || "-"}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        {row?.catalogueId}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        ₦
                        {formatCurrency({
                          amount: Math.abs(row?.maxTotalAmount),
                          style: "decimal",
                        })}
                      </MuiTableCell>

                      <MuiTableCell align="left">
                        {row?.transactionReference}
                      </MuiTableCell>

                      <MuiTableCell align="left">
                        {formatDate(row?.creationTime || "")}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        <OrderStatus
                          type={
                            getIdName(
                              row?.status,
                              catalogueTransactionStatus
                            )?.toLowerCase() as IStatus
                          }
                        />
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        <MuiBox className="action-group">
                          <MuiIconButton
                            onClick={handleVerifyTransaction(row)}
                            disabled={!!verifyId || disableVerifyBtn}
                            className={`visible-btn ${
                              disableVerifyBtn ? "disabled" : "verify"
                            }`}>
                            {verifyId === row?.transactionReference ? (
                              <MuiCircularProgress
                                size={13}
                                color="secondary"
                              />
                            ) : (
                              <IconVerify />
                            )}
                          </MuiIconButton>
                          <MuiIconButton
                            disabled={!!verifyId || disableView}
                            onClick={handleViewDetails(row)}
                            className={`visible-btn ${
                              disableView ? "disabled" : ""
                            }`}>
                            <IconVisibility />
                          </MuiIconButton>
                        </MuiBox>
                      </MuiTableCell>
                    </MuiTableRow>
                  );
                })}

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

      {/* <AppCustomModal
        title="Transaction details"
        handleClose={handleToggleShow}
        open={show}
        data={detail}
        showClose>
        <TransactionDetails />
      </AppCustomModal> */}
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

  & .disabled {
    color: #777e90;
    background-color: #f0f0f0;
  }

  & .verify {
    color: #45b26b;
    background-color: #e8fff3;
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
      flex-wrap: wrap;
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
