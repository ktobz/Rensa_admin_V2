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

import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";

import { format } from "date-fns";
import TableWrapper from "@/components/table/TableWrapper";
import {
  IconAdd,
  IconChecked,
  IconDefaultUserImage,
  IconDelete,
  IconEdit,
  IconIntermediateCheck,
  IconUnchecked,
  IconVisibility,
} from "@/lib/mui.lib.icons";

import CustomSearch from "@/components/input/CustomSearch";

import { CustomSwitch } from "@/components/input/CustomSwitch";
import VendgramCustomModal from "@/components/modal/Modal";

import { RiderEntryForm } from "./RiderEntryForm";

import { DeleteRiderConfirm } from "./DeleteRiderConfirm";
import RiderService from "@/services/rider-service";
import { toast } from "react-toastify";
import { IPagination, IRiderData } from "@/types/globalTypes";
import { RiderStatusConfirm } from "./RiderStatusConfirm";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type TShowMode = "branch" | "updateStatus" | "info" | "delete";

export function RidersTableView() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [show, setShow] = React.useState({
    branch: false,
    info: false,
    delete: false,
    updateStatus: false,
  });

  const [deleteData, setDeleteData] = React.useState<any[]>([]);
  const [updateData, setUpdateData] = React.useState<any[]>([]);

  const [editData, setEditData] = React.useState<null | any>(null);
  const [checked, setChecked] = React.useState(() => {
    const states: { [key: string]: boolean } = {};

    // for (let i = 0; i < data.length; i += 1) {
    //   states[data[i].id] = false;
    // }

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
    (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

  const handleChangeAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    const allChecks = { ...checked };

    for (let val in allChecks) {
      allChecks[val] = value;
    }

    setChecked((prev) => allChecks);
  };

  const handleToggleShow = (name: TShowMode) => () => {
    setShow((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSetDeleteData = (data: any) => () => {
    setDeleteData(() => [data]);
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

  const handleSetEditData = (data: IRiderData) => () => {
    setEditData(data);
    setShow((prev) => ({ ...prev, branch: true }));
  };

  const { data, isLoading, isError } = useQuery(
    ["all-riders", pagination.page, pagination.pageSize],
    () =>
      RiderService.getAll(
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
        // return data;

        return data as IRiderData[];
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewDetails = (data: IRiderData) => () => {
    navigate(`/app/riders/${data?.id}`);
  };

  const handleCloseModal = () => {
    setShow((prev) => ({
      branch: false,
      updateStatus: false,
      info: false,
      delete: false,
    }));
    setEditData(undefined);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      "all-riders",
      pagination.page,
      pagination.pageSize,
    ]);
    handleCloseModal();
  };

  const handleDeleteRiders = (callback: () => void) => () => {
    const ids = deleteData.map((data) => data?.id);
    RiderService.delete(ids?.[0] || 0)
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

  const handleUpdateManagerStatus = (callback: () => void) => () => {
    const ids = updateData.map((data) => data?.id);
    RiderService.changeVisibility(ids?.[0] || 0)
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

  const handleSetUpdateStatusData = (data: IRiderData) => () => {
    setUpdateData(() => [data]);
    setShow((prev) => ({ ...prev, updateStatus: true }));
  };

  // console.log(checked, "CHECKED");
  const isAnyChecked = () => {
    const allChecks = Object.values({ ...checked });
    return allChecks.some((val) => val === true);
  };

  return (
    <StyledPage>
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Riders
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

          <MuiButton
            startIcon={<IconAdd />}
            variant="contained"
            color="secondary"
            onClick={handleToggleShow("branch")}
            className="btn">
            Add New
          </MuiButton>
        </div>
      </div>

      <TableWrapper>
        {numOfChecked > 1 && (
          <div className="group-selection">
            <MuiTypography variant="body2" className="info">
              You selected <b>{numOfChecked}</b> Riders
            </MuiTypography>
            <div className="actions">
              <CustomSwitch color="primary" />{" "}
              <span className="label publish-label">Active all</span>
              <MuiIconButton
                color="error"
                onClick={handleSetDeleteAllData}
                className="action-btn delete-btn">
                <IconDelete />
              </MuiIconButton>
              <span className="label delete-label">delete all</span>
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
              flex: 1,
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
                    checked={numOfChecked === data?.length && data?.length > 0}
                    indeterminate={
                      numOfChecked > 0 &&
                      numOfChecked < (data ? data?.length : 0)
                    }
                    onChange={handleChangeAll}
                  />
                </MuiTableCell>
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "150px" }}>
                  Rider name
                </MuiTableCell>

                <MuiTableCell className="heading" align="left">
                  Phone number
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Date Created
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Completed orders
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
              {!isLoading &&
                data &&
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
                        checked={checked[row.id]}
                      />
                    </MuiTableCell>

                    <MuiTableCell>
                      <MuiBox component="div" className="manager-wrapper">
                        {row?.profile_image ? (
                          <MuiCardMedia
                            src={row?.profile_image}
                            component="img"
                            className="img"
                          />
                        ) : (
                          <IconDefaultUserImage className="img" />
                        )}

                        <span>{row?.full_name || "-"}</span>
                      </MuiBox>
                    </MuiTableCell>
                    <MuiTableCell align="left">{row?.phone}</MuiTableCell>
                    <MuiTableCell align="left">
                      {row?.created_at || "-"}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {row?.user_id || "-"}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      <CustomSwitch
                        color="primary"
                        defaultChecked={row?.status}
                        value={row?.status}
                        checked={row?.status}
                        onClick={handleSetUpdateStatusData(row)}
                      />
                      <span style={{ paddingLeft: "10px" }}>
                        {row?.status ? "Active" : "Inactive"}
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
                          color="error"
                          onClick={handleSetDeleteData(row)}
                          className="action-btn delete-btn">
                          <IconDelete />
                        </MuiIconButton>
                        <MuiIconButton
                          onClick={handleViewDetails(row)}
                          className="visible-btn">
                          <IconVisibility />
                        </MuiIconButton>
                      </MuiBox>
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
                    <NoData title="No Rider added" message="">
                      <div className="btn-group">
                        <MuiButton
                          startIcon={<IconAdd />}
                          variant="contained"
                          color="secondary"
                          onClick={handleToggleShow("branch")}
                          className="btn">
                          Add Rider
                        </MuiButton>
                      </div>
                    </NoData>
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {isError && !data && (
                <MuiTableRow>
                  <MuiTableCell
                    colSpan={8}
                    className="no-data-cell"
                    align="center">
                    <NoData
                      title="An Error Occurred"
                      message="Sorry, we couldn't fetch all riders. Try again later or contact Rensa support."
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {!data && isLoading && (
                <CustomTableSkeleton columns={7} rows={10} />
              )}
            </MuiTableBody>
          </MuiTable>
        </MuiTableContainer>
      </TableWrapper>

      <VendgramCustomModal
        handleClose={handleToggleShow("branch")}
        open={show.branch}
        alignTitle="left"
        title={editData ? "Edit Rider" : "Add Rider"}
        showClose>
        <RiderEntryForm
          mode={editData ? "edit" : "new"}
          initData={editData}
          refreshQuery={handleRefresh}
          handleClose={handleCloseModal}
        />
      </VendgramCustomModal>

      <VendgramCustomModal
        handleClose={handleToggleShow("delete")}
        open={show.delete}
        showClose>
        <DeleteRiderConfirm
          data={deleteData}
          handleDelete={handleDeleteRiders}
          handleClose={handleToggleShow("delete")}
        />
      </VendgramCustomModal>

      <VendgramCustomModal
        handleClose={handleToggleShow("updateStatus")}
        open={show.updateStatus}
        showClose>
        <RiderStatusConfirm
          data={updateData}
          handleDelete={handleUpdateManagerStatus}
          handleClose={handleToggleShow("updateStatus")}
          action="inactive"
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

  & .link {
    color: #1e75bb;
    text-transform: capitalize;
    text-underline-offset: 2px;
    /* font-size: 14px; */
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
