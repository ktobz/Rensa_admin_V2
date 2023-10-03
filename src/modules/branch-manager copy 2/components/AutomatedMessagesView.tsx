import * as React from "react";
import { useQuery, useQueryClient } from "react-query";

import { NoData } from "@/components/feedback/NoData";
import { MuiBox, MuiIconButton, MuiTypography, styled } from "@/lib/index";
import {
  IconBellBlue,
  IconEdit,
  IconNotificationInfo,
} from "@/lib/mui.lib.icons";

import VendgramCustomModal from "@/components/modal/Modal";
import { INotificationData, IPagination } from "@/types/globalTypes";
import NotificationService from "@/services/notification-service";
import CustomTabs from "@/components/other/CustomTabs";
import CustomTab from "@/components/other/CustomTab";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

export function AutomatedMessagesView() {
  const queryClient = useQueryClient();

  const [show, setShow] = React.useState(false);

  const [editData, setEditData] = React.useState<null | any>(null);

  const [current, setCurrent] = React.useState(() => {
    return 0;
  });

  const handleChangeIndex = (index: number) => () => {
    setCurrent(index);
  };

  const handleToggleShow = () => {
    setShow((prev) => !prev);
  };

  const handleSetEditData = (data: INotificationData) => () => {
    setEditData(data);
    setShow(true);
  };

  const { data, isLoading, isError } = useQuery(
    ["all-automated-message"],
    () =>
      NotificationService.getAll("").then((res) => {
        const data = res.data?.data;
        return data as INotificationData[];
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleCloseModal = () => {
    setShow(false);
    setEditData(undefined);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(["all-automated-message"]);
    handleCloseModal();
  };

  return (
    <StyledPage>
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Automated messages
          </MuiTypography>
        </div>
      </div>
      <div className="tab-section">
        <CustomTabs variant="fullWidth" value={current || 0} className="tabs">
          <CustomTab
            onClick={handleChangeIndex(0)}
            value={0}
            label="General"
            current={current}
            hideIcon
          />
          <CustomTab
            onClick={handleChangeIndex(1)}
            value={1}
            label="Seller"
            current={current}
            hideIcon
          />
          <CustomTab
            onClick={handleChangeIndex(2)}
            value={2}
            label="Buyer"
            current={current}
            hideIcon
          />
        </CustomTabs>
      </div>
      <div className="rows-wrapper">
        {!isLoading &&
          data &&
          data?.map((row) => (
            <div key={row?.id} className="notif-row">
              <div className="content">
                <IconBellBlue className="icon" />
                <div className="text-group">
                  <MuiTypography variant="body2" className="faq-title">
                    {row?.title}
                  </MuiTypography>
                  <MuiTypography variant="body2" className="body">
                    {row?.description}
                  </MuiTypography>
                </div>
              </div>
              <MuiBox className="action-group">
                <MuiIconButton
                  color="warning"
                  onClick={handleSetEditData(row)}
                  className={`action-btn edit-btn btn `}>
                  <IconEdit />
                </MuiIconButton>
              </MuiBox>
            </div>
          ))}
      </div>

      {!isLoading && data && data?.length === 0 && !isError && (
        <div className="no-data-cell">
          <NoData
            title="No automated messages yet"
            icon={<IconNotificationInfo className="icon" />}
            message="Create one and start sending to users"></NoData>
        </div>
      )}

      {isError && !data && (
        <div className="no-data-cell">
          <NoData
            title="An Error Occurred"
            message="Sorry, we couldn't fetch automated message. Try again later or contact Rensa support."
            icon={<IconNotificationInfo className="icon" />}
          />
        </div>
      )}

      {/* {!data && isLoading && (
                <CustomTableSkeleton columns={7} rows={10} />
              )} */}

      {/* <VendgramCustomModal
        handleClose={handleToggleShow}
        open={show}
        alignTitle="left"
        closeOnOutsideClick={false}
        title={"Automated message"}
        showClose>
        <NotificationEntryForm
          mode={editData ? "edit" : "new"}
          initData={editData}
          refreshQuery={handleRefresh}
          handleClose={handleCloseModal}
        />
      </VendgramCustomModal>
       */}
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;
  height: 450px;

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
    color: #fb651e;
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
      font-size: 20px;
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

  & .rows-wrapper {
    padding: 10px;
  }

  & .notif-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 20px;

    & .content {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    & .faq-title {
      color: #000;
      font-weight: 500;
    }

    & .body {
      color: #64748b;
      max-width: 400px;
    }

    & .icon {
      width: 40px;
      height: 40px;
    }
  }
`;
