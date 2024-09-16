import { FormikProvider, useFormik } from "formik";
import * as React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import GoogleLocationInput from "@/components/select/GoogleLocationInput";
import { MuiButton, MuiCircularProgress, styled } from "@/lib/index";
import ConfigService from "@/services/config-service";
import { IPayoutData, PlaceType } from "@/types/globalTypes";

const SCHEMA = Yup.object().shape({
  location: Yup.number().required("required"),
});

type IViewProps = {
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

export const PickupLocation = ({
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {
  const initialData: IPayoutData = {
    id: initData?.id || "",
    waitTimeInHours: initData?.waitTimeInHours || "",
  };

  const [isSaving, setIsSaving] = React.useState(false);
  const [locationValue, setLocationValue] = React.useState<PlaceType | null>(
    () => {
      return null;
    }
  );

  const handleSetLocation = (values: any) => {
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
  
            setIsSaving(true);
            const formData = new FormData();
            formData.append("Name", values?.name);
            formData.append("UserId", values?.userId);
            formData.append("Description", values.description);
            formData.append("LocationInfo.Location", formattedAddress);
            formData.append("LocationInfo.Latitude", latitude);
            formData.append("LocationInfo.Longitude", longitude);
            formData.append("LocationInfo.City", city);
            formData.append("LocationInfo.State", state);
            
  
            try {
              const { data } = await ConfigService.setPickupLocation(formData);
              toast.success(data?.result?.message);
              setIsSaving(false);
            } catch (error: any) {
              toast.error(error?.response?.data?.message);
              setIsSaving(false);
            }
          } else {
            console.error("Error fetching place details:", status);
            setIsSaving(false);
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
      handleSetLocation(values);
    },
  });

  const { errors, handleSubmit, values, setFieldValue } = formik;

  const handelUpdateValue = (value: any) => {
    setLocationValue(value);
    setFieldValue("location", value?.description);
  };

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={handleSubmit}>
        <div className="wrapper">
          <GoogleLocationInput  label='Pickup Address' 
            updateInput={handelUpdateValue}
            value={locationValue}
            error={!!errors?.location}
          />

          <div className="btn-group">
            <MuiButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSaving}
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
  width: calc(100vw - 80px);

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
