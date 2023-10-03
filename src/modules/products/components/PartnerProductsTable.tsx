import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import { NoData } from "@/components/feedback/NoData";
import {
  MuiButton,
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

import { IPagination } from "@/types/globalTypes";

import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";
import { createPaginationData, formatCurrency } from "utils/helper-funcs";
import { format } from "date-fns";
import TableWrapper from "@/components/table/TableWrapper";
import {
  IconAdd,
  IconChecked,
  IconDelete,
  IconEdit,
  IconIntermediateCheck,
  IconTag,
  IconUnchecked,
} from "@/lib/mui.lib.icons";

import CustomSearch from "@/components/input/CustomSearch";

import { CustomSwitch } from "@/components/input/CustomSwitch";
import VendgramCustomModal from "@/components/modal/Modal";

import { ProductPriceForm } from "./ProductPriceForm";
import { ProductEntryForm } from "./ProductEntryForm";
import { SetPriceInfo } from "./SetPriceInfo";
import { IProductData } from "../types";
import { DeleteProductConfirm } from "./DeleteProductConfirm";

const data = [
  {
    id: "43579",
    customer: "Timothy Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Lekki Branch",
    amount: 23000,
    status: "new",
  },
  {
    id: "4358",
    customer: "Jame Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "John Branch",
    amount: 23000,
    status: "picked-up",
  },
  {
    id: "43577",
    customer: "Peter Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Ajah Branch",
    amount: 23000,
    status: "cancelled",
  },
  {
    id: "43570",
    customer: "Timothy Orbik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "Lekki Branch",
    amount: 2300,
    status: "delivered",
  },
  {
    id: "43589",
    customer: "Timothy OrbJamesik",
    created_at: new Date().toJSON(),
    scheduled_at: new Date().toJSON(),
    branch: "James Branch",
    amount: 23000,
    status: "confirmed",
  },
];

// const data: IProductData[] = [];

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type TShowMode = "product" | "setPrice" | "info" | "delete";

export function PartnerProductsTable() {
  const navigate = useNavigate();
  const [show, setShow] = React.useState({
    product: false,
    setPrice: false,
    info: false,
    delete: false,
  });

  const [deleteData, setDeleteData] = React.useState<any[]>([]);
  const [editData, setEditData] = React.useState<null | IProductData>(null);
  const [checked, setChecked] = React.useState(() => {
    const states: { [key: string]: boolean } = {};

    for (let i = 0; i < data.length; i += 1) {
      states[data[i].id] = false;
    }

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
    if (name === "product" && !show.product && data.length === 0) {
      // if no product is added or created yet - Show info modal
      return setShow((prev) => ({ ...prev, info: true }));
    }
    setShow((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleHide = () => {
    setShow((prev) => ({
      product: false,
      setPrice: false,
      info: false,
      delete: false,
    }));
  };

  const handleShowPriceForm = () => {
    setShow((prev) => ({
      product: false,
      setPrice: true,
      info: false,
      delete: false,
    }));
  };

  const handleSetDeleteData = (data: IProductData) => () => {
    setDeleteData(() => [data]);
    setShow((prev) => ({ ...prev, delete: true }));
  };

  const handleSetDeleteAllData = () => {
    const allCheckedProducts = { ...checked };
    const dataToDelete = [];

    for (let i = 0; i < data.length; i += 1) {
      if (checked[data[i]?.id]) {
        dataToDelete.push(data[i]);
      }
    }

    setDeleteData(dataToDelete);
    setShow((prev) => ({ ...prev, delete: true }));
  };

  const handleSetEditData = (data: IProductData) => () => {
    setEditData(data);
    setShow((prev) => ({ ...prev, product: true }));
  };

  // const { data, isLoading, isError } = useQuery(
  //   [
  //     "all-user-cards-transactions",
  //     pagination.page,
  //     pagination.pageSize,
  //     variant,
  //   ],
  //   () =>
  //     CardService.getAllTransactions(
  //       `?pgn=${pagination.page}&pgs=${pagination.pageSize}`
  //     ).then((res) => {
  //       const data = res.data?.data;
  //       const { hasNextPage, hasPrevPage, total, totalPages } =
  //         createPaginationData(data, pagination);

  //       setPagination((prev) => ({
  //         ...prev,
  //         total,
  //         totalPages,
  //         hasNextPage,
  //         hasPrevPage,
  //       }));

  //       return data.data as ITransactionHistoryData[];
  //     }),
  //   {
  //     retry: 0,
  //   }
  // );

  const handleChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewDetails = (id: string) => () => {
    navigate(`/app/orders/${id}`);
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
            Products
          </MuiTypography>
        </div>
        <div className="action-section">
          <CustomSearch placeholder="Search branch name" />
        </div>
      </div>

      <TableWrapper>
        {numOfChecked > 1 && (
          <div className="group-selection">
            <MuiTypography variant="body2" className="info">
              You selected <b>{numOfChecked}</b> products
            </MuiTypography>
            <div className="actions">
              <CustomSwitch color="primary" />{" "}
              <span className="label publish-label">publish all</span>
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
                    checked={numOfChecked === data.length && data.length > 0}
                    indeterminate={
                      numOfChecked > 0 && numOfChecked < data.length
                    }
                    onChange={handleChangeAll}
                  />
                </MuiTableCell>
                <MuiTableCell
                  className="heading"
                  align="left"
                  style={{ minWidth: "150px" }}>
                  Product ID
                </MuiTableCell>
                <MuiTableCell className="heading">Customer</MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Price/Litre
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Sale Quantity (LTRS)
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Unit Price
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Publish
                </MuiTableCell>
                <MuiTableCell className="heading" align="left">
                  Edit
                </MuiTableCell>
                <MuiTableCell className="heading" align="center">
                  Delete
                </MuiTableCell>
              </MuiTableRow>
            </MuiTableHead>

            <MuiTableBody>
              {data?.map((row) => (
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
                  <MuiTableCell className="order-id" align="left">
                    <b>#{row?.id}</b>
                  </MuiTableCell>
                  <MuiTableCell>{row?.customer || "-"}</MuiTableCell>
                  <MuiTableCell align="left">
                    {format(new Date(row?.created_at || ""), "LL MMMM, yyyy")}
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    {format(new Date(row?.created_at || ""), "LL MMMM, yyyy")}
                  </MuiTableCell>
                  <MuiTableCell align="left">{row?.branch}</MuiTableCell>
                  <MuiTableCell align="left">
                    <CustomSwitch color="primary" />
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    <MuiIconButton
                      color="warning"
                      onClick={handleSetEditData(row)}
                      className={`action-btn edit-btn `}>
                      <IconEdit />
                    </MuiIconButton>
                  </MuiTableCell>
                  <MuiTableCell align="left">
                    <MuiIconButton
                      color="error"
                      onClick={handleSetDeleteData(row)}
                      className="action-btn delete-btn">
                      <IconDelete />
                    </MuiIconButton>
                  </MuiTableCell>
                </MuiTableRow>
              ))}

              {/* {!isLoading && data && data?.length === 0 && !isError && ( */}

              {data && data?.length === 0 && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={9}
                    align="center"
                    className="no-data-cell"
                    rowSpan={20}>
                    <NoData
                      title="No product added"
                      message="Partner products added will appear here ">
                      <div className="btn-group">
                        <MuiButton
                          startIcon={<IconTag />}
                          variant="outlined"
                          color="secondary"
                          onClick={handleToggleShow("setPrice")}
                          className="btn">
                          Set Price
                        </MuiButton>
                        <MuiButton
                          startIcon={<IconAdd />}
                          variant="contained"
                          color="secondary"
                          onClick={handleToggleShow("product")}
                          className="btn">
                          Add Product
                        </MuiButton>
                      </div>
                    </NoData>
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {/* {isError && !data && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={8}
                    className="no-data-cell"
                    align="center">
                    <NoData
                      title="An Error Occurred"
                      message="Sorry, we couldn't fetch your products. Try again later or contact Rensa support."
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )} */}

              {/* {!data && isLoading && (
                <CustomTableSkeleton columns={8} rows={10} />
              )} */}
            </MuiTableBody>
          </MuiTable>
        </MuiTableContainer>
      </TableWrapper>
      <VendgramCustomModal
        handleClose={handleToggleShow("setPrice")}
        open={show.setPrice}
        alignTitle="left"
        title="Product Price"
        showClose>
        <ProductPriceForm />
      </VendgramCustomModal>
      <VendgramCustomModal
        handleClose={handleToggleShow("product")}
        open={show.product}
        alignTitle="left"
        title={editData ? "Edit Product" : "Add Product"}
        showClose>
        <ProductEntryForm
          mode={editData ? "edit" : "new"}
          initData={editData}
          handleShowSetPrice={handleShowPriceForm}
        />
      </VendgramCustomModal>

      <VendgramCustomModal
        handleClose={handleToggleShow("info")}
        open={show.info}
        showClose>
        <SetPriceInfo handleShowSetPrice={handleShowPriceForm} />
      </VendgramCustomModal>
      {/* <VendgramCustomModal
        handleClose={handleToggleShow("delete")}
        open={show.delete}
        showClose>
        <DeleteProductConfirm
          data={deleteData}
          handleClose={handleToggleShow("delete")}
        />
      </VendgramCustomModal> */}
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

  & .top-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    & .heading {
      font-weight: 600;
      color: #000;
      font-size: 16px;
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

  & .btn-group {
    display: flex;
    align-items: center;
    gap: 10px;

    & .btn {
      height: 36px;
      font-size: 12px;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
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
