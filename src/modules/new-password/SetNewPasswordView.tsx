import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  IconVisibility,
  IconVisibilityOff,
  MuiBox,
  MuiButton,
  MuiCircularProgress,
  MuiIconButton,
  MuiInputAdornment,
  styled,
} from "@/lib/index";
import Title from "@/components/text/Title";
import Subtitle from "@/components/text/Subtitle";
import VendgramInput from "@/components/input";
import AuthService from "@/services/auth.service";
import { useUserStore } from "@/config/store-config/store.config";

type IProps = {
  email: string;
};

interface LocationProp {
  email: string;
}

export default function SetNewPasswordView() {
  const state = useLocation().state as LocationProp;
  const email = state?.email || "";

  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [show, setShow] = React.useState({
    password: false,
    password_confirmation: false,
  });
  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [values, setValues] = React.useState({
    email,
    password: "",
    password_confirmation: "",
  });

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = target;
    setValues((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const validatePassword = (): boolean => {
    if (!values.password) {
      setErrors((prev) => ({
        ...prev,
        password: "Please enter your password",
      }));
      return false;
    }

    if (!values.password_confirmation) {
      setErrors((prev) => ({
        ...prev,
        password_confirmation: "Please enter your password",
      }));
      return false;
    }
    // else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(password)) {
    //   setPassword((prev) => ({ ...prev, error: "Invalid email address" }));
    //   return false;
    // }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePassword()) {
      setIsSubmitting(true);

      AuthService.setNewPassword(values)
        .then((res) => {
          const { api_token, email, full_name } = res.data?.data;
          setUser({
            email,
            token: api_token,
            fullName: full_name,
          });
          navigate("/app/dashboard", { replace: true });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message || err?.response?.data?.error
          );
          setIsSubmitting(false);
        });
    }
  };

  const handleTogglePassword =
    (name: "password" | "password_confirmation") => () => {
      setShow((prev) => ({ ...prev, [name]: !prev[name] }));
    };

  return (
    <PageContent onSubmit={handleSubmit}>
      <Title>Create Password</Title>
      <Subtitle>Create new password to secure your account</Subtitle>

      <MuiBox>
        <VendgramInput
          name="password"
          label="New Password"
          placeholder="Enter password"
          type={show.password ? "text" : "password"}
          value={values.password}
          helperText={errors.password}
          onChange={handleChange}
          error={!!errors.password}
          labelAction={handleTogglePassword("password")}
          required
          InputProps={{
            endAdornment: (
              <MuiInputAdornment position="end">
                <MuiIconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePassword("password")}
                  onMouseDown={handleTogglePassword("password")}
                  edge="end">
                  {show.password ? (
                    <IconVisibilityOff color="disabled" />
                  ) : (
                    <IconVisibility color="disabled" />
                  )}
                </MuiIconButton>
              </MuiInputAdornment>
            ),
          }}
        />
        <VendgramInput
          name="password_confirmation"
          label="New Password"
          placeholder="Re-Enter password"
          type={show.password ? "text" : "password"}
          value={values.password_confirmation}
          helperText={errors.password_confirmation}
          onChange={handleChange}
          error={!!errors.password_confirmation}
          labelAction={handleTogglePassword("password_confirmation")}
          required
          InputProps={{
            endAdornment: (
              <MuiInputAdornment position="end">
                <MuiIconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePassword("password_confirmation")}
                  onMouseDown={handleTogglePassword("password_confirmation")}
                  edge="end">
                  {show.password_confirmation ? (
                    <IconVisibilityOff color="disabled" />
                  ) : (
                    <IconVisibility color="disabled" />
                  )}
                </MuiIconButton>
              </MuiInputAdornment>
            ),
          }}
        />
      </MuiBox>

      <MuiBox sx={{ margin: "60px auto 30px", width: "100%" }}>
        <MuiButton
          variant="contained"
          color="primary"
          type="submit"
          disabled={isSubmitting}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}>
          {isSubmitting ? (
            <MuiCircularProgress size={24} color="primary" />
          ) : (
            "Done"
          )}
        </MuiButton>
      </MuiBox>
    </PageContent>
  );
}

const PageContent = styled.form`
  width: 100%;
  flex: 1;

  max-width: 400px;
  padding: 20px;

  margin: auto;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
