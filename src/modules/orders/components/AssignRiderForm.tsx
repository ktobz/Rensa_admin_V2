import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";

import { styled, MuiButton, MuiCircularProgress } from "@/lib/index";

import { toast } from "react-toastify";
import AppVirtualizedCountriesSelect from "@/components/select/test";
import { useQuery } from "react-query";
import RiderService from "@/services/rider-service";
import OrderService from "@/services/order-service";

const SCHEMA = Yup.object().shape({
  rider_id: Yup.string().required("required"),
});

type IViewProps = {
  orderId: string;
  refreshQuery?: () => void;
  mode: "assign" | "re-assign";
};

export const AssignRiderForm = ({
  orderId = "",
  refreshQuery,
  mode,
}: IViewProps) => {
  const initialData = {
    rider_id: "",
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAssignUser = (formValues: any) => {
    setIsSubmitting(true);
    OrderService.assignRider(orderId, formValues)
      .then((res) => {
        refreshQuery?.();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      })
      .finally(() => setIsSubmitting(false));
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      handleAssignUser(values);
    },
  });

  const { errors, handleSubmit, values, setFieldValue } = formik;

  const handleCustomChange = (name: string, value: string | number) => {
    setFieldValue(name, value);
  };

  const riders = useQuery(
    ["all-riders"],
    () =>
      RiderService.getAll().then((res) => {
        return res.data.data;
      }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <AppVirtualizedCountriesSelect
            label="Rider"
            placeholder="Select rider"
            value={values.rider_id}
            error={!!errors.rider_id}
            options={riders.data || []}
            optionValue="id"
            optionTitle="full_name"
            updateFieldValue={(value: { id: number; name: string }) =>
              handleCustomChange("rider_id", value.id)
            }
            loading={riders?.isLoading}
            selectedValue={values.id}
            wrapperStyle={{ width: "auto" }}
            showCheck={false}
            showPills={false}
            required
            iconName="profile_image"
            hasImage
            isOptionEqualToValue={(opt) => opt?.id === values?.rider_id}
            getOptionLabel={(opt) => opt?.full_name}
            multiple={false}
          />
          <div className="btn-group">
            <MuiButton
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              color="primary"
              startIcon={
                isSubmitting ? <MuiCircularProgress size={16} /> : null
              }
              className="btn">
              {mode} rider
            </MuiButton>
          </div>
        </div>
      </StyledForm>
    </FormikProvider>
  );
};

const StyledForm = styled.form`
  width: calc(100vw - 40px);
  max-width: 400px;
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
    text-transform: capitalize;
  }

  & .btn-group {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;

    & .cancel-btn {
      background-color: #fbfbfb;
      color: #363636;
    }
  }

  & .image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding-top: 27px;
    position: relative;

    & .image-loader {
      position: absolute;
      margin: auto 0;
      left: 40%;
      right: 50%;
      top: 29%;
    }

    & .info {
      margin-top: 10px;
      color: #64748b;
      font-size: 13px;
    }

    & .change-image {
      min-height: fit-content;
      height: fit-content;
      padding: 5px;
      display: block;
      cursor: pointer;
      color: #f05b2a;
      font-size: 13px;
      background: #f05b2a1a;
      border-radius: 30px;
      padding: 10px 20px;
    }
  }
  & .user-image {
    border-radius: 50%;
    overflow: hidden;
    width: 160px;
    height: 160px;
    text-align: center;
    border: 1px solid #f1f2f5;
  }
`;
