import * as React from "react";

import { NoData } from "@/components/feedback/NoData";
import { MuiPagination, MuiTypography, styled } from "@/lib/index";

import { IPagination } from "@/types/globalTypes";

type IProps = {
  showPagination?: boolean;
  pagination?: IPagination;
  handleChangePagination?: (page: number) => void;
  children: React.ReactNode;
};

const paginationData: IPagination = {
  pageSize: 15,
  page: 1,
  total: 20,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 20,
};

export default function TableWrapper({
  showPagination = false,
  pagination = paginationData,
  handleChangePagination,
  children,
}: IProps) {
  const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
    if (handleChangePagination) {
      handleChangePagination(page);
    }
  };

  return (
    <StyledWrapper>
      {children}

      {showPagination && pagination && pagination?.total > 0 && (
        <StyledPagination>
          <MuiTypography variant="subtitle2" className="total">
            Showing{" "}
            {pagination.pageSize * pagination.page > pagination.total
              ? pagination.total
              : pagination.pageSize * pagination.page}{" "}
            of {pagination.total} entries
          </MuiTypography>
          <div className="pagination">
            <MuiPagination
              count={pagination.totalPages}
              onChange={handleChange}
              color="primary"
              // variant=""
              shape="rounded"
              sx={{
                "& .Mui-selected": {
                  color: "#fff",
                },
                "& .MuiPaginationItem-previousNext": {
                  backgroundColor: "#fff",
                  borderColor: "#fff",
                  color: "#F05B2A",
                },
              }}
            />
          </div>
        </StyledPagination>
      )}
    </StyledWrapper>
  );
}

const StyledPagination = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  gap: 20px;
  padding: 20px;

  & .total {
    color: #64748b;
  }

  & .MuiPaginationItem-root {
    background: #eff2f5;
    border-color: #eff2f5;
    color: #aeaeae;
  }

  & .MuiPaginationItem-ellipsis {
    padding: 6px 2px;
    border-radius: 5px;
  }

  & .Mui-selected {
    color: #fff;
    border: 1px solid rgba(240, 91, 42, 0.5);
    background-color: #f05b2a;
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const StyledWrapper = styled.div`
  width: 100%;
  min-height: 600px;
  position: relative;

  /* overflow: hidden; */
  background-color: #fff;
  border: 1px solid #f4f4f4;
  border-radius: 6px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & .MuiTable-root,
  .MuiTableContainer-root {
    /* min-height: inherit; */
  }

  & .MuiTableContainer-root {
    padding: 10px;
  }

  & .MuiTableHead-root {
    background-color: #fbfbfb;
    border-radius: 10px;
    overflow: hidden;

    & .MuiTableRow-root {
      & .MuiTableCell-root:first-child {
        border-radius: 10px 0 0 10px;
      }

      & .MuiTableCell-root:last-child {
        border-radius: 0 10px 10px 0;
      }

      .MuiTableCell-root {
        border: none !important;
        color: #64748b !important;
        /* padding-top: 15px; */
        /* padding-bottom: 15px; */
        border-bottom: none;
      }
    }
  }

  & .no-data {
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;
    margin: auto;
    max-width: 200px;
    padding: 40px 0;

    & .image {
      border-radius: 50%;
      width: 160px;
      height: 160px;
      background: #f4f4f4;
    }
    & .title {
      text-align: center;
      font-size: 20px;
      line-height: 23px;
      text-align: center;
      color: #000000;
    }
  }

  & .heading {
    color: gray !important;
  }

  .MuiTableCell-root {
    padding: 12px 15px;
    color: #000;
    border-bottom: 1px solid #fbfbfb;
    min-height: unset;
    font-family: "Inter";
    /* font-weight: 500; */
  }

  & .no-data-cell {
    border: none;
  }

  .MuiTableRow-root {
    height: 40px;
  }
  & td {
    font-size: 12px;
    /* padding: 20px 0; */
  }
`;

type IStatus = "pending" | "successful" | "declined" | "received";
type IStyled = {
  status: IStatus;
};
const StyledStatus = styled.span<IStyled>`
  display: inline-block;
  border-radius: 30px;
  text-transform: capitalize;
  padding: 5px 10px;

  color: ${({ status }) =>
    status === "pending"
      ? "#000"
      : status === "successful" || status === "received"
      ? "#00B212"
      : "#FF2828"};
  background: ${({ status }) =>
    status === "pending"
      ? "#F3F3F3"
      : status === "successful" || status === "received"
      ? "#E9FFEE"
      : "#FFEBEB"};
`;
