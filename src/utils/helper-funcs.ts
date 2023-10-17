import { IPagination, IPaginationResponse } from "@/types/globalTypes";
import { REFRESH_TOKEN_NAME, TOKEN_NAME } from "types/actionTypes";

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const getToken = () => {
  return `Bearer ${sessionStorage.getItem(TOKEN_NAME) || ""}`;
};

export const getRefreshToken = () => {
  return `${sessionStorage.getItem(REFRESH_TOKEN_NAME)}`;
};

export const setRefreshToken = (token: string) => {
  sessionStorage.setItem(REFRESH_TOKEN_NAME, token);
};

export const setAccessToken = (token: string, refreshToken: string) => {
  sessionStorage.setItem(TOKEN_NAME, token);
  sessionStorage.setItem(REFRESH_TOKEN_NAME, refreshToken);
};

export const randomizer = () => {
  const firstDigit = Math.round(Math.random() * 9);
  const secondDigit = Math.round(Math.random() * 9);

  return `${firstDigit}${secondDigit}`;
};

export const formatCurrency = (value: {
  currency?: string;
  style?: string;
  amount: number;
}) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: value.style || "currency",
    currency: value.currency || "NGN",
  });

  return formatter.format(value.amount);
};

export async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export const createPaginationData = (
  data: any,
  pagination: IPaginationResponse
) => {
  const totalEntries = pagination?.totalRecords || 1;
  const totalPages = pagination.totalPages;
  const hasNextPage = pagination.hasNextPage;
  const hasPrevPage = pagination.hasPreviousPage;

  return {
    total: totalEntries,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

export const dataURLtoBlob = (dataurl: string = ",") => {
  var arr = dataurl.split(","),
    mime = arr?.[0]?.match(/:(.*?);/)?.[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};
