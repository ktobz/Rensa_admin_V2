import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AppInput from "@/components/input";
import {
  MuiBox,
  MuiButton,
  styled,
  MuiCircularProgress,
  MuiTypography,
} from "@/lib/index";
import { SEOData } from "@/utils/seoData";
import Title from "@/components/text/Title";

import { useUserStore } from "@/config/store-config/store.config";
import AuthLayoutWrapper from "@/components/layout/AuthLayoutWrapper";
import AuthService from "@/services/auth.service";
import OTPLayout from "@/components/layout/otp/OTPLayout";
import SetNewPasswordView from "../new-password/SetNewPasswordView";

const forgotPasswordSEOData = SEOData.FORGOT_PASSWORD;
interface IData {
  email: string;
  name: string;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  // const state = useLocation().state as LocationProp;
  // const userEmail = state?.email || "-";
  const [mode, setMode] = React.useState<"FORM" | "OTP" | "PASSWORD">("FORM");
  const [email, setEmail] = React.useState("");

  const handleModeToggle =
    (name: "FORM" | "OTP" | "PASSWORD") => (data: string) => {
      setEmail(data);
      setMode(name);
    };

  const handleGoBack = () => {
    setMode("FORM");
  };

  const handleSendLink = (
    email: string,
    onSuccess: () => void,
    callback: () => void
  ) => {
    setEmail(email);
    AuthService.sendOTP({
      email,
    })
      .then((res) => {
        onSuccess();
        setMode("OTP");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      })
      .finally(() => callback());
  };

  function handleVerifyOTP(otp: string, callback: () => void) {
    AuthService.verifyOTP({
      email,
      otp,
    })
      .then((res) => {
        //  onSuccess();
        // setMode("PASSWORD");
        navigate("/new-password", { state: { email } });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      })
      .finally(() => callback());
  }

  function resendOTP(callback: () => void) {
    AuthService.sendOTP({
      email,
    })
      .then((res) => {
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      })
      .finally(() => callback());
  }

  return (
    <AuthLayoutWrapper
      pageDescription={forgotPasswordSEOData.description}
      pageTitle={forgotPasswordSEOData.title}>
      {mode === "FORM" && (
        <ForgotPasswordForm
          handleSendLink={handleSendLink}
          toggleMode={handleModeToggle("OTP")}
        />
      )}

      {mode === "PASSWORD" && (
        <SetNewPasswordView
        // backButtonFunc={handleGoBack}
        // email={email}
        />
      )}

      {mode === "OTP" && (
        <OTPLayout
          onVerify={handleVerifyOTP}
          resendOTP={resendOTP}
          handleGoBack={handleGoBack}
          buttonText="Continue"
          email={email}
        />
      )}
    </AuthLayoutWrapper>
  );
}

const PageContent = styled.form`
  width: 100%;
  padding: 40px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  @media screen and (max-width: 375px) {
    padding: 20px;
  }
`;

export const ForgotPasswordForm = ({
  toggleMode,
  handleSendLink,
}: {
  toggleMode: (email: string) => void;
  handleSendLink: (
    email: string,
    onSuccess: () => void,
    callback: () => void
  ) => void;
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [email, setEmail] = React.useState({
    value: "",
    error: "",
  });

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setEmail((prev) => ({ ...prev, value: value.trim() }));
  };

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmail((prev) => ({
        ...prev,
        error: "Please enter your email address",
      }));
      return false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmail((prev) => ({ ...prev, error: "Invalid email address" }));
      return false;
    }
    return true;
  };

  const handleOnSuccess = () => {
    toggleMode(email.value);
  };
  const callback = () => {
    setIsSubmitting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateEmail(email.value)) {
      setIsSubmitting(true);
      handleSendLink(email.value.trim(), handleOnSuccess, callback);
    }
  };

  return (
    <PageContent onSubmit={handleSubmit}>
      <Title>Forgot Password</Title>
      <MuiTypography variant="body2">
        Enter your email address to reset password
      </MuiTypography>

      <MuiBox marginTop="50px" width="100%">
        <AppInput
          name="email"
          label="Email Address"
          placeholder="Enter email address "
          type="text"
          value={email.value}
          onChange={handleChange}
          error={!!email.error}
          helperText={email.error}
          required
        />
      </MuiBox>

      <MuiBox sx={{ margin: "35px auto 0", width: "100%" }}>
        <MuiButton
          variant="contained"
          type="submit"
          color="primary"
          disabled={isSubmitting}
          sx={{
            width: "100%",
            display: "flex",
            marginBottom: "20px",
            alignItems: "center",
            justifyContent: "center",
          }}>
          {isSubmitting ? (
            <MuiCircularProgress size={22} color="primary" />
          ) : (
            "Continue"
          )}
        </MuiButton>

        <MuiBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="39px">
          <MuiTypography variant="body2" textAlign="center">
            Remember password?
            <MuiBox
              to="/login"
              fontWeight={600}
              color="primary.main"
              sx={{
                textUnderlineOffset: "2px",
                textDecoration: "none",
                color: "primary.main",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              component={Link}>
              {" "}
              Log in
            </MuiBox>
          </MuiTypography>
        </MuiBox>
      </MuiBox>
    </PageContent>
  );
};
