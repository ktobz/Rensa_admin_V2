import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";

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

import CustomTableSkeleton from "components/skeleton/CustomTableSkeleton";
import { formatCurrency } from "utils/helper-funcs";
import TableWrapper from "@/components/table/TableWrapper";
import {
  IconAdd,
  IconChecked,
  IconDelete,
  IconDiesel,
  IconEdit,
  IconIntermediateCheck,
  IconLPG,
  IconOil,
  IconPetrol,
  IconTag,
  IconUnchecked,
} from "@/lib/mui.lib.icons";
import CustomTabs from "@/components/other/CustomTabs";
import CustomTab from "@/components/other/CustomTab";
import CustomSearch from "@/components/input/CustomSearch";
import { CustomSwitch } from "@/components/input/CustomSwitch";
import VendgramCustomModal from "@/components/modal/Modal";
import { ProductPriceForm } from "./ProductPriceForm";
import { ProductEntryForm } from "./ProductEntryForm";
import { SetPriceInfo } from "./SetPriceInfo";
import { IProductData } from "../types";
import { DeleteProductConfirm } from "./DeleteProductConfirm";
import ProductService from "@/services/product-service";
import { toast } from "react-toastify";
import { ProductVisibilityConfirm } from "./ProductVisibilityConfirm";
import { IPagination } from "@/types/globalTypes";
import { useIds } from "@/utils/hooks";

const defaultQuery: IPagination = {
  pageSize: 15,
  page: 1,
  total: 1,
  hasNextPage: false,
  hasPrevPage: false,
  totalPages: 1,
};

type TShowMode = "product" | "setPrice" | "info" | "delete" | "updateStatus";
const productCat: { [key: number]: string } = {
  0: "petrol",
  1: "diesel",
  2: "lpg",
  3: "oil & lubricants",
};

