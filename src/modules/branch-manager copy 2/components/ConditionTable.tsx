import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiBox,
  MuiButton,
  MuiCardMedia,
  MuiCheckbox,
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

import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";

import TableWrapper from "@/components/table/TableWrapper";
import {
  IconAdd,
  IconChecked,
  IconDelete,
  IconEdit,
  IconIntermediateCheck,
  IconNotificationInfo,
  IconSendNotification,
  IconUnchecked,
  IconVisibility,
} from "@/lib/mui.lib.icons";

import VendgramCustomModal from "@/components/modal/Modal";

import { INotificationData, IPagination } from "@/types/globalTypes";
import NotificationService from "@/services/notification-service";
import { ConditionEntryForm } from "./ConditionEntryForm";
import { DeleteConfirm } from "./DeleteConfirm";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type TShowMode = "add" | "delete";

export function ConditionTable() {
  const queryClient = useQueryClient();

  const [show, setShow] = React.useState({
    add: false,
    delete: false,
  });

  const [deleteData, setDeleteData] = React.useState<any[]>([]);
  const [editData, setEditData] = React.useState<null | any>(null);
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const handleToggleShow = (name: TShowMode) => () => {
    setShow((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSetDeleteData = (data: any) => () => {
    setDeleteData(() => [data]);
    setShow((prev) => ({ ...prev, delete: true }));
  };

  const handleSetEditData = (data: INotificationData) => () => {
    setEditData(data);
    setShow((prev) => ({ ...prev, add: true }));
  };

  const { data, isLoading, isError } = useQuery(
    ["all-notifications", pagination.page, pagination.pageSize],
    () =>
      NotificationService.getAll(
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

        return data as INotificationData[];
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleCloseModal = () => {
    setShow((prev) => ({
      add: false,
      delete: false,
    }));
    setEditData(undefined);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      "all-conditions",
      pagination.page,
      pagination.pageSize,
    ]);
    handleCloseModal();
  };

  const handleDelete = (callback: () => void) => () => {
    const ids = deleteData.map((data) => data?.id);
    NotificationService.delete(ids?.[0] || 0)
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

  return (
    <StyledPage>
      <TableWrapper>
        <div className="tab-section">
          <div className="top-section">
            <MuiTypography variant="body2" className="heading">
              Condition
            </MuiTypography>
            <MuiButton variant="text" onClick={handleToggleShow("add")}>
              Add condition
            </MuiButton>
          </div>
        </div>
        <MuiTableContainer
          sx={{
            maxWidth: "100%",
            minHeight: data?.length === 0 ? "inherit" : "unset",
            flex: 1,
          }}>
          <MuiTable
            sx={{
              // minWidth: 750,
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
                  Conditions
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
                    <MuiTableCell align="left">
                      <MuiCardMedia src="" component="img" />
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      <div className="data">
                        <MuiTypography variant="body1" className="title">
                          New
                        </MuiTypography>
                        <MuiTypography variant="body1" className="body">
                          Excellent condition, but has previously been worn or
                          used. No signs of wear or defects.
                        </MuiTypography>
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
                      title="No notification created"
                      icon={<IconNotificationInfo className="icon" />}
                      message="Created conditions will appear here"></NoData>
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
                      message="Sorry, we couldn't fetch conditions. Try again later or contact Rensa support."
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

      <VendgramCustomModal
        handleClose={handleToggleShow("add")}
        open={show.add}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={editData ? "Edit Condition" : "New Condition "}
        showClose>
        <ConditionEntryForm
          mode={editData ? "edit" : "new"}
          initData={editData}
          refreshQuery={handleRefresh}
          handleClose={handleCloseModal}
        />
      </VendgramCustomModal>

      {/* <VendgramCustomModal
        handleClose={handleToggleShow("info")}
        open={show.info}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={"Push Notification"}
        showClose>
        <NotificationEntryForm
          mode={"view"}
          initData={updateData?.[0]}
          refreshQuery={handleRefresh}
          handleClose={handleCloseModal}
        />
      </VendgramCustomModal> */}

      <VendgramCustomModal
        handleClose={handleToggleShow("delete")}
        open={show.delete}
        showClose>
        <DeleteConfirm
          variant="Condition"
          handleDelete={handleDelete}
          handleClose={handleToggleShow("delete")}
        />
      </VendgramCustomModal>

      {/* <VendgramCustomModal
        handleClose={handleToggleShow("send")}
        open={show.send}
        showClose>
        <SendNotificationConfirm
          data={notificationData}
          handleSend={handleSendNotification}
          handleClose={handleToggleShow("send")}
        />
      </VendgramCustomModal> */}
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;
  padding: 20px 10px;
  & .tab-section {
    margin: 15px 0 0 !important;
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  & .top-section {
    display: flex;
    gap: 20px;
    width: 100%;

    justify-content: space-between;
    align-items: center;
    /* margin-bottom: 10px; */
    margin: 0;
    padding: 0 20px !important;

    & .heading {
      font-weight: 600;
      color: #000;
      font-size: 20px;
      font-family: "Helvetica";
    }
  }

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

  & .data {
    & .title {
      font-weight: bold;
    }
    & .body {
      font-size: 13px;
    }
  }
`;
