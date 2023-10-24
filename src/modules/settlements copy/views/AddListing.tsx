import * as React from "react";
import { format } from "date-fns";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";

import {
  MuiButton,
  MuiCardMedia,
  MuiDivider,
  MuiIconButton,
  MuiSelectChangeEvent,
  MuiTypography,
  styled,
} from "@/lib/index";
import { useLocation, useParams } from "react-router-dom";
import {
  IconBike,
  IconBranches,
  IconCopyFilled,
  IconCreditCard,
  IconEarning,
  IconLocation,
  IconPetrol,
  IconShipping,
  IconTicket,
} from "@/lib/mui.lib.icons";
import { useQuery, useQueryClient } from "react-query";
import OrderService from "@/services/order-service";
import {
  IListingProp,
  IOrderDetails,
  IStatus,
  PlaceType,
} from "@/types/globalTypes";
import { UserDetailCard } from "@/components/card/UserCard";
import VendgramCustomModal from "@/components/modal/Modal";
import { OrderStatus } from "@/components/feedback/OrderStatus";
import { SettlementStatus } from "@/modules/settlements/components/OrderStatus";
import { useIds } from "@/utils/hooks";
import CustomStyledSelect from "@/components/select/CustomStyledSelect";
import { ActionTimeStatus } from "../components/OrderStatus";
import SimpleBar from "simplebar-react";
import { ReportedComments } from "../components/ReportedComments";
import { SellerInfo } from "../components/SellerInfo";
import { BidsView } from "../components/BidsView";
import { ActionConfirm } from "../components/ActionConfirm";
import VendgramVirtualizedCountriesSelect from "@/components/select/test";
import VendgramSelect from "@/components/select/autoComplete";
import VendgramInput from "@/components/input";
import useCachedDataStore from "@/config/store-config/lookup";
import GoogleLocationInput from "@/components/select/GoogleLocationInput";
import NotificationService from "@/services/notification-service";

const SCHEMA = Yup.object().shape({
  name: Yup.string().required("required"),
  branch_manager_id: Yup.string(),
  availability: Yup.boolean(),
  location: Yup.string().required("required"),
});

