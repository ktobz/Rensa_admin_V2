import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik, FormikProvider } from "formik";

import AppInput from "components/input";
import {
  MuiBox,
  MuiIconButton,
  MuiButton,
  styled,
  MuiCircularProgress,
  MuiInputAdornment,
  MuiTypography,
} from "@/lib/index";
import { SEOData } from "@/utils/seoData";
import AuthService from "@/services/auth.service";
import { ILoginReq } from "@/types/globalTypes";

import { IconVisibility, IconVisibilityOff } from "lib/mui.lib.icons";

import { useUserStore } from "@/config/store-config/store.config";
import { setAccessToken } from "@/utils/helper-funcs";
import AuthLayoutWrapper from "@/components/layout/AuthLayoutWrapper";
import OtherService from "@/services/others.service";
import useCachedDataStore from "@/config/store-config/lookup";

const LoginSEOData = SEOData.LOGIN;
interface LocationProp {
  email: string;
}

export default function Login() {
  const state = useLocation().state as LocationProp;
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { updateLookup } = useCachedDataStore();

  const [mode, setMode] = React.useState<"login" | "verify">("login");

  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const loginUser = async ({ username, password }: ILoginReq) => {
    const reqData = { username, password };
    setIsSubmitting(true);

    try {
      const {
        data,
        status: loginStatus,
        statusText,
      } = await AuthService.login(reqData);
      const userData = data?.result;
      setUser(userData);
      setAccessToken(userData?.token, userData?.refreshToken);

      if (loginStatus === 200) {
        const { data, status } = await OtherService.getLookup();

        if (status === 200) {
          updateLookup(data?.result);
        }

        navigate("/app/dashboard", { replace: true });
        return;
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.response?.data?.error
      );
    }

    return setIsSubmitting(false);
  };

  const SCHEMA = Yup.object().shape({
    username: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: Yup.string().required("Please enter a password"),
  });

  const initialData = {
<<<<<<< HEAD
    // email: state?.email || "kingsconsult001@gmail.com",
    // password: "Kingssley123@",

    username: state?.email || "administrator@rensa.com",
    password: "Admin12345.",
=======
    username: state?.email || "",
    password: "",
>>>>>>> 670f71a8fd81ffb38354ff6197bfd8bbc66853e3
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,

    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: ILoginReq) => {
      loginUser(values);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    // isValid,
    // dirty,
  } = formik;

  const handleToggleMode = () => {
    setMode("login");
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
<<<<<<< HEAD
    setFieldValue("email", value.trim());
=======
    setFieldValue("username", value.trim());
>>>>>>> 670f71a8fd81ffb38354ff6197bfd8bbc66853e3
  };

  return (
    <AuthLayoutWrapper
      pageDescription={LoginSEOData.description}
      pageTitle={LoginSEOData.title}>
      <FormikProvider value={formik}>
        <PageContent onSubmit={handleSubmit}>
          <MuiTypography variant="h1" className="form-title">
            Admin Portal
          </MuiTypography>
          <MuiTypography variant="body2" className="form-subtitle">
            Login to access your operations account
          </MuiTypography>

          <MuiBox marginTop="30px" width="100%">
            <AppInput
              name="username"
              label="Email Address"
              placeholder="Enter email address "
              type="text"
              value={values.username}
              onChange={customHandleChange}
              helperText={errors.username}
              error={!!errors.username && touched.username}
              onBlur={handleBlur}
              required
            />
            <AppInput
              name="password"
              label="Password"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              helperText={errors.password}
              onChange={handleChange}
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
                        <IconVisibilityOff color="disabled" />
                      ) : (
                        <IconVisibility color="disabled" />
                      )}
                    </MuiIconButton>
                  </MuiInputAdornment>
                ),
              }}
            />

            <MuiBox
              display="flex"
              justifyContent="start"
              alignItems="start"
              marginTop="8px">
              <MuiBox
                to="/forgot-password"
                fontWeight={400}
                fontSize={12}
                color="primary.light"
                sx={{
                  textUnderlineOffset: "2px",
                  textDecoration: "none",
                  color: "primary.light",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                component={Link}>
                Forgot Password?
              </MuiBox>
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
                "Log in"
              )}
            </MuiButton>
          </MuiBox>
        </PageContent>
      </FormikProvider>
    </AuthLayoutWrapper>
  );
}

const PageContent = styled.form`
  width: 100%;
  padding-top: 40px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;

  & .form-title {
    font-size: 32px;
    font-weight: bold;
    text-align: center;
  }

  & .form-subtitle {
    font-size: 16px;
    margin-top: 10px;
    text-align: center;
  }
  @media screen and (max-width: 375px) {
    padding: 20px;
  }
`;
