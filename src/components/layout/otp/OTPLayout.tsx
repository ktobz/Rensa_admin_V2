import * as React from "react";
import {
  MuiBox,
  MuiButton,
  MuiCircularProgress,
  MuiTypography,
  styled,
} from "lib/index";

import Title from "components/text/Title";
import Subtitle from "components/text/Subtitle";
import useOTPLayoutViewModel from "./OTPLayoutViewModel";

interface OTPprops {
  onVerify: (values: string, setSubmitting: () => void) => void;
  handleGoBack?: () => void;
  // onEditRecipient: () => void;
  // showEdit?: boolean;
  subtitle?: string;
  title?: string;
  resendOTP?: (callback: () => void) => void | undefined;
  buttonText?: string;
  showBackButton?: boolean;
  otpLength?: number;
  email?: string;
  contentId?: string;
  showEmail?: boolean;
  variant?: "payout" | "reg";
}

export default function OTPLayout({
  onVerify,
  resendOTP,
  handleGoBack,
  subtitle,
  title = "OTP Verification",
  buttonText = "Reset password",
  showBackButton = true,
  otpLength = 6,
  email,
  contentId,
  showEmail = true,
  variant = "reg",
}: OTPprops) {
  const {
    otp,
    handleBlur,
    handleInputChange,
    handleResendOTP,
    handleSetFocus,
    handleVerify,
    isDisabled,
    status,
    inputRef,
  } = useOTPLayoutViewModel({ onVerify, resendOTP, otpLength });

  return (
    <PageContent id={contentId}>
      <div className="content" id={variant}>
        <Title>{title}</Title>
        <Subtitle
          className="sub-heading"
          textAlign="center"
          style={{ maxWidth: "300px", margin: "auto" }}>
          {subtitle || <>Enter OTP sent to your email address</>}
        </Subtitle>
        {variant !== "payout" && (
          <MuiTypography variant="body2" className="subtitle">
            {email}{" "}
            <MuiButton
              disabled={status.isSubmitting || status.isResending}
              variant="text"
              color="primary"
              className="resend-btn"
              onClick={handleGoBack}>
              Change email
            </MuiButton>
          </MuiTypography>
        )}

        <MuiBox>
          <MuiBox
            sx={{
              width: "100%",
              display: "flex",
              gap: "5px",
              justifyContent: "center",
              alignItem: "center",
              margin: "40px 0 40px 0",
            }}>
            {otp.map((input, index: number) => (
              <FilledInput key={index} onClick={handleSetFocus}>
                {input}
              </FilledInput>
            ))}
            {[...Array(otpLength - otp.length)].map((_, index) => (
              <EmptyInput
                key={index}
                onClick={handleSetFocus}
                current={index === 0 && status.isFocused}
              />
            ))}
          </MuiBox>
        </MuiBox>
        <CodeInput
          ref={inputRef}
          type="text"
          maxLength={otpLength}
          placeholder="-"
          min={otpLength}
          max={otpLength}
          value={otp.join("")}
          onChange={handleInputChange}
          autoComplete="do-not-auto"
          onBlur={handleBlur}
        />

        <MuiTypography variant="body2" className="resend-line">
          I haven't received a code.{" "}
          <MuiButton
            disabled={status.isSubmitting || status.isResending}
            variant="text"
            color="secondary"
            className="resend-btn"
            endIcon={
              status.isResending ? (
                <MuiCircularProgress size={18} color="primary" />
              ) : null
            }
            onClick={handleResendOTP}>
            Resend
          </MuiButton>
        </MuiTypography>

        <MuiButton
          onClick={handleVerify(otp)}
          variant="contained"
          color="primary"
          className="btn"
          disabled={!isDisabled || status.isSubmitting || status.isResending}
          sx={{
            width: "100%",
          }}>
          {status.isSubmitting ? (
            <MuiCircularProgress size={24} color="primary" />
          ) : (
            buttonText
          )}
        </MuiButton>
      </div>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: calc(100vw - 40px);
  max-width: 528px;
  margin: auto;
  padding: 60px 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & .btn {
    max-width: 300px;
    margin: 30px auto;
    width: 100%;
    display: inline-flex;
  }

  /* border: 1px solid #f6f6f6; */
  & .content {
    max-width: 400px;
    width: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  & .resend-line,
  .subtitle {
    margin: auto;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .subtitle {
    font-weight: 600;
  }

  & .resend-btn {
    /* margin: 40px auto; */
    display: inline-flex;
    min-height: fit-content;
    height: fit-content;
  }

  & #payout {
    align-items: start;
    justify-content: start;
    flex-direction: column;
    max-width: 350px;

    & .resend-line,
    .subtitle {
      text-align: start;
      display: flex;
      justify-content: start;
      align-items: center;
    }

    & .sub-heading {
      text-align: start;
      margin: 0 !important;
      max-width: 100% !important;
    }

    & .btn {
      max-width: 100%;
      margin: 30px auto 0;
      width: 100%;
      display: inline-flex;
    }
  }

  @media screen and (max-width: 570px) {
    border: none;
  }
`;

const FilledInput = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  text-align: center;
  border-radius: 5px;
  border: 0.7px solid #f9f9f9;
  box-sizing: border-box;
  appearance: none;
  background: #f9f9f9;
  -moz-appearance: none;
  -webkit-appearance: none;
  font-family: "Inter";
`;

type TStyle = {
  current: boolean;
};

const EmptyInput = styled.div<TStyle>`
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #02231b;
  text-align: center;
  border-radius: 5px;

  outline-color: none;
  border: ${({ current }) =>
    current ? "1px solid #f05b2a" : "0.7px solid #f9f9f9"};
  box-sizing: border-box;
  appearance: none;
  background: #f9f9f9;
  -moz-appearance: none;
  -webkit-appearance: none;
  font-family: "Inter";
`;

const CodeInput = styled.input`
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #02231b;
  text-align: center;
  border-radius: 0;
  outline: none;
  border: 0.7px solid #7f8e9d;
  box-sizing: border-box;
  background: #f0f0f0;
  opacity: 0.5;
  position: absolute;
  left: -300vw;
`;
