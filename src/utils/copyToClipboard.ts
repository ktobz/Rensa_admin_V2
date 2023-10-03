import { toast } from "react-toastify";

async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export const handleCopy = (text: string) => (e: any) => {
  // Asynchronously call copyTextToClipboard
  copyTextToClipboard(text)
    .then(() => {
      toast.success("Copied");
    })
    .catch((err) => {
      toast.error("Failed to copy.");
    });
  e?.stopPropagation();
};
