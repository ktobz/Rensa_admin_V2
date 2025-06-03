import { FormikProvider, useFormik } from "formik";
import * as React from "react";
import * as Yup from "yup";

import {
  MuiButton,
  MuiCircularProgress,
  MuiDivider,
  MuiTypography,
  styled,
} from "@/lib/index";
import { useLocation, useNavigate } from "react-router-dom";

import { IListingData, PlaceType, StructuredFormatting } from "@/types/globalTypes";
import { useQuery } from "react-query";

import AppInput from "@/components/input";
import GoogleLocationInput from "@/components/select/GoogleLocationInput";
import AppSelect from "@/components/select/autoComplete";
import useCachedDataStore from "@/config/store-config/lookup";
import NotificationService from "@/services/notification-service";

import { UserDetailCard } from "@/components/card/UserCard";
import { Loader } from "@/components/loader/Loader";
import ListingService from "@/services/listing-service";
import { formatToPrice } from "@/utils/helper-funcs";
import { useIds } from "@/utils/hooks";
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

export function EditListingDetails() {
  const { state } = useLocation();
  const { reportId } = useIds();

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

  const [resetImages, setResetImages] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);


  const { data, isLoading } = useQuery(
    ["listing-details", reportId],
    () =>
      ListingService.getDetails(reportId || "").then((res) => {
        const data = res.data?.result;
        return data;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: !!reportId,
      initialData: state as IListingData,
    }
  );

  const [locationValue, setLocationValue] = React.useState<PlaceType | null>(
    () => {
      if(data){
        return {
          description: data?.location,
          place_id: '',
          structured_formatting: data?.location as unknown as StructuredFormatting
        } 
      }
      return null;
    }
  );


  const initialData = {
    location:data?.location || "",
    catalogueCategoryId:data?.catalogueCategory?.id || 0,
    catalogueConditionId:data?.catalogueCondition?.id || 0,
    description: data?.description || "",
    durationInHours:data?.durationInHours || 0,
    files:  data?.catalogueAttachments?.map((x)=>x?.url) || [],
    name:data?.name || "",
    pickupMethod:data?.pickupMethod || 0,
    price:formatToPrice(data?.price.toString()||'0') || "",
    userId:data?.creatorUserId || "",
    userId_name: "",
    files_preview: data?.catalogueAttachments?.map((x)=>x?.url) || [],
    listingType:data?.listingType || 0,
  };


  const createListing = async (values: any) => {
    // return console.log({values});
    if (values?.files?.length === 0 && values.catalogueAttachments.length ===0) {
      toast.warn("Listing Image is missing");
      return false;
    }

    const formData = new FormData();

    if (!locationValue?.place_id?.trim() && !data?.locationInfo?.latitude) {
      toast.warn("Place ID is missing. Kindly re-enter the item location");
      return false;
    }

    const price = (values?.price)?.replaceAll(",", "");
    
    formData.append("Name", values?.name);
    formData.append("UserId", values?.userId);
    formData.append("Description", values.description);
    formData.append("Price", price);
    formData.append("LocationInfo.Location", data?.locationInfo?.location||'');
    formData.append("LocationInfo.Latitude", data?.locationInfo?.latitude?.toString()||'');
    formData.append("LocationInfo.Longitude", data?.locationInfo?.longitude?.toString()||'');
    formData.append("LocationInfo.City", data?.locationInfo?.city||'');
    formData.append("LocationInfo.State", data?.locationInfo?.state||'');
    formData.append(
      "CatalogueConditionId",
      values?.catalogueConditionId
    );
    formData.append("CatalogueCategoryId", values?.catalogueCategoryId);
    formData.append("DurationInHours", values?.durationInHours);
    formData.append("PickupMethod", values?.pickupMethod);
    formData.append("ListingType", values?.listingType);
    
    if(values?.files?.length > 0){
      let catalogueIndex = 0;
      for (let i = 0; i < values.files.length; i += 1) {
        const image = values.files[i];

        if(typeof image ==='string'){

          formData.append(`CatalogueAttachments[${catalogueIndex}].Url`, image);
          formData.append(`CatalogueAttachments[${catalogueIndex}].CleansedName`, data?.catalogueAttachments?.find((x)=> x?.url === image)?.cleansedName as any);

          catalogueIndex+=1;

        }else{
           formData.append("Files", image as any);
        }
       
      }
    }


    if ((window as any).google && locationValue?.place_id) {
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
            setIsSubmitting(true);
           
            formData.append("LocationInfo.Location", formattedAddress);
            formData.append("LocationInfo.Latitude", latitude);
            formData.append("LocationInfo.Longitude", longitude);
            formData.append("LocationInfo.City", city);
            formData.append("LocationInfo.State", state);

            
          } else {
            console.error("Error fetching place details:", status);
            setIsSubmitting(false);
            return false
          }
        }
      );
    }

    setIsSubmitting(true);
    try {
      const { data } = await ListingService.update(reportId, formData);
      toast.success(data?.result?.message);
      setIsSubmitting(false);
      navigate(`/app/marketplace/listings/${reportId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setIsSubmitting(false);
    }
  };

  const formik =  useFormik({
    initialValues: data ? initialData :{},
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      createListing(values);
    },enableReinitialize:true
  });

  const { errors, handleSubmit, handleChange, values, setFieldValue } = formik;



  // console.log({values, data, locationValue});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    const v = formatToPrice(value, values.price);

    setFieldValue(name, v);
  };

  const allCategory = useQuery(
    ["all-category"],
    () =>
      NotificationService.getCategories(`?pageSize=1000`).then((res) => {
        return res.data.result?.data?.map((x)=> ({name:x?.name, id: x?.id}));
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
        return res.data.result?.data.map((x)=> ({name:x?.name, id: x?.id}));
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


  return ( (isLoading || allCategory?.isLoading || allConditions?.isLoading) ? (
    <CustomSection>
        <Loader size={80} />
    </CustomSection>
  ):(
    <FormikProvider value={formik}>
      <PageContent onSubmit={handleSubmit}>
        <div className="listing">
          <div className="group-heading">
            <MuiTypography variant="h4" className="heading">
              Edit Listing
            </MuiTypography>
          </div>

          <div className="input-wrapper">
          <UserDetailCard
        variant="user"
        data={{
          title: `${data?.sellerInfo?.firstName ?? "-"} ${
            data?.sellerInfo?.lastName ?? "-"
          }`,
          body: `${data?.sellerInfo?.email ?? "-"}`,
          image: data?.sellerInfo?.profilePictureUrl,
          verStatus: data?.sellerInfo?.isVerified || false,
        }}
        viewDetailsLink={`/app/users/${data?.sellerInfo?.userId}`}
        className="user-card"
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
            {/* <AppSelect
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
            /> */}

            <AppSelect
              id="durationInHours"
              name="durationInHours"
              label="Listing Duration"
              placeholder="Enter duration"
              value={values?.durationInHours}
              onChange={handleChange}
              disabled
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
              "Save listing"
            )}
          </MuiButton>
        </div>
      </PageContent>
    </FormikProvider>

  )
  );
}

const CustomSection = styled.section`
  width: 100%;
  display: flex;
  justify-content:center;
  align-items:center;
  height: 100%;
  min-height: 500px;
  `

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
      margin-bottom: 10px;

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
