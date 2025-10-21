import * as React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiBox,
  MuiButton,
  MuiCircularProgress,
  MuiIconButton,
  MuiInputLabel,
  MuiTable,
  MuiTableBody,
  MuiTableCell,
  MuiTableContainer,
  MuiTableHead,
  MuiTableRow,
  MuiTypography,
  styled
} from "@/lib/index";

import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";

import TableWrapper from "@/components/table/TableWrapper";
import {
  IconAdd,
  IconDelete,
  IconEdit,
  IconNotificationInfo
} from "@/lib/mui.lib.icons";

import AppCustomModal from "@/components/modal/Modal";
import { AppReleaseForm } from "./AppReleaseForm";

import { DeleteAppReleaseConfirm } from "./DeleteAppReleaseConfirm";

import { CustomSwitch } from "@/components/input/CustomSwitch";
import useCachedDataStore from "@/config/store-config/lookup";
import AppReleaseService from "@/services/app-release-service";
import { IAppReleaseData, IPagination } from "@/types/globalTypes";
import { createPaginationData, formatDate } from "@/utils/helper-funcs";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type TShowMode = "add" | "updateStatus" | "info" | "delete" | "send";

export function AppReleaseTable() {
  const {
    lookup: { devicePlatform },
  } = useCachedDataStore((state) => state.cache);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [show, setShow] = React.useState({
    add: false,
    info: false,
    delete: false,
    updateStatus: false,
    send: false,
  });

  const [deleteData, setDeleteData] = React.useState<any[]>([]);
  const [updateData, setUpdateData] = React.useState<any[]>([]);
  const [notificationData, setNotificationData] = React.useState<any[]>([]);

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
    (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSetEditData = (data: IAppReleaseData) => () => {
    setEditData(data);
    setShow((prev) => ({ ...prev, add: true }));
  };

  const { data, isLoading, isError } = useQuery(
    ["all-releases", pagination.page, pagination.pageSize],
    () =>
      AppReleaseService.getAll(
        `?PageNumber=${pagination.page}&PageSize=${pagination.pageSize}`
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
      refetchOnWindowFocus: false,
    }
  );

  const handleChange = (page: number) => {
    setPagination((prev: any) => ({ ...prev, page }));
  };

  const handleViewDetails = (data: IAppReleaseData) => () => {
    setUpdateData([data]);
    setShow((prev) => ({ ...prev, info: true }));
  };

  const handleCloseModal = () => {
    setShow((prev) => ({
      add: false,
      updateStatus: false,
      info: false,
      send: false,
      delete: false,
    }));
    setEditData(undefined);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      "all-releases",
      pagination.page,
      pagination.pageSize,
    ]);
    handleCloseModal();
  };

  const handleDelete = (callback: () => void) => () => {
    const ids = deleteData.map((data) => data?.id);
    AppReleaseService.delete(ids?.[0] || 0)
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

  const isAnyChecked = () => {
    const allChecks = Object.values({ ...checked });
    return allChecks.some((val) => val === true);
  };

  const handleToggleActiveStatus=(data:IAppReleaseData)=>()=>{
    setUpdateData([data]);
    setShow((prev)=>({...prev,updateStatus:true}));
     AppReleaseService.updateActiveStatus(data?.id??'', {...data, isActive: !data?.isActive})
      .then((res) => {
        handleRefresh?.();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      }).finally(()=>{
        setUpdateData([]);
        setShow((prev)=>({...prev,updateStatus:false}));
      });




  }

  return (
    <StyledPage>
      <div className="tab-section">
        <div className="action-section">
          <MuiButton
            startIcon={<IconAdd />}
            variant="contained"
            color="primary"
            onClick={handleToggleShow("add")}
            className="btn">
            Add New
          </MuiButton>
        </div>
      </div>

      <TableWrapper      handleChangePagination={handleChange}
        pagination={pagination}showPagination>
        {numOfChecked > 1 && (
          <div className="group-selection">
            <MuiTypography variant="body2" className="info">
              You selected <b>{numOfChecked}</b> notifications
            </MuiTypography>
            <div className="actions">
              {/* <CustomSwitch color="primary" />{" "}
              <span className="label publish-label">Active all</span>
              <MuiIconButton
                color="error"
                onClick={handleSetDeleteAllData}
                className="action-btn delete-btn">
                <IconDelete />
              </MuiIconButton>
              <span className="label delete-label">delete all</span> */}
            </div>
          </div>
        )}
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
                {/* <MuiTableCell className="heading" align="left">
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
                </MuiTableCell> */}
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "150px" }}>
                  Device
                </MuiTableCell>

                <MuiTableCell className="heading" align="left">
                  Version No
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Update Type
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Update description
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Date
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Active
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Actions
                </MuiTableCell>
              </MuiTableRow>
            </MuiTableHead>

            <MuiTableBody>
              {!isLoading &&
                data &&
                data?.map((row, index) => (
                  <MuiTableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}>
                    {/* <MuiTableCell className="order-id" align="center">
                      <MuiCheckbox
                        size="small"
                        checkedIcon={<IconChecked />}
                        icon={<IconUnchecked />}
                        onChange={handleCheck(row.id)}
                        checked={checked[row.id]}
                      />
                    </MuiTableCell> */}

                    <MuiTableCell>
                      {devicePlatform[(row?.devicePlatform || 1) - 1]?.name}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {row?.versionNumber}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {row?.forceUpdate ? "Force" : "Optional"}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      {row?.releaseNotes || "-"}
                    </MuiTableCell>

                    <MuiTableCell align="left">
                      {formatDate(row?.creationTime || "")}
                    </MuiTableCell>

                    <MuiTableCell align="left">
                      <div className="flex">
                        {
                          show.updateStatus && updateData?.[0]?.id ===row?.id  && (

                            <MuiCircularProgress size={12} color="error" />
                          )
                        }

                    <MuiInputLabel
                  style={{ cursor: "pointer" }}
                  onClick={handleToggleActiveStatus(row)}
                  >
                  <CustomSwitch
                    // disabled
                    checked={row?.isActive}
                    defaultChecked={row?.isActive}
                  />
                </MuiInputLabel>
                      </div>
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
                    <NoData
                      title="No app version created"
                      icon={<IconNotificationInfo className="icon" />}
                      message="Created app version will appear here"></NoData>
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
                      message="Sorry, we couldn't fetch data. Try again later or contact Rensa support."
                      icon={<IconNotificationInfo className="icon" />}
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

      <AppCustomModal
        handleClose={handleToggleShow("add")}
        open={show.add}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={editData ? "Edit Release" : "Add New Release"}
        showClose>
        <AppReleaseForm
          mode={editData ? "edit" : "new"}
          initData={editData}
          refreshQuery={handleRefresh}
          handleClose={handleCloseModal}
        />
      </AppCustomModal>

      <AppCustomModal
        handleClose={handleToggleShow("delete")}
        open={show.delete}
        showClose>
        <DeleteAppReleaseConfirm
          data={deleteData}
          handleDelete={handleDelete}
          handleClose={handleToggleShow("delete")}
        />
      </AppCustomModal>
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

  .flex{
    display: flex;
    gap:5px;
    align-items:center;

  }

  & .edit-btn {
    background: #ffc5021a;
    color: #d78950;

    svg {
      color: #d78950;
    }
  }
  & .send-btn {
    background: #05a3571a;
    /* color: #d78950; */
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
