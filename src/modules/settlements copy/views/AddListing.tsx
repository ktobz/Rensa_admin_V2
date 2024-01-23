import * as React from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import debounceFunc from "lodash.debounce";

import { MuiButton, MuiDivider, MuiTypography, styled } from "@/lib/index";
import { useLocation } from "react-router-dom";

import { useQuery, useQueryClient } from "react-query";
import { IListingProp, IUserData, PlaceType } from "@/types/globalTypes";

import { useIds } from "@/utils/hooks";
import VendgramVirtualizedCountriesSelect from "@/components/select/test";
import VendgramSelect from "@/components/select/autoComplete";
import VendgramInput from "@/components/input";
import useCachedDataStore from "@/config/store-config/lookup";
import GoogleLocationInput from "@/components/select/GoogleLocationInput";
import NotificationService from "@/services/notification-service";

import CustomerService from "@/services/customer-service";
import CustomImageUploader from "../components/CustomImageUploader";

const SCHEMA = Yup.object().shape({
  name: Yup.string().required("required"),
  description: Yup.string().required("required"),
  price: Yup.number().required("required"),
  location: Yup.string().required("required"),
  latitude: Yup.number().required("required"),
  longitude: Yup.number().required("required"),

  userId: Yup.string().required("required"),
  pickupMethod: Yup.number().required("Required"),
  availability: Yup.boolean(),
  catalogueConditionId: Yup.number().required("required"),
  catalogueCategoryId: Yup.number().required("required"),
});

export function AddListing() {
  const {
    lookup: { pickupMethod, deliveryFeePickupMethod, durationHours },
  } = useCachedDataStore((state) => state.cache);
  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { reportId } = useIds();

  const [name, setName] = React.useState("");
  const [compText, setCompText] = React.useState("");
  const [resetImages, setResetImages] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [locationValue, setLocationValue] = React.useState<PlaceType | null>(
    () => {
      return null;
    }
  );

  const initialData = {
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
    userId_name: "",
    files_preview: [],
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

  const users = useQuery(
    ["all-users", name],
    () =>
      CustomerService.getAll(`?searchText=${name}`).then((res) => {
        return res.data.result?.data;
      }),
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );

  const handleSearch = (value: string) => {
    setName(value);
  };

  const throttledChangeHandler = React.useMemo(
    () => debounceFunc(handleSearch, 700),
    []
  );

  const handleChangeCompetitionValue = (value: string) => {
    setCompText(value);
    throttledChangeHandler(value);
  };

  React.useEffect(() => {
    return () => {
      throttledChangeHandler.cancel();
    };
  }, [throttledChangeHandler]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    let formatted = value;
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
    // console.log(value);
    setFieldValue("location", value?.description);
  };

  const getId = (user: string, options: any) => {
    const data = options;
    return data.find(
      (value: any) =>
        `${value?.firstName?.toLowerCase()} ${value?.lastName?.toLowerCase()}` ===
        user?.toLowerCase()
    )?.id;
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
              updateFieldValue={(value: any) => {
                setFieldValue("userId", value?.id);
                setFieldValue("userId_name", value?.firstName);
              }}
              selectedValue={values?.userId || ""}
              options={users?.data || []}
              placeholder="Search and select user"
              loading={users.isLoading}
              showPills={false}
              multiple={false}
              showCheck={false}
              inputValue={values?.userId_name || ""}
              optionTitle="userName"
              optionValue="id"
              // getOptionLabel={(opt: any) => {
              //   // console.log(`${opt}`);
              //   return `${opt?.firstName} ${opt?.lastName}`;
              // }}
              error={!!errors.userId}
              helperText={errors.userId}
              onInputChange={(event, newInputValue, reason) => {
                if (event) {
                  if (reason === "input") {
                    setFieldValue("userId_name", newInputValue);
                    handleChangeCompetitionValue(newInputValue);
                  }

                  if (reason === "clear") {
                    setFieldValue("userId_name", "");
                    setFieldValue("userId", "");
                    handleChangeCompetitionValue("");
                  }
                  if (reason === "reset") {
                    setFieldValue("userId_name", newInputValue);
                    setFieldValue("userId", getId(newInputValue, users.data));
                  }
                }
              }}
              isOptionEqualToValue={(option: any, value: any) => {
                return option?.id === value?.id;
              }}
            />
          </div>
          <MuiDivider className="" />

          <div className="image-listing">
            <MuiTypography variant="body1">Listing Images</MuiTypography>
            <CustomImageUploader
              // label="Listing Images"
              instruction="Maximum of 5 photos. PNG, JPG, MP4 | 5MB max."
              aspect={0}
              name="files"
              multiple
              handleReset={resetImages}
              maxPhoto={4}
              initialPreviewData={values.files_preview}
              initialFileData={values.files}
              getFleList={(photos, photosPreview) => {
                setFieldValue("files", photos);
                setFieldValue("files_preview", photosPreview);
              }}
            />
          </div>

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

            <VendgramSelect
              id="durationInHours"
              name="durationInHours"
              label="Auction Duration"
              placeholder="Enter duration"
              value={values.durationInHours}
              onChange={handleChange}
              helperText={errors.durationInHours}
              options={durationHours || []}
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
              options={deliveryFeePickupMethod}
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