export function ProductsTable() {
  const { partnerId } = useIds();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [show, setShow] = React.useState({
    product: false,
    setPrice: false,
    info: false,
    delete: false,
    updateStatus: false,
  });

  const [allData, setAllData] = React.useState<IProductData[]>([]);
  const [deleteData, setDeleteData] = React.useState<IProductData[]>([]);
  const [updateData, setUpdateData] = React.useState<IProductData[]>([]);
  const [editData, setEditData] = React.useState<null | IProductData>(null);

  const [updateStatus, setUpdateStatus] = React.useState(false);
  const [checked, setChecked] = React.useState(() => {
    const states: { [key: string]: boolean } = {};

    for (let i = 0; i < allData.length; i += 1) {
      states[allData[i]?.id] = false;
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
    return 0;
  });
  const [currentName, setCurrentName] = React.useState(() => {
    return productCat[current];
  });

  const handleChangeIndex = (index: number) => () => {
    setCurrent(index);
    setCurrentName(productCat[index]);
    setPagination(defaultQuery);
  };

  const handleCheck =
    (id: string) =>
    (event: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
      setChecked((prev) => ({ ...prev, [id]: value }));
    };

  const handleChangeAll = (
    event: React.ChangeEvent<HTMLInputElement>,
    checkValue: boolean
  ) => {
    const allChecks = { ...checked };

    for (let val of allData) {
      allChecks[val?.id] = checkValue;
    }

    setChecked((prev) => allChecks);
  };

  const handleToggleShow = (name: TShowMode) => () => {
    if (name === "product") {
      setEditData(null);
    }
    setShow((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleShowPriceForm = () => {
    setShow((prev) => ({
      product: false,
      setPrice: true,
      info: false,
      delete: false,
      updateStatus: false,
    }));
  };

  const handleSetDeleteData = (data: IProductData[]) => () => {
    setDeleteData(() => data);
    setShow((prev) => ({ ...prev, delete: true }));
  };

  const handleSetDeleteAllData = () => {
    const dataToDelete = [];

    for (let i = 0; i < allData?.length; i += 1) {
      if (checked[allData?.[i]?.id]) {
        dataToDelete.push(allData?.[i]);
      }
    }

    setDeleteData(dataToDelete);
    setShow((prev) => ({ ...prev, delete: true }));
  };

  const handleSetEditData = (data: IProductData) => () => {
    setEditData(data);
    setShow((prev) => ({ ...prev, product: true }));
  };

  const handleSetCheckStatus = (data: IProductData[]) => {
    const states: { [key: string]: boolean } = {};

    for (let i = 0; i < data.length; i += 1) {
      states[data[i]?.id] = false;
    }
    setChecked(states);
  };

  const handleSetUpdateStatusData = (data: IProductData[]) => () => {
    setUpdateData(() => data);
    setShow((prev) => ({ ...prev, updateStatus: true }));
  };

  const { data, isLoading, isError } = useQuery(
    [
      "all-products",
      pagination.page,
      pagination.pageSize,
      currentName,
      partnerId,
    ],
    () =>
      ProductService.getAll(
        partnerId,
        currentName,
        `?page=${pagination.page}&perPage=${pagination.pageSize}`
      ).then((res) => {
        const data = res.data?.data;
        setAllData(data);
        handleSetCheckStatus(data);

        // const { hasNextPage, hasPrevPage, total, totalPages } =
        //   createPaginationData(data, pagination);

        // setPagination((prev) => ({
        //   ...prev,
        //   total,
        //   totalPages,
        //   hasNextPage,
        //   hasPrevPage,
        // }));

        return data as any[];
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleCloseModal = () => {
    setShow((prev) => ({
      product: false,
      setPrice: false,
      info: false,
      delete: false,
      updateStatus: false,
    }));
    setEditData(null);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries([
      "all-products",
      pagination.page,
      pagination.pageSize,
      currentName,
      partnerId,
    ]);
    handleCloseModal();
  };

  const handleChange = (page: number) => {
    setPagination((prev: any) => ({ ...prev, page }));
  };

  const handleViewDetails = (id: string) => () => {
    navigate(`/app/orders/${id}`);
  };

  const handleDeleteProducts = (callback: () => void) => () => {
    const ids = deleteData
      ?.filter((x) => checked[x.id || 0])
      ?.map((data) => data?.id || "");
    (ids?.length > 1
      ? ProductService.multipleDelete({
          product_id: ids,
        })
      : ProductService.delete(ids?.[0] || 0)
    )
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

  const handleUpdateProductStatus = (callback: () => void) => () => {
    const ids = updateData
      ?.filter((x) => checked[x.id || 0])
      ?.map((data) => data?.id || "");
    (ids?.length > 1
      ? ProductService.multipleVisibilityUpdate({
          product_id: ids,
          status: updateStatus,
        })
      : ProductService.changeVisibility(ids?.[0] || 0)
    )
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

  const handleSetStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setUpdateStatus((prev) => checked);
  };

  return (
    <StyledPage>
      <div className="tab-section">
        <CustomTabs variant="scrollable" value={current || 0} className="tabs">
          <CustomTab
            onClick={handleChangeIndex(0)}
            value={0}
            label="Petrol"
            current={current}
            icon={<IconPetrol />}
            variant="primary"
          />
          <CustomTab
            onClick={handleChangeIndex(1)}
            value={1}
            label="Diesel"
            current={current}
            icon={<IconDiesel />}
            variant="primary"
          />
          <CustomTab
            onClick={handleChangeIndex(2)}
            value={2}
            label="LPG"
            current={current}
            icon={<IconLPG />}
            variant="primary"
          />
          <CustomTab
            onClick={handleChangeIndex(3)}
            value={3}
            label="Oils & Lubricants"
            current={current}
            icon={<IconOil />}
            variant="primary"
          />
        </CustomTabs>

        <div className="action-section">
          <CustomSearch placeholder="Search product name, product ID" />
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
        </div>
      </div>

      <TableWrapper>
        {numOfChecked > 1 && (
          <div className="group-selection">
            <MuiTypography variant="body2" className="info">
              You selected <b>{numOfChecked}</b> products
            </MuiTypography>
            <div className="actions">
              <CustomSwitch
                color="primary"
                defaultChecked={updateStatus}
                value={updateStatus}
                checked={updateStatus}
                onChange={handleSetStatus}
              />
              <MuiButton
                variant="text"
                className="btn publish-label"
                onClick={handleSetUpdateStatusData(allData)}>
                publish
              </MuiButton>

              <MuiButton
                variant="text"
                color="error"
                startIcon={<IconDelete />}
                onClick={handleSetDeleteAllData}
                className="label delete-label ">
                delete all
              </MuiButton>
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
                    checked={
                      numOfChecked === allData?.length && allData?.length > 0
                    }
                    indeterminate={
                      numOfChecked > 0 &&
                      allData &&
                      numOfChecked < allData?.length
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
                {current === 3 ? (
                  <>
                    <MuiTableCell className="heading" align="left">
                      Product Name
                    </MuiTableCell>
                    <MuiTableCell className="heading" align="left">
                      Product Price
                    </MuiTableCell>
                  </>
                ) : (
                  <>
                    <MuiTableCell className="heading" align="left">
                      Price/Litre
                    </MuiTableCell>
                    <MuiTableCell className="heading" align="left">
                      Sale Quantity (LTRS)
                    </MuiTableCell>
                    <MuiTableCell className="heading" align="left">
                      Product Price
                    </MuiTableCell>
                  </>
                )}

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
              {data &&
                !isLoading &&
                data?.map((row) => (
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
                        // defaultChecked={checked[row.id]}
                      />
                    </MuiTableCell>
                    <MuiTableCell className="order-id" align="left">
                      #{row?.productId}
                    </MuiTableCell>
                    {current === 3 ? (
                      <>
                        <MuiTableCell align="left">
                          {row?.name} - {row?.sale_quantity} LTRS
                        </MuiTableCell>
                        <MuiTableCell align="left">
                          {formatCurrency({ amount: row?.gross_price })}
                        </MuiTableCell>
                      </>
                    ) : (
                      <>
                        <MuiTableCell align="left">
                          ₦{row?.price_litre}/ltr
                        </MuiTableCell>
                        <MuiTableCell align="left">
                          {row?.sale_quantity} LTRS
                        </MuiTableCell>
                        <MuiTableCell align="left">
                          {formatCurrency({ amount: row?.gross_price })}
                        </MuiTableCell>
                      </>
                    )}

                    <MuiTableCell align="left">
                      <CustomSwitch
                        color="primary"
                        defaultChecked={row?.publish}
                        value={row?.publish}
                        checked={row?.publish}
                        onClick={handleSetUpdateStatusData([row])}
                      />
                      {/* <span style={{ paddingLeft: "10px" }}>
                        {row?.publish ? "Active" : "Inactive"}
                      </span> */}
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
                        onClick={handleSetDeleteData([row])}
                        className="action-btn delete-btn">
                        <IconDelete />
                      </MuiIconButton>
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
                      title="No product added"
                      message="You can start by setting product pump/sale price for required categories then adding product to your list">
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

              {isError && !data && (
                <MuiTableRow>
                  {" "}
                  <MuiTableCell
                    colSpan={current === 3 ? 7 : 8}
                    className="no-data-cell"
                    align="center">
                    <NoData
                      title="An Error Occurred"
                      message="Sorry, we couldn't fetch your products. Try again later or contact Rensa support."
                    />
                  </MuiTableCell>
                </MuiTableRow>
              )}

              {!data && isLoading && (
                <CustomTableSkeleton
                  columns={current === 3 ? 7 : 8}
                  rows={10}
                />
              )}
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
          refreshQuery={handleRefresh}
          partnerId={partnerId}
        />
      </VendgramCustomModal>

      <VendgramCustomModal
        handleClose={handleToggleShow("info")}
        open={show.info}
        showClose>
        <SetPriceInfo handleShowSetPrice={handleShowPriceForm} />
      </VendgramCustomModal>
      <VendgramCustomModal
        handleClose={handleToggleShow("delete")}
        open={show.delete}
        showClose>
        <DeleteProductConfirm
          data={deleteData}
          handleClose={handleToggleShow("delete")}
          handleDelete={handleDeleteProducts}
        />
      </VendgramCustomModal>

      <VendgramCustomModal
        handleClose={handleToggleShow("updateStatus")}
        open={show.updateStatus}
        showClose>
        <ProductVisibilityConfirm
          data={updateData}
          handleUpdate={handleUpdateProductStatus}
          handleClose={handleToggleShow("updateStatus")}
          action={
            updateData?.length > 1
              ? updateStatus
                ? "active"
                : "inactive"
              : updateData?.[0]?.publish
              ? "inactive"
              : "active"
          }
        />
      </VendgramCustomModal>
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;

  & .order-id {
    font-weight: 600;
    color: #1e75bb;
    /* font-size: 13px; */
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
      min-height: fit-content;
      height: fit-content;
    }

    & .actions {
      display: flex;
      gap: 10px;
      align-items: center;

      & .btn {
        height: fit-content;
        min-height: fit-content;
        color: #1b76ff;
      }
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
