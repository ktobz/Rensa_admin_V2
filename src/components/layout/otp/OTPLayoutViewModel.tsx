import * as React from "react";

type IViewProps = {
  onVerify?: (otp: string, callback: () => void) => void;
  resendOTP?: (callback: () => void) => void;
  otpLength: number;
};

export default function useOTPLayoutViewModel({
  onVerify,
  resendOTP,
  otpLength,
}: IViewProps) {
  const [status, setStatus] = React.useState({
    isFocused: false,
    isResending: false,
    isSubmitting: false,
  });
  const PIN_LENGTH = otpLength;
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [otp, setOtp] = React.useState<[] | string[]>([]);
  const isDisabled = otp.length === PIN_LENGTH;

  const handleSetFocus = () => {
    if (inputRef.current) {
      inputRef.current?.focus();
      setStatus((prev) => ({ ...prev, isFocused: true }));
    }
  };

  const handleBlur = () => {
    if (inputRef.current) {
      inputRef.current?.blur();
      setStatus((prev) => ({ ...prev, isFocused: false }));
    }
  };

  const replaceNonNumeric = (stringDigit: string) => {
    return String(stringDigit).replaceAll(/[^0-9]/g, "");
  };

  const verifyCallback = () => {
    setStatus((prev) => ({ ...prev, isSubmitting: false, isFocused: true }));
    setOtp([]);
  };

  const handleVerify = (otp: string[]) => () => {
    setStatus((prev) => ({ ...prev, isSubmitting: true }));
    onVerify?.(otp.join(""), verifyCallback);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const digit = replaceNonNumeric(value);
    const newOtp = digit.split("");
    setOtp(() => [...newOtp]);
    if (newOtp && newOtp.length >= 6) {
      handleVerify(newOtp)();
    }
  };

  const resendCallback = () => {
    setStatus((prev) => ({ ...prev, isResending: false, isFocused: true }));
  };

  const handleResendOTP = () => {
    setStatus((prev) => ({ ...prev, isResending: true }));
    setOtp([]);

    if (resendOTP) {
      resendOTP?.(resendCallback);
    }
  };

  React.useEffect(() => {
    setStatus((prev) => ({ ...prev, isFocused: true }));
  }, []);

  return {
    handleResendOTP,
    handleBlur,
    handleInputChange,
    handleVerify,
    isDisabled,
    handleSetFocus,
    status,
    otp,
    inputRef,
  };
}
