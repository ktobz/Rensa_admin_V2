import {
  ICategory,
  IPaginationResponse
} from "@/types/globalTypes";
import { addHours, format, parseISO } from "date-fns";
import { REFRESH_TOKEN_NAME, TOKEN_NAME } from "types/actionTypes";
const HR_TO_MILLISECONDS = 3600000;

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
  amount: number|undefined;
}) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: value.style || "currency",
    currency: value.currency || "NGN",
  });

  return formatter.format(value?.amount||0);
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

export const getIdName = (id: number, list: ICategory[], replaceWith = "_") => {
  return list?.find((x) => id === x?.id)?.name?.replaceAll(" ", replaceWith) ?? "";
};

export const convertDateToTimZone = (d: string, hours: number) => {
  const parsedTime = parseISO(d);

  const dd = addHours(parsedTime, hours);

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

export const getListingTimeRemaining = (
  creationTime: string,
  durationInHours: number
) => {
  const startDateFromBD = creationTime?.replace("Z", "");

  const duration = durationInHours;
  const endTime =
    new Date(`${startDateFromBD}Z`).getTime() + duration * HR_TO_MILLISECONDS;

  const today = new Date().getTime();

  const timeRemaining = endTime > today ? (endTime - today) / 1000 : 0;

  return timeRemaining;
};



export const getUrlExtension = (url:string) => {
    return (url?.split(/[#?]/)?.[0]?.split('.'))?.pop()?.trim();
}

export const onImageEdit = async (imgUrl:string) => {
  let imgExt = getUrlExtension(imgUrl);

  try {
    
    const response = await fetch(imgUrl);
    const blob = await response.blob();
    const file = new File([blob], "profileImage." + imgExt, {
      type: blob.type,
    });

    return file
  } catch (error) {
    return ''
  }

  // let file = await fetch(imgUrl)
  // .then((r) => r.blob())
  // .then(
  //   (blobFile) =>
  //     new File(
  //       [blobFile],
  //       `${Math.floor(Math.random() * 40) + 1}`,
  //       {
  //         type: "image/jpeg",
  //       }
  //     )
  // );
  
}
