import { FormikProvider, useFormik } from "formik";
import * as React from "react";
import * as Yup from "yup";

import AppInput from "@/components/input";
import { MuiButton, MuiCircularProgress, styled } from "@/lib/index";

import { toast } from "react-toastify";

import CustomerService from "@/services/customer-service";

const SCHEMA = Yup.object().shape({
  firstName: Yup.string().required("required"),
  lastName: Yup.string().required("required"),
});

type IViewProps = {
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const UpdateUserForm = ({
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {

  const initialData = {
    firstName: initData?.firstName || "",
    lastName: initData?.lastName || "",
    userName: initData?.userName || "",
  };

  const [isSaving, setIsSaving] = React.useState(false);

  const handleUpdateUser = async (formValues: any) => {
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('FirstName',formValues.firstName );
      formData.append('LastName',formValues.lastName );
      formData.append('Username',formValues.userName );
      
      const { data } = await CustomerService.updateProfile(formData);

      if (data) {
        refreshQuery?.();
        toast.success(data?.result?.message);
        setIsSaving(false);
        handleClose();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setIsSaving(false);
    }
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      handleUpdateUser(values);
    },
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;


  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <AppInput
            id="firstName"
            name="firstName"
            label="First name"
            placeholder="Enter First name"
            type="text"
            value={values.firstName}
            onChange={handleChange}
            helperText={errors.firstName}
            error={!!errors.firstName}
            required
          />

          <AppInput
            id="lastName"
            name="lastName"
            label="Last name"
            placeholder="Enter Last name"
            type="text"
            value={values.lastName}
            onChange={handleChange}
            helperText={errors.lastName}
            error={!!errors.lastName}
            required
          />

          <div className="btn-group">
            <MuiButton
              type="submit"
              variant="contained"
              disabled={isSaving}
              color="primary"
              startIcon={isSaving ? <MuiCircularProgress size={16} /> : null}
              className="btn">
              Save Changes
            </MuiButton>
          </div>
        </div>
      </StyledForm>
    </FormikProvider>
  );
};

const StyledForm = styled.form`
  width: 100%;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  max-width: 450px;

  & .wrapper {
    max-width: 450px;
    width: 100%;
  }

  & .flex-wrapper {
    display: flex;
    gap: 30px;
    align-items: self-end;
  }

  & .btn {
    width: 100%;
    margin-top: 45px;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  & .btn-group {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
  }

  & .MuiOutlinedInput-root {
    & .Mui-disabled {
      -webkit-text-fill-color: rgba(0, 0, 0, 0.68) !important;
      margin-bottom: 0 !important;
    }
  }
  & .Mui-disabled {
    color: #000;
    margin-bottom: 0;
  }

  & textarea {
    padding: 0 !important;
  }
`;
