import {
  ICategory,
  IPagination,
  IPaginationResponse,
} from "@/types/globalTypes";
import { format, parseISO, addHours } from "date-fns";
import {
  format as fnFormat,
  utcToZonedTime,
  zonedTimeToUtc,
} from "date-fns-tz";
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
  const totalEntries = pagination?.totalRecords || 0;
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

export const formatDate = (
  date: string | Date,
  pattern: string = "do LLLL yyyy"
) => {
  const value = format(new Date(date || ""), pattern);

  return value;
};

export const getIdName = (id: number, list: ICategory[]) => {
  return list?.find((x) => id === x?.id)?.name?.replaceAll(" ", "_") || "";
};

export const convertDateToTimZone = (d: string) => {
  const parsedTime = parseISO(d);
  const dd = addHours(parsedTime, 1); // one for UTC to GMT conversion
  return dd;
};

export const formatToPrice = (amount: string, oldValue = "") => {
  const stringedAmount = amount?.replaceAll(",", "");
  const dupStringedAmount = amount?.replaceAll(",", "");
  const numberAmount = Number(stringedAmount);
  const hasDecimal = dupStringedAmount.includes(".");
  const decimalPart = dupStringedAmount.split(".")[1] || "";

  // Check if the input is a valid number
  if (isNaN(numberAmount)) {
    return oldValue;
  }

  let [whole, decimal] = numberAmount?.toFixed(2).toString().split(".");
  // Add commas to the whole part every three digits from the right
  whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return the formatted currency string
  return whole + `${hasDecimal ? `.${decimalPart}` : ""}`;
};

export const formatNumber = (num: string) => {
  const stringNumber = num?.replace(/[^0-9.]/g, "");
  return stringNumber;
};

export function isValidNumberInput(input: string) {
  // Check if input contains only digits and at most one period
  return /^[0-9]*\.?[0-9]*$/.test(input);
}
