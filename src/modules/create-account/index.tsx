import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import VendgramInput from "components/input";
import {
  MuiBox,
  MuiIconButton,
  MuiButton,
  styled,
  MuiCircularProgress,
  MuiInputAdornment,
  MuiTypography,
  MuiCheckbox,
} from "lib";
import { SEOData } from "utils/seoData";
import Title from "components/text/Title";
// import AuthService from "services/auth.service";
import { ISignupReq } from "types/globalTypes";
// import { TOKEN_NAME } from "types/actionTypes";
import { toast } from "react-toastify";

import AuthLayoutWrapper from "components/layout/AuthLayoutWrapper";
import { IconVisibility, IconVisibilityOff } from "lib/mui.lib.icons";
import FullCoverLoader from "components/loader/FullCoverLoader";
import AuthService from "services/auth.service";
import VendgramSelect from "components/select/autoComplete";
import { USER_TYPE_OPTION } from "data/form-options";
const domain = window.location.origin;

const LoginSEOData = SEOData.LOGIN;
interface IData {
  email: string;
  // name: string;
}

export default function CreateAccount() {
  const [mode, setMode] = React.useState<"FORM" | "CONFIRM">("FORM");
  const [userData, setUserData] = React.useState<IData>({
    email: "",
  });

  const handleModeToggle = (name: "FORM" | "CONFIRM") => (data: IData) => {
    setUserData(data);
    setMode(name);
  };
  return (
    <AuthLayoutWrapper
      pageDescription={LoginSEOData.description}
      pageTitle={LoginSEOData.title}>
      {mode === "FORM" ? (
        <CreateAccountForm toggleMode={handleModeToggle("CONFIRM")} />
      ) : (
        <AccountCreatedConfirmationView
          toggleMode={handleModeToggle("FORM")}
          data={userData}
        />
      )}
    </AuthLayoutWrapper>
  );
}

const PageContent = styled.form`
  width: 100%;
  /* flex: 1; */
  /* max-width: 400px; */
  padding: 40px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  @media screen and (max-width: 375px) {
    padding: 20px;
  }
`;

