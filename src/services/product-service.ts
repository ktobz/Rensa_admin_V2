import { getToken } from "utils/helper-funcs";
import HTTP from "./Http";
import { IBranchEntryProps } from "@/types/globalTypes";
const PATHS = {
  productList: "/admin/products/filter",
  product: "/admin/partners",
  calculatePrice: "/admin/products/calculate-gross-profit",
  productPrice: "/admin/product-prices",
  changePublishStatus: "/admin/products/change-publish-status",
  categories: "/admin/product-categories",
  updateStatus: "/admin/products/multiple-products/change-status",
  multipleDelete: "/admin/products/multiple-products/delete",
};

const ProductService = {
  create(partnerId: string, data: any) {
    return HTTP.post(`${PATHS.product}/${partnerId}/products`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  addProductPrice(data: any) {
    return HTTP.post(`${PATHS.productPrice}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  getProductPrice() {
    return HTTP.get(`${PATHS.productPrice}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  getAProductPrice(id: number | string) {
    return HTTP.get(`${PATHS.productPrice}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  update(partnerId: string, id: string, data: any) {
    return HTTP.put(`${PATHS.product}/${partnerId}/products/${id}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  getAll(partnerId: string, name: string, query?: string) {
    return HTTP.get(
      `${PATHS.product}/${partnerId}/products/filter/${name}${
        query ? query : ""
      }`,
      {
        headers: {
          Authorization: getToken(),
        },
      }
    );
  },

  changeVisibility(id: number | string) {
    return HTTP.put(`${PATHS.changePublishStatus}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  multipleVisibilityUpdate(data: { product_id: string[]; status: boolean }) {
    return HTTP.put(`${PATHS.updateStatus}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  multipleDelete(data: { product_id: string[] }) {
    return HTTP.put(`${PATHS.multipleDelete}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  calculateGrossProfit(data: any) {
    return HTTP.post(`${PATHS.calculatePrice}`, data, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
  delete(id: number | string) {
    return HTTP.delete(`${PATHS.product}/${id}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },

  productCategory() {
    return HTTP.get(`${PATHS.categories}`, {
      headers: {
        Authorization: getToken(),
      },
    });
  },
};

export default ProductService;
