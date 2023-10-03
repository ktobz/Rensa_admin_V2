import * as React from "react";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "react-query";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiBox,
  MuiButton,
  MuiIconButton,
  MuiSkeleton,
  MuiTypography,
  styled,
} from "@/lib/index";
import {
  IconAdd,
  IconDelete,
  IconEdit,
  IconNotificationInfo,
} from "@/lib/mui.lib.icons";
import VendgramCustomModal from "@/components/modal/Modal";
import { FAQEntryForm } from "./FAQEntryForm";
import { IFAQData, IPagination } from "@/types/globalTypes";
import ConfigService from "@/services/config-service";
import { DeleteFAQConfirm } from "./DeleteFAQConfirm";
import FAQSkeleton from "@/components/skeleton/FAQSkeleton";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type TShowMode = "delete" | "add";

export function FAQSectionView() {
  const queryClient = useQueryClient();

  const [show, setShow] = React.useState({
    add: false,
    delete: false,
  });
  const [editData, setEditData] = React.useState<null | any>(null);
  const [deleteData, setDeleteData] = React.useState<any | null>(null);

  const handleSetEditData = (data: IFAQData) => () => {
    setEditData(data);
    setShow((prev) => ({ ...prev, add: true }));
  };

  const { data, isLoading, isError } = useQuery(
    ["all-faqs"],
    () =>
      ConfigService.getAllFAQs("").then((res) => {
        const data = res.data?.data;
        return data as IFAQData[];
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
    queryClient.invalidateQueries(["all-faqs"]);
    handleCloseModal();
  };

  const handleToggleShow = (name: TShowMode) => () => {
    setShow((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSetDeleteData = (data: any) => () => {
    setDeleteData(() => data);
    setShow((prev) => ({ ...prev, delete: true }));
  };

  const handleDeleteFAQ = (callback: () => void) => () => {
    const id = deleteData?.id;
    ConfigService.deleteFAQ(id || 0)
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
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            FAQs
          </MuiTypography>
        </div>
        <div className="action-section">
          <MuiButton
            startIcon={<IconAdd />}
            variant="contained"
            color="secondary"
            onClick={handleToggleShow("add")}
            className="btn">
            Add new
          </MuiButton>
        </div>
      </div>

      <div className="rows-wrapper">
        {!isLoading &&
          data &&
          data?.map((row) => (
            <div key={row?.id} className="faq-row">
              <div className="row-action">
                <MuiTypography variant="body2" className="faq-title">
                  {row?.title}
                </MuiTypography>

                <MuiBox className="action-group">
                  <MuiIconButton
                    color="warning"
                    onClick={handleSetEditData(row)}
                    className={`action-btn edit-btn btn `}>
                    <IconEdit />
                  </MuiIconButton>
                  <MuiIconButton
                    color="error"
                    onClick={handleSetDeleteData(row)}
                    className="action-btn delete-btn btn">
                    <IconDelete />
                  </MuiIconButton>
                </MuiBox>
              </div>
              <MuiTypography variant="body2" className="body">
                {row?.description}
              </MuiTypography>
            </div>
          ))}
      </div>

      {isLoading && !data && <FAQSkeleton totalCards={10} />}

      {!isLoading && data && data?.length === 0 && !isError && (
        <div className="no-data-cell">
          <NoData
            title="No FAQ yet"
            icon={<IconNotificationInfo className="icon" />}
            message="Create one and start answering user's questions"></NoData>
        </div>
      )}

      {isError && !data && (
        <div className="no-data-cell">
          <NoData
            title="An Error Occurred"
            message="Sorry, we couldn't fetch notifications. Try again later or contact Rensa support."
            icon={<IconNotificationInfo className="icon" />}
          />
        </div>
      )}

      {/* {!data && isLoading && (
                <CustomTableSkeleton columns={7} rows={10} />
              )} */}

      <VendgramCustomModal
        handleClose={handleToggleShow("add")}
        open={show.add}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={editData ? "Edit FAQ" : "Add new FAQ"}
        showClose>
        <FAQEntryForm
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
        <DeleteFAQConfirm
          data={deleteData}
          handleDelete={handleDeleteFAQ}
          handleClose={handleToggleShow("delete")}
        />
      </VendgramCustomModal>
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

  & .rows-wrapper {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    & .faq-row {
      width: calc((100% - 30px) / 3);
      /* flex: 1 250px; */
      min-width: 250px;
      background: #fdfdfd;
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #f3f3f3;

      & .row-action {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 20px;
        justify-content: space-between;

        & .btn {
          padding: 10px !important;
        }
      }

      & .body {
        line-height: 150%;
      }
      & .faq-title {
        color: #1e75bb;
        font-size: 15px;
        font-weight: 500;
      }
    }
  }
`;
