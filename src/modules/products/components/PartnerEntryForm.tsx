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
import { IconInfo, IconListIcon } from "lib/mui.lib.icons";
import CardService from "@/services/branches.service";
import { toast } from "react-toastify";
import { IProductEntryProps } from "../types";
import VendgramSelect from "@/components/select/autoComplete";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import { DURATION_OPTION } from "@/data/product-category";
import { IPartnerDataProps, IPartnerEntryProps } from "@/types/globalTypes";
import PartnerService from "@/services/partner-service";

const SCHEMA = Yup.object().shape({
  name: Yup.string().required("required"),
  service_charge: Yup.number().required("required"),
  contact_phone: Yup.string().required("required"),
  email: Yup.string().required("required").email("Enter valid email"),
});

type IViewProps = {
  mode: "new" | "edit";
  initData?: IPartnerDataProps | null;
  handleShowSetPrice: () => void;
  handleClose: () => void;
  refreshQuery?: () => void;
};

export const PartnerEntryForm = ({
  mode,
  initData,
  refreshQuery,
  handleClose,
}: IViewProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const initialData = {
    email: initData?.email || "",
    name: initData?.name || "",
    service_charge: initData?.service_charge || "",
    contact_phone: initData?.contact_phone || "",
  };

  const handleAddPartner = (values: IPartnerEntryProps) => {
    setIsSubmitting(true);
    (initData?.id
      ? PartnerService.update(initData?.id, values)
      : PartnerService.create(values)
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
      handleAddPartner(values as IPartnerEntryProps);
    },
  });

  const { errors, handleSubmit, handleChange, values } = formik;

  // const handleCustomChange = (
  //   e: MuiSelectChangeEvent<any>,
  //   newValue: React.ReactNode
  // ) => {
  //   const { value, name } = e.target;
  //   setFieldValue(name, value);
  // };

  const handleCloseModal = () => {};

  React.useEffect(() => {
    setShow(true);
  }, []);

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <VendgramInput
            id="name"
            name="name"
            label="Partner name"
            placeholder="Enter partner name"
            type="text"
            value={values.name}
            onChange={handleChange}
            helperText={errors.name}
            error={!!errors.name}
          />
        </div>
        <div className="wrapper">
          <VendgramInput
            id="email"
            name="email"
            label="Partner email"
            placeholder="Enter partner email"
            type="email"
            value={values.email}
            onChange={handleChange}
            helperText={errors.email}
            error={!!errors.email}
          />
        </div>
        <div className="wrapper">
          <VendgramInput
            id="contact_phone"
            name="contact_phone"
            label="Contact number"
            placeholder="Enter contact number"
            type="text"
            value={values.contact_phone}
            onChange={handleChange}
            helperText={errors.contact_phone}
            error={!!errors.contact_phone}
          />
        </div>
        <div className="wrapper">
          <VendgramInput
            id="service_charge"
            name="service_charge"
            label="Agreed service fee charge (%)"
            placeholder="Enter fee percentage"
            type="number"
            value={values.service_charge}
            onChange={handleChange}
            helperText={errors.service_charge}
            error={!!errors.service_charge}
          />
        </div>
        <div className="info">
          <IconInfo />
          Partners will get an email with their login details to access their
          account.
        </div>

        <div className="action-group">
          <MuiButton
            type="button"
            variant="text"
            // color="info"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            onClick={handleClose}
            className={`secondary-btn btn ${isSubmitting ? "disabled" : ""}`}>
            Cancel
          </MuiButton>
          <MuiButton
            type="submit"
            variant="contained"
            aria-disabled={isSubmitting}
            disabled={isSubmitting}
            className={`btn ${isSubmitting ? "disabled" : ""}`}>
            {isSubmitting ? <MuiCircularProgress size={16} /> : "Save"}
          </MuiButton>
        </div>
      </StyledForm>
    </FormikProvider>
  );
};

const StyledForm = styled.form`
  width: calc(100vw - 40px);
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  max-width: 800px;
  display: flex;
  flex-wrap: wrap;
  gap: 0 20px;

  & .price-unit {
    display: flex;
    align-items: center;
    font-size: 12px;
    gap: 10px;

    span {
      color: #1e75bb;
      font-weight: 600;
    }
  }

  & .disabled {
    cursor: not-allowed;
  }

  & .action-group {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;

    & .secondary-btn {
      background: #fbfbfb;
      color: #363636;
    }
  }
  & .wrapper {
    /* max-width: 450px; */
    /* width: 100%; */
    flex: 1;
    width: calc((100% - 20px) / 2);
    min-width: 300px;
  }

  & .subtitle {
    color: #aeaeae;
  }

  & .info {
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    margin-top: 20px;

    svg {
      color: #f05b2a;
    }
  }

  & .btn {
    width: 100%;
    margin-top: 45px;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
`;
