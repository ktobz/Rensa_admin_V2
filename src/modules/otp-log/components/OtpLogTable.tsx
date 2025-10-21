import * as React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

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
  MuiTooltip,
  MuiTypography,
  styled
} from "@/lib/index";

import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";

import TableWrapper from "@/components/table/TableWrapper";
import {
  IconCopyFilled,
  IconNotificationInfo
} from "@/lib/mui.lib.icons";



import { OrderStatus } from "@/components/feedback/OrderStatus";
import OtherService from "@/services/others.service";
import { IPagination } from "@/types/globalTypes";
import { createPaginationData, formatDate } from "@/utils/helper-funcs";
import useCopyToClipboard from "@/utils/useCopyToClipboard";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type TShowMode = 'tooltip';

export function OtpLogTable() {
  
  const queryClient = useQueryClient();
  const [, copy] = useCopyToClipboard();


  const navigate = useNavigate();
  const [show, setShow] = React.useState({
    tooltip:false
  });
  const [copiedId, setCopiedId] = React.useState<null|number>(null);

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

  const { data, isLoading, isError } = useQuery(
    ["all-otp-logs", pagination.page, pagination.pageSize],
    () =>
      OtherService.otpLog(
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


  const handleCloseModal = () => {
    setShow((prev) => ({
  
      tooltip:false
    }));

  };

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      "all-releases",
      pagination.page,
      pagination.pageSize,
    ]);
    handleCloseModal();
  };

  

  const isAnyChecked = () => {
    const allChecks = Object.values({ ...checked });
    return allChecks.some((val) => val === true);
  };


  const handleTooltipClose = () => {
    setShow((prev) => ({ ...prev, tooltip_1: false, tooltip_2: false }));
  };

  const handleTooltipOpen = (code: string) => () => {
    setShow((prev) => ({ ...prev, tooltip: true }));
    copy(code);
  };

  const handleCopyLink = (id:number, name: string) => () => {
    setCopiedId(id);
    handleTooltipOpen(name)();
    setTimeout(() => {
      
      handleTooltipClose()
      setCopiedId(null);
    }, 1000);
  };

  return (
    <StyledPage>
    

      <TableWrapper      handleChangePagination={handleChange}
        pagination={pagination} showPagination>
     
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
                  Phone Number
                </MuiTableCell>

                <MuiTableCell className="heading" align="left">
                  Creation Time
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Sent
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  OTP Code
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

                    <MuiTableCell align="left">
                      {row?.phoneNumber}
                    </MuiTableCell>
                 
                  

                    <MuiTableCell align="left">
                      {formatDate(row?.creationTime || "")}
                    </MuiTableCell>

                    <MuiTableCell align="left">
                    <OrderStatus type={row?.sent ? 'true':'false'} />

                    </MuiTableCell>

                    <MuiTableCell align="left">
                      <MuiBox className="action-group">
                       <MuiTypography>
                        {row?.message?.toLowerCase().replace(/[^0-9]/ig,'')||''}
                       </MuiTypography>
                       <MuiTooltip
                  arrow
                  PopperProps={{
                    // disablePortal: true,
                    sx: {
                      ".MuiTooltip-tooltip": {
                        color: "#fff",
                        background: "#030949",
                      },
                    },
                  }}
                  onClose={handleTooltipClose}
                  open={show.tooltip && row?.id===copiedId}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title="Copied">
                  <MuiIconButton onClick={handleCopyLink(row?.id, row?.message?.toLowerCase().replace(/[^0-9]/ig,'')||'')}>
                    <IconCopyFilled />
                  </MuiIconButton>
                </MuiTooltip>
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
                      title="No Otp Log"
                      icon={<IconNotificationInfo className="icon" />}
                      message="OTP sms will be logged here"></NoData>
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
                <CustomTableSkeleton columns={4} rows={pagination.pageSize} />
              )}
            </MuiTableBody>
          </MuiTable>
        </MuiTableContainer>
      </TableWrapper>

     
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
