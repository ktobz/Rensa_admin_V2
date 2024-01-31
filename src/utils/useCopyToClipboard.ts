import { useState } from "react";
import { toast } from "react-toastify";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      toast.error("Copy failed");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      // toast.success("Copied");
      return true;
    } catch (error) {
      toast.error("Copy failed");
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}

export default useCopyToClipboard;
