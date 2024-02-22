import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import { NoData } from "@/components/feedback/NoData";
import {
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
import CustomTableSkeleton from "@/components/skeleton/CustomTableSkeleton";
import TableWrapper from "@/components/table/TableWrapper";
import ListingService from "@/services/listing-service";
import { createPaginationData, formatDate } from "@/utils/helper-funcs";

const data = [
  {
    id: "43579",
    customer: "Timothy Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Lekki Branch",
    amount: 23000,
    amount_settled: 2000,
    service_fee: 2300,
    status: "hold",
    settlement: "active",

    time: 0,
  },
  {
    id: "4358",
    customer: "Jame Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "John Branch",
    amount: 33000,
    amount_settled: 1000,
    service_fee: 2200,
    status: "sold",
    settlement: "delivered",

    time: 0,
  },
  {
    id: "43577",
    customer: "Peter Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Ajah Branch",
    amount: 23000,
    amount_settled: 2000,
    service_fee: 2300,
    status: "closed",
    settlement: "closed",

    time: 0,
  },
  {
    id: "43570",
    customer: "Timothy Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Lekki Branch",
    amount: 2300,
    amount_settled: 2000,
    service_fee: 2300,
    status: "error",
    settlement: "closed",

    time: 20,
  },
  {
    id: "43589",
    customer: "Timothy OrbJamesik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "James Branch",
    amount: 23000,
    amount_settled: 2000,
    service_fee: 2300,
    status: "warning",
    settlement: "pending",
    time: 220,
  },
];

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type IProps = {
  showPagination?: boolean;
  listingId: string;
};

export function ReportedComments({
  showPagination = false,
  listingId,
}: IProps) {
  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState<IPagination>(defaultQuery);

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  const [filter, setFilter] = React.useState<number[]>([]);

  const { data, isLoading, isError } = useQuery(
    ["single-listing-reports", listingId, pagination.page, pagination.pageSize],
    () =>
      ListingService.getListingReportComments(
        listingId,
        `?pageNumber=${pagination.page}&pageSize=${pagination?.pageSize}`
      ).then((res) => {
        // const { , ...paginationData } = res.data?.result;
        // const { hasNextPage, hasPrevPage, total, totalPages } =
        //   createPaginationData(data, paginationData);

        // setPagination((prev) => ({
        //   ...prev,
        //   total,
        //   totalPages,
        //   hasNextPage,
        //   hasPrevPage,
        // }));

        return res?.data?.result || [];
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewDetails = (id: string) => () => {
    navigate(`${id}`);
  };

  return (
    <StyledPage>
      <div className="tab-section">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Reported comments
          </MuiTypography>
        </div>
      </div>

      <TableWrapper className="table" showPagination={showPagination}>
        <MuiTableContainer
          sx={{
            maxWidth: "100%",
            minHeight: data?.comments?.length === 0 ? "inherit" : "unset",
            flex: 1,
          }}>
          <MuiTable
            sx={{
              minWidth: 750,
              minHeight: data?.comments?.length === 0 ? "inherit" : "unset",
            }}
            aria-label="simple table">
            <MuiTableHead>
              <MuiTableRow>
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "150px" }}>
                  Date
                </MuiTableCell>
                {/* <MuiTableCell className="heading" align="left">
                  Category
                </MuiTableCell> */}
                <MuiTableCell className="heading" align="left">
                  Reported by
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Reason
                </MuiTableCell>

                <MuiTableCell className="heading" align="center"></MuiTableCell>
              </MuiTableRow>
            </MuiTableHead>

            <MuiTableBody>
              {data?.comments?.map((row, index) => (
                <MuiTableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}>
                  <MuiTableCell className="order-id" align="left">
                    {formatDate(row?.creationTime)}
                  </MuiTableCell>
                  {/* <MuiTableCell align="left">
                    {" "}
                    {data?.catalogue?.catalogueCategoryName || "-"}
                  </MuiTableCell> */}
                  <MuiTableCell align="left">
                    <Link to="#" className="reporter">
                      {row?.username || "-"}
                    </Link>
                  </MuiTableCell>
                  <MuiTableCell align="left">{row?.reason}</MuiTableCell>
                </MuiTableRow>
              ))}

              {!isLoading &&
                data?.comments &&
                data?.comments?.length === 0 &&
                !isError && (
                  <MuiTableRow>
                    <MuiTableCell
                      colSpan={4}
                      align="center"
                      className="no-data-cell"
                      rowSpan={20}>
                      <NoData
                        title="No Reported comments"
                        message="Reported comments will appear here"
                      />
                    </MuiTableCell>
                  </MuiTableRow>
                )}

              {isError && !data?.comments && (
                <MuiTableRow>
                  <MuiTableCell
                    colSpan={8}
                    className="no-data-cell"
                    align="center">
                    <NoData
                      title="An Error Occurred"
                      message="Sorry, we couldn't fetch reported comments. Try again later or contact Rensa support."
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {!data && isLoading && (
                <CustomTableSkeleton columns={4} rows={8} />
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

  & .table {
    min-height: 300px;
  }

  & .action-section {
    flex: 1;
    display: flex;
    justify-content: end;
    align-items: center;
    max-width: 700px;
  }

  & .top-section {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;

    & .view-all {
      height: fit-content;
      min-height: fit-content;
      font-family: "Helvetica";
    }

    & .heading {
      font-weight: 600;
      font-size: 18px;
    }
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 30px 0 15px 0;
  }
`;
