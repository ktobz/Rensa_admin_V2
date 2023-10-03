import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";

import {
  styled,
  MuiTypography,
  MuiButton,
  MuiCircularProgress,
} from "@/lib/index";
import VendgramInput from "@/components/input";

import VendgramCustomModal from "components/modal/Modal";
import { toast } from "react-toastify";
import VendgramSelect from "@/components/select/autoComplete";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import { DURATION_OPTION } from "@/data/product-category";
import { CustomSwitch } from "@/components/input/CustomSwitch";
import BranchService from "@/services/branches.service";
import { IBranchDataProps, IBranchEntryProps } from "@/types/globalTypes";
import VendgramVirtualizedCountriesSelect from "@/components/select/test";
import { useQuery } from "react-query";
import BranchManagerService from "@/services/branch-manager-service";

const SCHEMA = Yup.object().shape({
  name: Yup.string().required("required"),
  branch_manager_id: Yup.string(),
  availability: Yup.boolean(),
  location: Yup.string().required("required"),
});

type IViewProps = {
  mode: "new" | "edit";
  initData?: IBranchDataProps;
  refreshQuery?: () => void;
  handleClose: () => void;
  partnerId: string;
};

export const BranchEntryFormView = ({
  mode,
  initData,
  refreshQuery,
  handleClose,
  partnerId,
}: IViewProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const initialData = {
    name: initData?.name || "",
    branch_manager_id: initData?.branch_manager?.id || "",
    availabilty: initData?.availabilty || false,
    location: initData?.location || "",
  };

  const createBranch = (values: IBranchEntryProps) => {
    setIsSubmitting(true);
    (initData?.id
      ? BranchService.update(partnerId, initData?.id, values)
      : BranchService.create(partnerId, values)
    )
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
      createBranch(values as IBranchEntryProps);
    },
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;

  const handleCustomChange = (name: string, value: string | number) => {
    setFieldValue(name, value);
  };

  const branchManager = useQuery(
    ["all-branch-managers", partnerId],
    () =>
      BranchManagerService.getAll(partnerId).then((res) => {
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
          <VendgramInput
            id="name"
            name="name"
            label="Branch Name"
            placeholder="Enter branch name"
            type="text"
            value={values.name}
            onChange={handleChange}
            helperText={errors.name}
            error={!!errors.name}
          />
          <VendgramInput
            id="location"
            name="location"
            label="Location"
            placeholder="Enter "
            type="text"
            value={values.location}
            onChange={handleChange}
            helperText={errors.location}
            error={!!errors.location}
          />

          {/* <VendgramInput
            id="branch_manager_id"
            name="branch_manager_id"
            label="Branch Manager"
            placeholder="Select Branch Manager"
            type="text"
            value={values.branch_manager_id}
            onChange={handleChange}
            showHelperInfoIcon
            helperText={
              errors.branch_manager_id ||
              "Branch managers will be able to access the Rensa Partner Branch app with their registered email."
            }
            error={!!errors.branch_manager_id}
          /> */}

          <VendgramVirtualizedCountriesSelect
            label="Branch Manager"
            placeholder="Select branch manager  "
            value={values.branch_manager_id}
            // helperText={errors.branch_manager_id}
            error={!!errors.branch_manager_id}
            // onBlur={handleBlur}
            options={branchManager?.data || []}
            optionValue="id"
            optionTitle="full_name"
            updateFieldValue={(value: { id: number; full_name: string }) =>
              handleCustomChange("branch_manager_id", value.id)
            }
            selectedValue={values.branch_manager_id}
            wrapperStyle={{ width: "auto" }}
            showCheck={false}
            showPills={false}
            required
            iconName="profile_image"
            hasImage
            getOptionLabel={(opt: any) => opt?.full_name}
          />

          {/* <VendgramVirtualizedCountriesSelect
            label="Assigned Branch"
            placeholder="Select branch"
            value={values.branchId}
            // helperText={errors.branchId}
            error={!!errors.branchId}
            // onBlur={handleBlur}
            options={branches.data || []}
            optionValue="id"
            optionTitle="name"
            updateFieldValue={(value: { id: number; name: string }) =>
              handleCustomChange("branchId", value.id)
            }
            selectedValue={values.branchId}
            wrapperStyle={{ width: "auto" }}
            showCheck={false}
            showPills={false}
            required
          /> */}

          <MuiTypography variant="body2" className="visibility">
            <span>Availability</span>{" "}
            <div className="actions">
              <CustomSwitch
                color="primary"
                name="availabilty"
                // defaultValue={initData?.availabilty}
                defaultChecked={initData?.availabilty}
                onChange={handleChange}
                value={values.availabilty}
              />{" "}
              <span className="label publish-label">
                {values.availabilty ? "Open" : "Closed"}
              </span>
            </div>
          </MuiTypography>

          <div className="btn-group">
            <MuiButton
              type="button"
              variant="contained"
              onClick={handleClose}
              className="btn cancel-btn">
              Cancel
            </MuiButton>
            <MuiButton
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              color="primary"
              className="btn">
              {isSubmitting ? (
                <MuiCircularProgress size={16} />
              ) : mode === "edit" ? (
                "Save Branch"
              ) : (
                "Add Branch"
              )}
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
  max-width: 400px;

  & .visibility {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
    padding: 0 10px;

    & span {
      font-weight: 600;
    }
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

  & .wrapper {
    max-width: 450px;
    width: 100%;
  }

  & .subtitle {
    color: #aeaeae;
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
`;
