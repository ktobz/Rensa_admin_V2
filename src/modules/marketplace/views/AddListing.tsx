import { FormikProvider, useFormik } from "formik";
import debounceFunc from "lodash.throttle";
import * as React from "react";
import * as Yup from "yup";

import {
  MuiButton,
  MuiCircularProgress,
  MuiDivider,
  MuiTypography,
  styled,
} from "@/lib/index";
import { useNavigate } from "react-router-dom";

import { PlaceType } from "@/types/globalTypes";
import { useQuery } from "react-query";

// import { useIds } from "@/utils/hooks";
import AppInput from "@/components/input";
import GoogleLocationInput from "@/components/select/GoogleLocationInput";
import AppSelect from "@/components/select/autoComplete";
import AppVirtualizedCountriesSelect from "@/components/select/test";
import useCachedDataStore from "@/config/store-config/lookup";
import NotificationService from "@/services/notification-service";

import CustomerService from "@/services/customer-service";
import ListingService from "@/services/listing-service";
import { formatToPrice } from "@/utils/helper-funcs";
import { SelectChangeEvent } from "@mui/material";
import { toast } from "react-toastify";
import CustomImageUploader from "../components/CustomImageUploader";

const SCHEMA = Yup.object().shape({
  name: Yup.string().required("required"),
  description: Yup.string().required("required"),
  price: Yup.string().required("required"),
  location: Yup.string().required("required"),
  userId: Yup.string().required("required"),
  pickupMethod: Yup.number().required("Required").min(1, "required"),
  durationInHours: Yup.number().required("Required").min(1, "required"),
  catalogueConditionId: Yup.number().required("required").min(1, "required"),
  catalogueCategoryId: Yup.number().required("required").min(1, "required"),
  listingType: Yup.number().required("required").min(1, "required"),
});