export const CreateAccountForm = ({
  toggleMode,
}: {
  toggleMode: (data: IData) => void;
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const navigate = useNavigate();

  const initialData = {
    email: "",
    password: "",
    domain,
    accountType: "",
    accepted_terms: false,
  };

  const SCHEMA = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: Yup.string().required("Please enter a password"),
    accountType: Yup.string().required("Please enter a your Last Name"),
    // firstName: Yup.string().required("Please enter a First Name"),
    accepted_terms: Yup.boolean()
      .equals([true], "Accept terms")
      .required("required"),
  });

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,

    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: ISignupReq) => {
      signupUser(values);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    handleBlur,
    setFieldValue,
    values,
    handleChange,
    // isValid,
    // dirty,
  } = formik;

  const signupUser = (values: ISignupReq) => {
    setIsSubmitting(true);

    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   toggleMode({ email: values.email });
    // }, 2000);

    AuthService.signUp(values)
      .then((res) => {
        const data = res?.data;
        console.log(data, "response");
        toggleMode({ email: values.email });
      })
      .catch((err) => {
        const message = err?.response?.data?.message;
        toast.error(message);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFieldValue(name, value.trim());
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFieldValue("accepted_terms", checked);
  };

  // console.log(values);

  return (
    <FormikProvider value={formik}>
      <PageContent onSubmit={handleSubmit}>
        <Title>Create account</Title>

        <MuiBox marginTop="20px" width="100%">
          {/* <VendgramInput
            name="firstName"
            label="First Name"
            placeholder="Enter First Name "
            type="text"
            value={values.firstName}
            onChange={customHandleChange}
            helperText={errors.firstName}
            error={!!errors.firstName && touched.firstName}
            onBlur={handleBlur}
            required
          />
          <VendgramInput
            name="lastName"
            label="Last Name"
            placeholder="Enter Last Name"
            type="text"
            value={values.lastName}
            onChange={customHandleChange}
            helperText={errors.lastName}
            error={!!errors.lastName && touched.lastName}
            onBlur={handleBlur}
            required
          /> */}
          <VendgramInput
            name="email"
            label="Company Email Address"
            placeholder="Enter email address"
            type="text"
            value={values.email}
            onChange={customHandleChange}
            helperText={errors.email}
            error={!!errors.email && touched.email}
            onBlur={handleBlur}
            required
          />
          {/* <VendgramSelect
            name="accountType"
            label="Select Account Type"
            placeholder="Select"
            type="text"
            options={USER_TYPE_OPTION}
            value={values.accountType}
            onChange={handleChange}
            // helperText={errors.accountType}
            error={!!errors.accountType}
            onBlur={handleBlur}
            required
            optionTitle="title"
            optionValue="value"
          /> */}

          <VendgramInput
            name="password"
            label="Password"
            placeholder="Enter password"
            type={showPassword ? "text" : "password"}
            value={values.password}
            helperText={errors.password}
            onChange={customHandleChange}
            error={!!errors.password && touched.password}
            labelAction={handleTogglePassword}
            required
            InputProps={{
              endAdornment: (
                <MuiInputAdornment position="end">
                  <MuiIconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    onMouseDown={handleTogglePassword}
                    edge="end">
                    {showPassword ? (
                      <IconVisibilityOff color="primary" />
                    ) : (
                      <IconVisibility color="primary" />
                    )}
                  </MuiIconButton>
                </MuiInputAdornment>
              ),
            }}
          />

          <MuiBox
            display="flex"
            alignItems="flex-start"
            marginTop="20px"
            gap="10px">
            <MuiTypography fontSize={11}>
              By checking this box, I acknowledge and agree to the{" "}
              <MuiBox
                href="https://vendgram.co/terms-of-use"
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
                component="a">
                {" "}
                Terms & Condition{" "}
              </MuiBox>
              that I have reviewed the terms of the Vendgram{" "}
              <MuiBox
                href="https://vendgram.co/privacy-policy"
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
                component={"a"}>
                Privacy Policy.
              </MuiBox>
            </MuiTypography>
          </MuiBox>
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
              "Create account"
            )}
          </MuiButton>

          <MuiBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="39px">
            <MuiTypography variant="body2">
              Already on Vendgram?{" "}
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
                Log in
              </MuiBox>
            </MuiTypography>
          </MuiBox>
        </MuiBox>
      </PageContent>
    </FormikProvider>
  );
};

export const AccountCreatedConfirmationView = ({
  toggleMode,
  data,
}: {
  toggleMode: (data: IData) => void;
  data: IData;
}) => {
  const navigate = useNavigate();
  const [isResending, setIsResending] = React.useState(false);
  const handleResend = () => {
    setIsResending(true);

    setTimeout(() => {
      setIsResending(false);
      toast.success("Verification link resent successfully", {
        autoClose: 5000,
        closeButton: false,
        progress: 0,
        hideProgressBar: true,
      });
    }, 2000);
  };

  const handleGotoLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <PageContent>
      <Title>Verify email</Title>

      <MuiBox sx={{ margin: "35px auto 0", width: "100%" }}>
        <MuiTypography variant="body2" textAlign="center">
          Hello Founder, we sent a verification link to{" "}
          <MuiBox
            to="/forgot-password"
            fontWeight={600}
            color="primary.main"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
            component={Link}>
            {data.email}
          </MuiBox>{" "}
        </MuiTypography>
      </MuiBox>

      <MuiBox marginTop="60px" width="100%">
        <MuiButton
          variant="contained"
          type="submit"
          color="primary"
          onClick={handleGotoLogin}
          sx={{
            width: "100%",
            display: "flex",
            marginBottom: "20px",
            alignItems: "center",
            justifyContent: "center",
          }}>
          Got it
        </MuiButton>
        <MuiTypography variant="body2" marginTop="45px" textAlign="center">
          Didn't get it?{" "}
          <MuiBox
            to="#"
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
            onClick={handleResend}
            component={Link}>
            Resend
          </MuiBox>{" "}
        </MuiTypography>
      </MuiBox>
      {isResending && <FullCoverLoader />}
    </PageContent>
  );
};