export function AddListing() {
  const {
    lookup: { pickupMethod },
  } = useCachedDataStore((state) => state.cache);
  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { reportId } = useIds();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [locationValue, setLocationValue] = React.useState<PlaceType | null>(
    () => {
      return null;
    }
  );

  const initialData: IListingProp = {
    location: "",
    CatalogueCategoryId: 0,
    CatalogueConditionId: 0,
    description: "",
    DurationInHours: 0,
    files: [],
    langitude: "",
    longitude: "",
    name: "",
    PickupMethod: 0,
    price: 0,
    UserId: "",
  };

  const createListing = (values: any) => {
    setIsSubmitting(true);
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      createListing(values as any);
    },
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;

  const handleCustomChange = (name: string, value: string | number) => {
    setFieldValue(name, value);
  };

  const allCategory = useQuery(
    ["all-category"],
    () =>
      NotificationService.getCategories().then((res) => {
        return res.data.result?.data;
      }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );

  const allConditions = useQuery(
    ["all-conditions"],
    () =>
      NotificationService.getConditions().then((res) => {
        return res.data.result?.data;
      }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );

  const handelUpdateValue = (value: any) => {
    setLocationValue(value);
    console.log(value);
    setFieldValue("location", value?.description);
  };

  return (
    <FormikProvider value={formik}>
      <PageContent onSubmit={handleSubmit}>
        <div className="listing">
          <div className="group-heading">
            <MuiTypography variant="h4" className="heading">
              Add Listing
            </MuiTypography>
          </div>

          <div className="input-wrapper">
            <VendgramVirtualizedCountriesSelect
              label="Select user"
              placeholder="Select branch manager  "
              value={values.branch_manager_id}
              // helperText={errors.branch_manager_id}
              error={!!errors.branch_manager_id}
              options={[]}
              optionValue="id"
              optionTitle="full_name"
              updateFieldValue={(value: { id: number; full_name: string }) =>
                handleCustomChange("branch_manager_id", value.id)
              }
              selectedValue={values.branch_manager_id}
              wrapperStyle={{ width: "auto" }}
              showCheck={false}
              showPills={false}
              // iconName="profile_image"
              // hasImage
              getOptionLabel={(opt: any) => opt?.full_name}
            />
          </div>
          <MuiDivider className="" />

          <div className="image-listing"></div>

          <div className="inputs-wrapper">
            <VendgramInput
              id="name"
              name="name"
              label="Item name"
              placeholder="Enter description"
              type="text"
              value={values.name}
              onChange={handleChange}
              helperText={errors.name}
              error={!!errors.name}
              required
            />

            <VendgramSelect
              id="catalogueCategoryId"
              name="catalogueCategoryId"
              label="Category"
              placeholder="Select Category"
              value={values.catalogueCategoryId}
              onChange={handleChange}
              helperText={errors.catalogueCategoryId}
              options={allCategory?.data || []}
              error={!!errors.catalogueCategoryId}
              required
            />

            <VendgramSelect
              id="catalogueCategoryId"
              name="catalogueCategoryId"
              label="Condition"
              placeholder="Select Condition"
              value={values.catalogueCategoryId}
              onChange={handleChange}
              helperText={errors.catalogueCategoryId}
              options={allConditions.data || []}
              error={!!errors.catalogueCategoryId}
              required
            />

            <VendgramInput
              id="price"
              name="price"
              label="Price"
              placeholder="Enter Price"
              type="number"
              value={values.price}
              onChange={handleChange}
              helperText={errors.price}
              error={!!errors.price}
              required
            />

            <GoogleLocationInput
              updateInput={handelUpdateValue}
              value={locationValue}
              error={!!errors?.location}
            />

            <VendgramInput
              id="durationInHours"
              name="durationInHours"
              label="Auction Duration"
              placeholder="Enter duration"
              type="number"
              value={values.durationInHours}
              onChange={handleChange}
              helperText={errors.durationInHours}
              error={!!errors.durationInHours}
              required
            />

            <VendgramInput
              id="description"
              name="description"
              label="Description"
              placeholder="Enter description"
              type="text"
              value={values.description}
              onChange={handleChange}
              helperText={
                errors.description ||
                "Give buyers detailed description of item. e.g. how long its been used, defects if any etc."
              }
              error={!!errors.description}
              required
              rows={2}
              multiline
            />
            <VendgramSelect
              id="pickupMethod"
              name="pickupMethod"
              label="Pickup method"
              placeholder="Select"
              value={values.pickupMethod}
              onChange={handleChange}
              helperText={errors.pickupMethod}
              options={pickupMethod}
              error={!!errors.pickupMethod}
              required
            />
          </div>

          <MuiButton variant="contained" className="btn" color="primary">
            Publish listing
          </MuiButton>
        </div>
      </PageContent>
    </FormikProvider>
  );
}

const PageContent = styled.form`
  width: 100%;
  margin: auto;

  & .listing-info {
    display: grid;
    grid-template-columns: 40% calc(60% - 30px);
    gap: 30px;

    & .right {
      display: flex;
      gap: 40px;
      /* justify-content: space-between; */
    }

    & .image-wrapper {
      display: flex;
      gap: 10px;
      & .product {
        width: 90px;
        height: 90px;
        border-radius: 10px;
      }
    }
  }

  & .inputs-wrapper {
    display: grid;
    gap: 0 20px;
    max-width: 900px;
    /* grid-template-columns: repeat(5, minmax(auto-fit, 200px)); */
    grid-template-columns: repeat(auto-fit, minmax(calc(50% - 20px), 1fr));
  }

  & .input-wrapper {
    width: calc((900px / 2) - 10px);
    margin-bottom: 20px;
  }

  & .listing {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #f4f4f4;
    border-radius: 5px;
    padding: 20px 25px;

    & .group-heading {
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      & .heading {
        font-weight: 600;
        font-size: 20px;
      }
    }
  }

  & .btn {
    width: 100%;
    max-width: calc((900px / 2) - 10px);
    margin: 40px 0 30px 0;
  }
`;
