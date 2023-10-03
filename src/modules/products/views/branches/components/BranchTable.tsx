import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiBox,
  MuiButton,
  MuiCardMedia,
  MuiCheckbox,
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

import { IPagination } from "@/types/globalTypes";

import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";
import { formatCurrency } from "utils/helper-funcs";
import TableWrapper from "@/components/table/TableWrapper";
import {
  IconAdd,
  IconChecked,
  IconDefaultUserImage,
  IconEdit,
  IconIntermediateCheck,
  IconUnchecked,
  IconVisibility,
} from "@/lib/mui.lib.icons";

import CustomSearch from "@/components/input/CustomSearch";
import { CustomSwitch } from "@/components/input/CustomSwitch";
import VendgramCustomModal from "@/components/modal/Modal";

import { BranchEntryFormView } from "./BranchEntryForm";

import { BranchVisibilityConfirm } from "./BranchVisibilityConfirm";
import { IBranchDataProps } from "@/types/globalTypes";
import BranchService from "@/services/branches.service";
import { toast } from "react-toastify";
import { useIds } from "@/utils/hooks";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type TShowMode = "branch" | "setPrice" | "info" | "delete";

export function BranchTable() {
  const { partnerId } = useIds();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [show, setShow] = React.useState({
    branch: false,
    setPrice: false,
    info: false,
    delete: false,
  });

  const [allData, setAllData] = React.useState<IBranchDataProps[]>([]);
  const [updateStatus, setUpdateStatus] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [deleteData, setDeleteData] = React.useState<IBranchDataProps[]>([]);
  const [editData, setEditData] = React.useState<undefined | IBranchDataProps>(
    undefined
  );
  const [checked, setChecked] = React.useState(() => {
    const states: { [key: number]: boolean } = {};

    for (let i = 0; i < allData.length; i += 1) {
      if (allData[i].id) {
        states[allData[i].id || 0] = false;
      }
    }

    return states;
  });

  const getNumOfChecked = () => {
    const allChecks = Object.values({ ...checked });
    let num = 0;
    for (let i = 0; i < allChecks.length; i += 1) {
      if (allChecks[i]) {
        num += 1;
      }
    }

    return num;
  };

  const numOfChecked = getNumOfChecked();

  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  const [current, setCurrent] = React.useState(() => {
    return 1;
  });

  const handleChangeIndex = (index: number) => () => {
    setCurrent(index);
  };

  const handleCheck =
    (id: number | undefined) =>
    (event: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
      if (id) {
        setChecked((prev) => ({ ...prev, [id]: value }));
      }
    };

  const handleChangeAll = (
    event: React.ChangeEvent<HTMLInputElement>,
    checkValue: boolean
  ) => {
    const allChecks = { ...checked };

    for (let val in allChecks) {
      allChecks[val] = checkValue;
    }

    setChecked((prev) => allChecks);
  };

  const handleToggleShow = (name: TShowMode) => () => {
    setShow((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleHide = () => {
    setShow((prev) => ({
      branch: false,
      setPrice: false,
      info: false,
      delete: false,
    }));
  };

  const handleShowPriceForm = () => {
    setShow((prev) => ({
      branch: false,
      setPrice: true,
      info: false,
      delete: false,
    }));
  };

  const handleSetUpdateStatusData = (data: IBranchDataProps[]) => () => {
    setDeleteData(() => data);
    setShow((prev) => ({ ...prev, delete: true }));
  };

  const handleSetDeleteAllData = () => {
    const allCheckedProducts = { ...checked };
    // const dataToDelete = [];

    // for (let i = 0; i < data.length; i += 1) {
    //   if (checked[data[i]?.id]) {
    //     dataToDelete.push(data[i]);
    //   }
    // }

    // setDeleteData(dataToDelete);
    setShow((prev) => ({ ...prev, delete: true }));
  };

  const handleSetEditData = (data: IBranchDataProps) => () => {
    setEditData(data);
    setShow((prev) => ({ ...prev, branch: true }));
  };

  const handleSetCheckStatus = (data: IBranchDataProps[]) => {
    const states: { [key: string]: boolean } = {};

    for (let i = 0; i < data.length; i += 1) {
      states[data[i].id || 0] = false;
    }
    setChecked(states);
  };

  const { data, isLoading, isError } = useQuery(
    ["all-branches", pagination.page, pagination.pageSize, partnerId],
    () =>
      BranchService.getAll(
        partnerId,
        `?page=${pagination.page}&perPage=${pagination.pageSize}`
      ).then((res) => {
        const data = res.data?.data;
        setAllData(data);
        handleSetCheckStatus(data);

        // const { hasNextPage, hasPrevPage, total, totalPages } =
        //   createPaginationData(data, pagination);

        // setPagination((prev) => ({
        //   ...prev,
        //   total,
        //   totalPages,
        //   hasNextPage,
        //   hasPrevPage,
        // }));

        return data as IBranchDataProps[];
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewDetails = (id: number | undefined) => () => {
    navigate(`${id}`);
  };

  const isAnyChecked = () => {
    const allChecks = Object.values({ ...checked });
    return allChecks.some((val) => val === true);
  };

  const handleCloseModal = () => {
    setShow((prev) => ({
      branch: false,
      setPrice: false,
      info: false,
      delete: false,
    }));
    setEditData(undefined);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      "all-branches",
      pagination.page,
      pagination.pageSize,
      partnerId,
    ]);
    handleCloseModal();
  };

  const handleUpdateVisibility = (callback: () => void) => () => {
    const ids = deleteData
      ?.filter((x) => checked[x.id || 0])
      ?.map((data) => data?.id || 0);
    (ids?.length > 1
      ? BranchService.multipleVisibilityUpdate({
          branch_id: ids,
          availabilty: updateStatus,
        })
      : BranchService.changeVisibility(ids?.[0] || 0)
    )
      .then((res) => {
        handleRefresh?.();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      })
      .finally(() => {
        callback();
      });
  };

  const handleSetStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setUpdateStatus((prev) => checked);
  };

  return (
    <StyledPage>
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Total Branches
          </MuiTypography>
          <MuiTypography
            className="total"
            fontWeight="600"
            color="secondary"
            variant="body2">
            {data?.length}
          </MuiTypography>
        </div>
        <div className="action-section">
          <CustomSearch placeholder="Search branch name" />

          <MuiButton
            startIcon={<IconAdd />}
            variant="contained"
            color="secondary"
            onClick={handleToggleShow("branch")}
            className="btn">
            Add Branch
          </MuiButton>
        </div>
      </div>

      <TableWrapper>
        {numOfChecked > 1 && (
          <div className="group-selection">
            <MuiTypography variant="body2" className="info">
              You selected <b>{numOfChecked}</b> branches
            </MuiTypography>
            <div className="actions">
              <CustomSwitch
                color="primary"
                defaultChecked={updateStatus}
                value={updateStatus}
                checked={updateStatus}
                onChange={handleSetStatus}
              />
              <MuiButton
                variant="text"
                color="secondary"
                className="btn publish-label"
                onClick={handleSetUpdateStatusData(allData)}>
                {updateStatus ? "Open All" : "Close All"}
              </MuiButton>
            </div>
          </div>
        )}
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
                <MuiTableCell className="heading" align="left">
                  <MuiCheckbox
                    size="small"
                    checkedIcon={<IconChecked />}
                    icon={<IconUnchecked />}
                    indeterminateIcon={<IconIntermediateCheck />}
                    checked={numOfChecked === data?.length && data.length > 0}
                    indeterminate={
                      numOfChecked > 0 && numOfChecked < (data?.length || 0)
                    }
                    onChange={handleChangeAll}
                  />
                </MuiTableCell>
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "150px" }}>
                  Branch name
                </MuiTableCell>
                <MuiTableCell className="heading">Location</MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Branch Manager
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Total orders
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Total sales
                </MuiTableCell>
                <MuiTableCell className="heading" align="left" width={150}>
                  Availability
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Actions
                </MuiTableCell>
              </MuiTableRow>
            </MuiTableHead>

            <MuiTableBody>
              {data &&
                !isLoading &&
                data?.map((row) => (
                  <MuiTableRow
                    key={row?.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}>
                    <MuiTableCell className="order-id" align="center">
                      <MuiCheckbox
                        size="small"
                        checkedIcon={<IconChecked />}
                        icon={<IconUnchecked />}
                        onChange={handleCheck(row.id)}
                        checked={checked[row?.id as number]}
                        defaultChecked={checked[row?.id as number]}
                      />
                    </MuiTableCell>
                    <MuiTableCell className="order-id" align="left">
                      <b>{row?.name}</b>
                    </MuiTableCell>
                    <MuiTableCell>{row?.location || "-"}</MuiTableCell>

                    <MuiTableCell>
                      <MuiBox component="div" className="manager-wrapper">
                        {row?.branch_manager?.profile_image ? (
                          <MuiCardMedia
                            src={row?.branch_manager?.profile_image}
                            component="img"
                            className="img"
                          />
                        ) : (
                          <IconDefaultUserImage className="img" />
                        )}

                        <span>{row?.branch_manager?.full_name || "-"}</span>
                      </MuiBox>
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {row?.total_orders}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {formatCurrency({ amount: row?.total_sales })}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      <CustomSwitch
                        color="primary"
                        defaultChecked={row?.availabilty}
                        value={row?.availabilty}
                        checked={row?.availabilty}
                        onClick={handleSetUpdateStatusData([row])}
                      />
                      <span style={{ paddingLeft: "10px" }}>
                        {row?.availabilty ? "Open" : "Closed"}
                      </span>
                    </MuiTableCell>

                    <MuiTableCell align="left">
                      <MuiBox className="action-group">
                        <MuiIconButton
                          color="warning"
                          onClick={handleSetEditData(row)}
                          className={`action-btn edit-btn `}>
                          <IconEdit />
                        </MuiIconButton>
                        <MuiIconButton
                          onClick={handleViewDetails(row?.id)}
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
                    colSpan={9}
                    align="center"
                    className="no-data-cell"
                    rowSpan={20}>
                    <NoData title="No branch added" message="">
                      <div className="btn-group">
                        <MuiButton
                          startIcon={<IconAdd />}
                          variant="contained"
                          color="secondary"
                          onClick={handleToggleShow("branch")}
                          className="btn">
                          Add Branch
                        </MuiButton>
                      </div>
                    </NoData>
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
                      message="Sorry, we couldn't fetch your products. Try again later or contact Rensa support."
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
        handleClose={handleToggleShow("branch")}
        open={show.branch}
        alignTitle="left"
        title={editData ? "Edit Branch" : "Add Branch"}
        showClose>
        <BranchEntryFormView
          mode={editData ? "edit" : "new"}
          initData={editData}
          refreshQuery={handleRefresh}
          handleClose={handleCloseModal}
          partnerId={partnerId}
        />
      </VendgramCustomModal>

      <VendgramCustomModal
        handleClose={handleToggleShow("delete")}
        open={show.delete}
        showClose>
        <BranchVisibilityConfirm
          data={deleteData}
          handleClose={handleToggleShow("delete")}
          handleUpdateData={handleUpdateVisibility}
          action={
            deleteData?.length > 1
              ? updateStatus
                ? "open"
                : "close"
              : deleteData?.[0]?.availabilty
              ? "close"
              : "open"
          }
        />
      </VendgramCustomModal>
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;

  & .manager-wrapper {
    display: flex;
    gap: 5px;
    align-items: center;

    & .img {
      width: 25px;
      height: 25px;
      border-radius: 50%;
    }

    & span {
      font-weight: 600;
    }
  }

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

  & .tabs {
    /* width: 50%; */
    flex: 1;
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 25px 0;
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