export function AddListing() {
  const {
    lookup: { deliveryFeePickupMethod, durationHours, listingType },
  } = useCachedDataStore((state) => state.cache);

  const optionsForShelfListing = durationHours?.filter((x) =>
    x?.description?.toLowerCase().includes("shelf")
  );
  const optionsForAuctionListing = durationHours?.filter((x) =>
    x?.description?.toLowerCase().includes("auction")
  );

  const navigate = useNavigate();

  // const queryClient = useQueryClient();
  // const { state } = useLocation();
  // const { reportId } = useIds();

  const [name, setName] = React.useState("");
  const [compText, setUserNameText] = React.useState("");
  const [resetImages, setResetImages] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [locationValue, setLocationValue] = React.useState<PlaceType | null>(
    () => {
      return null;
    }
  );

  const initialData = {
    location: "",
    catalogueCategoryId: 0,
    catalogueConditionId: 0,
    description: "",
    durationInHours: 0,
    files: [],
    name: "",
    pickupMethod: 0,
    price: "",
    userId: "",
    userId_name: "",
    files_preview: [],
    listingType: 0,
  };

  const createListing = (values: any) => {
    if (values?.files?.length === 0) {
      toast.warn("Listing Image is missing");
      return false;
    }

    if ((window as any).google) {
      // Use the PlacesAPI component to fetch place details
      const placesAPI = new (window as any).google.maps.places.PlacesService(
        document.createElement("div")
      );

      placesAPI.getDetails(
        {
          placeId: locationValue?.place_id ?? "",
          fields: [
            "name",
            "formatted_address",
            "geometry",
            "address_components",
          ],
        },
        async (place: any, status: any) => {
          if (
            status === (window as any).google.maps.places.PlacesServiceStatus.OK
          ) {
            const city = place.address_components.find((component: any) =>
              component.types.includes("locality")
            ).long_name;
            const state = place.address_components.find((component: any) =>
              component.types.includes("administrative_area_level_1")
            ).long_name;
            const formattedAddress = place.formatted_address;
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            const price = values?.price?.replaceAll(",", "");

            // return console.log(price);

            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("Name", values?.name);
            formData.append("UserId", values?.userId);
            formData.append("Description", values.description);
            formData.append("Price", price);
            formData.append("LocationInfo.Location", formattedAddress);
            formData.append("LocationInfo.Latitude", latitude);
            formData.append("LocationInfo.Longitude", longitude);
            formData.append("LocationInfo.City", city);
            formData.append("LocationInfo.State", state);
            formData.append("LocationInfo.PlaceId", locationValue?.place_id||'');
            formData.append(
              "CatalogueConditionId",
              values?.catalogueConditionId
            );
            formData.append("CatalogueCategoryId", values?.catalogueCategoryId);
            formData.append("DurationInHours", values?.durationInHours);
            formData.append("PickupMethod", values?.pickupMethod);
            formData.append("ListingType", values?.listingType);
            for (let i = 0; i < values.files.length; i += 1) {
              formData.append("Files", values.files[i] as any);
            }

            try {
              const { data } = await ListingService.create(formData);
              toast.success(data?.result?.message);
              setIsSubmitting(false);
              navigate("/app/marketplace/listings");
            } catch (error: any) {
              toast.error(error?.response?.data?.message);
              setIsSubmitting(false);
            }
          } else {
            console.error("Error fetching place details:", status);
            setIsSubmitting(false);
          }
        }
      );
    }
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      createListing(values);
    },
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;

  const usersQuery = useQuery(
    ["all-users-in-db", name],
    () =>
      CustomerService.getAll(name ? `?searchText=${name}` : "").then((res) => {
        return res.data.result?.data?.map((x) => ({
          id: x?.id,
          name: x?.userName,
        }));
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
    () => debounceFunc(handleSearch, 600),
    []
  );

  const handleChangeUserValue = (value: string) => {
    setUserNameText(value);
    throttledChangeHandler(value);
  };

  React.useEffect(() => {
    return () => {
      throttledChangeHandler.cancel();
    };
  }, [throttledChangeHandler]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    const v = formatToPrice(value, values.price);

    setFieldValue(name, v);
  };

  const allCategory = useQuery(
    ["all-category"],
    () =>
      NotificationService.getCategories(`?pageSize=1000`).then((res) => {
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
    setFieldValue("location", value?.description);
  };

  const handleChangeListing = (
    e: SelectChangeEvent<unknown>,
    child: React.ReactNode
  ) => {
    handleChange(e);
    setFieldValue("durationInHours", 0);
  };

  // const getId = (user: string, options: any) => {
  //   const data = options;
  //   return data.find(
  //     (value: any) =>
  //       `${value?.userName?.toLowerCase()}` === user?.toLowerCase()
  //   )?.id;
  // };

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
            <AppVirtualizedCountriesSelect
              label="Select user"
              updateFieldValue={(value: any) => {
                setFieldValue("userId", value?.id);
                setFieldValue("userId_name", value?.userName);
              }}
              selectedValue={values?.userId || ""}
              options={usersQuery?.data || []}
              placeholder="Search and select user"
              loading={usersQuery.isLoading}
              showPills={false}
              multiple={false}
              showCheck={false}
              inputValue={values?.userId_name || ""}
              optionTitle="name"
              optionValue="id"
              // getOptionLabel={(opt: any) => {
              //   return `${opt?.userName} `;
              // }}
              error={!!errors.userId}
              helperText={errors.userId}
              onInputChange={(event, newInputValue, reason) => {
                if (event) {
                  if (reason === "input") {
                    setFieldValue("userId_name", newInputValue);
                    handleChangeUserValue(newInputValue);
                  }

                  if (reason === "clear") {
                    setFieldValue("userId_name", "");
                    setFieldValue("userId", "");
                    handleChangeUserValue("");
                  }
                  if (reason === "reset") {
                    setFieldValue("userId_name", newInputValue);
                  }
                }
              }}
              isOptionEqualToValue={(option: any, value: any) => {
                return option?.id === values?.userId;
              }}
            />
          </div>
          <MuiDivider className="divider" />

          <div className="image-listing">
            <MuiTypography variant="body1" style={{ fontWeight: "600" }}>
              Listing Images
            </MuiTypography>
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
            <AppInput
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

            <AppSelect
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

            <AppSelect
              id="catalogueConditionId"
              name="catalogueConditionId"
              label="Condition"
              placeholder="Select Condition"
              value={values.catalogueConditionId}
              onChange={handleChange}
              helperText={errors.catalogueConditionId}
              options={allConditions.data || []}
              error={!!errors.catalogueConditionId}
              required
            />

            <AppInput
              id="price"
              name="price"
              label="Price"
              placeholder="Enter Price"
              type="text"
              value={values.price}
              onChange={handleInputChange}
              helperText={errors.price}
              error={!!errors.price}
              required
            />

            <GoogleLocationInput
              updateInput={handelUpdateValue}
              value={locationValue}
              error={!!errors?.location}
            />
            <AppSelect
              id="listingType"
              name="listingType"
              label="Listing Type"
              placeholder="Select"
              value={values.listingType}
              onChange={handleChangeListing}
              helperText={errors.listingType}
              options={listingType}
              error={!!errors.listingType}
              required
            />

            <AppSelect
              id="durationInHours"
              name="durationInHours"
              label="Listing Duration"
              placeholder="Enter duration"
              value={values?.durationInHours}
              onChange={handleChange}
              helperText={errors.durationInHours}
              options={
                values?.listingType === 0
                  ? []
                  : values?.listingType > 1
                  ? optionsForAuctionListing
                  : optionsForShelfListing
              }
              error={!!errors.durationInHours}
              required
            />

            <AppSelect
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

            <AppInput
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
          </div>

          <MuiButton
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            className="btn"
            color="primary">
            {isSubmitting ? (
              <MuiCircularProgress size={20} />
            ) : (
              "Publish listing"
            )}
          </MuiButton>
        </div>
      </PageContent>
    </FormikProvider>
  );
}

const PageContent = styled.form`
  width: 100%;
  margin: auto;

  & .divider {
    margin: 20px 0 25px;
  }

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
