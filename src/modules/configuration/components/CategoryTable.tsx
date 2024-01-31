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

import AppCustomModal from "@/components/modal/Modal";

import { ICategoryData, IPagination } from "@/types/globalTypes";
import NotificationService from "@/services/notification-service";
import { CategoryForm } from "./CategoryForm";
import { DeleteConfirm } from "./DeleteConfirm";
import { createPaginationData } from "@/utils/helper-funcs";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type TShowMode = "add" | "delete";

export function CategoryTable() {
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

  const handleSetEditData = (data: ICategoryData) => () => {
    setEditData(data);
    setShow((prev) => ({ ...prev, add: true }));
  };

  const { data, isLoading, isError } = useQuery(
    ["all-categories", pagination.page, pagination.pageSize],
    () =>
      NotificationService.getCategories(
        `?PageNumber=${pagination.page}&PageSize=${pagination.pageSize}`
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

  const handleCloseModal = () => {
    setShow((prev) => ({
      add: false,
      delete: false,
    }));
    setEditData(undefined);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      "all-categories",
      pagination.page,
      pagination.pageSize,
    ]);
    handleCloseModal();
  };

  const handleDelete = (callback: () => void) => () => {
    const ids = deleteData.map((data) => data?.id);
    NotificationService.deleteCategory(ids?.[0] || 0)
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
              Category
            </MuiTypography>
            <MuiButton variant="text" onClick={handleToggleShow("add")}>
              Add category
            </MuiButton>
          </div>
        </div>
        <MuiTableContainer
          sx={{
            maxWidth: "100%",
            minHeight: data?.length === 0 ? "inherit" : "unset",
            flex: 1,
            maxHeight: 600,
          }}>
          <MuiTable
            sx={
              {
                // minWidth: 750,
              }
            }
            aria-label="simple table">
            <MuiTableHead>
              <MuiTableRow>
                <MuiTableCell
                  className="heading"
                  width={30}
                  align="left"></MuiTableCell>
                <MuiTableCell className="heading" width="100%" align="left">
                  Category name
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
                      <MuiCardMedia
                        src={row?.fileUrl}
                        className="img"
                        component="img"
                      />
                    </MuiTableCell>
                    <MuiTableCell align="left">{row?.name}</MuiTableCell>

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
                      message="Created notification will appear here"></NoData>
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
                      message="Sorry, we couldn't fetch notifications. Try again later or contact Rensa support."
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
        title={editData ? "Edit Category" : "New Category"}
        showClose>
        <CategoryForm
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
        <DeleteConfirm
          variant="Category"
          handleDelete={handleDelete}
          handleClose={handleToggleShow("delete")}
        />
      </AppCustomModal>
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;
  padding: 10px;
  & .tab-section {
    margin: 15px 0 0 !important;
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  & .img {
    width: 25px;
    height: 25px;
  }

  & .top-section {
    display: flex;
    gap: 20px;
    width: 100%;

    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: 0 20px !important;

    & .heading {
      font-weight: 600;
      color: #000 !important;
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
`;
