import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { format } from "date-fns";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiBox,
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
import { IconVisibility } from "@/lib/mui.lib.icons";

import CustomSearch from "@/components/input/CustomSearch";
import { ICustomerData, IPagination } from "@/types/globalTypes";
import CustomerService from "@/services/customer-service";
import { VerificationStatus } from "@/components/feedback/VerfiedStatus";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

export function CustomersTable() {
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const { data, isLoading, isError } = useQuery(
    ["all-customers", pagination.page, pagination.pageSize],
    () =>
      CustomerService.getAll(
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

        return data as ICustomerData[];
      }),
    {
      retry: 0,
    }
  );

  const handleViewDetails = (data: ICustomerData) => () => {
    navigate(
      `/app/users/cid__${data?.id}__${data?.full_name?.replaceAll(" ", "_")}`,
      {
        state: data,
      }
    );
  };

  return (
    <StyledPage>
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Total Users
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
          <CustomSearch placeholder="Search name, username, email, phone number" />
        </div>
      </div>

      <TableWrapper>
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
                  Full name
                </MuiTableCell>

                <MuiTableCell className="heading" align="left">
                  Phone Number
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Username
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Email address
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Date joined
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Verified
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
                    <MuiTableCell className="order-id" align="left">
                      <b>{row?.full_name}</b>
                    </MuiTableCell>
                    <MuiTableCell align="left">{row?.phone}</MuiTableCell>
                    <MuiTableCell align="left">{row?.user_id}</MuiTableCell>

                    <MuiTableCell align="left">{row?.email}</MuiTableCell>
                    <MuiTableCell align="left">
                      {format(new Date(row?.created_at || ""), "LL MMMM, yyyy")}
                    </MuiTableCell>
                    <MuiTableCell align="left">
                      <VerificationStatus
                        type={row?.profile_image ? "true" : "false"}
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
                    colSpan={7}
                    align="center"
                    className="no-data-cell"
                    rowSpan={20}>
                    <NoData title="No Users yet" message=""></NoData>
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {isError && !data && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={7}
                    className="no-data-cell"
                    align="center">
                    <NoData
                      title="An Error Occurred"
                      message="Sorry, we couldn't fetch Users. Try again later or contact Rensa support."
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
