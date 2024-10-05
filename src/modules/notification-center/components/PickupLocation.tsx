import { NoData } from "@/components/feedback/NoData";
import { CustomSwitch } from "@/components/input/CustomSwitch";
import GoogleLocationInput from "@/components/select/GoogleLocationInput";
import AppVirtualizedCountriesSelect from "@/components/select/test";
import {
  IconAdd,
  IconEdit,
  IconLocationBrand,
  MuiBox,
  MuiButton,
  MuiCircularProgress,
  MuiIconButton,
  MuiInputLabel,
  MuiTypography,
  styled
} from "@/lib/index";
import ConfigService from "@/services/config-service";
import CustomerService from "@/services/customer-service";
import { IApprovedLocationData, PlaceType } from "@/types/globalTypes";
import { FormikProvider, useFormik } from "formik";
import debounceFunc from "lodash.throttle";
import * as React from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import * as Yup from "yup";


const SCHEMA = Yup.object().shape({
  location: Yup.string().required("required"),
});

type TShowMode = "list" | "add" | "update" | "delete";



export const PickupLocation = () => {
  const queryClient = useQueryClient();

  const [mode, setMode] = React.useState<TShowMode>("list");
  const [selectedData, setSelectedData] =
    React.useState<null | IApprovedLocationData>(null);

  const [, setUserNameText] = React.useState("");
  const [name, setName] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(false);
  const [locationValue, setLocationValue] = React.useState<PlaceType | null>(
    () => {
      return null;
    }
  );

  const handleSeeList = () => {
    setSelectedData(null);
    setMode("list");
  };

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

            const reqBody = {
              location: formattedAddress,
              latitude,
              longitude,
              city,
              state,
              userId: values?.userId,
            };

            try {
              const { data } = await ConfigService.createPickupLocation(
                reqBody
              );
              toast.success(data?.message);
              handleSeeList();
              handleInvalidateQuery();
              setIsSaving(false);
            } catch (error: any) {
              toast.error(error?.response?.data?.message);
              setIsSaving(false);
            }
          } else {
            setIsSaving(false);
          }
        }
      );
    }
  };

  const formik = useFormik({
    initialValues: {},
    validationSchema: SCHEMA,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      handleSetLocation(values);
    },
  });

  const { errors, handleSubmit, values, setFieldValue, resetForm } = formik;

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

  const { data: approvedLocations, isLoading: approvedLocationsIsLoading, refetch } =
    useQuery(
      ["locations"],
      () =>
        ConfigService.getAllPickupLocation().then((res) => {
          const data = res.data?.result;
          return data;
        }),
      {
        retry: 0,        
      }
    );

  const handleRefresh = () => {
    queryClient.invalidateQueries(["locations"]);
    refetch();
    console.log('handleRefresh')
  };

  const handleInvalidateQuery = () => {
    handleRefresh();
    setMode("list");
  };

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

  const handelUpdateValue = (value: any) => {
    setLocationValue(value);
    setFieldValue("location", value?.description);
  };

  const handleToggleShow = (name: TShowMode) => () => {
    setSelectedData(null);
    setLocationValue(null);
    setUserNameText("");
    setName("");
    resetForm();

    setFieldValue("location", "");
    setFieldValue("userId", "");
    setMode(name);
  };

  const handleSetEditData = (data: IApprovedLocationData) => () => {
    resetForm();
    setSelectedData(data);
    setLocationValue(null);
    setFieldValue("location", data?.location);
    setFieldValue("userId", data?.userId);

    setMode("update");
  };

  const handleToggleActiveStatus = (id: number) => async () => {
    setShowLoader(true);
    try {
      const res = await ConfigService.togglePickupLocation(id);
      setShowLoader(false);

      const data = res?.data;
      if (data.result) {
        toast.success(data?.result?.message || "");
        handleRefresh();
        return;
      }

      toast.error(data?.message || "");
      handleRefresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "");
      setShowLoader(false);
    }
  };

  return (
    <SectionWrapper>
      {!approvedLocationsIsLoading &&
        approvedLocations &&
        approvedLocations?.length === 0 &&
        mode === "list" && (
          <div className="no-data-group">
            <NoData
              title="No pickup location added"
              message="Click button below to add approved locations for Pro-seller"
            />
            <MuiButton
              startIcon={<IconAdd />}
              variant="contained"
              color="primary"
              onClick={handleToggleShow("add")}
              className="btn">
              Add New
            </MuiButton>
          </div>
        )}

      {!approvedLocationsIsLoading &&
        approvedLocations &&
        approvedLocations?.length > 0 &&
        mode === "list" && (
          <section className="location-list">
            <MuiButton
              startIcon={<IconAdd />}
              variant="contained"
              color="primary"
              onClick={handleToggleShow("add")}
              className="btn add-new">
              Add New
            </MuiButton>

            {approvedLocations?.map((location, index) => (
              <div
                className="location"
                key={location?.id}
                style={{
                  borderTop: index !== 0 ? "1px solid #f8f8f8" : "",
                }}>
                <div className="left">
                  <IconLocationBrand />
                  <div className="content">
                    <MuiTypography variant="body1" className="address">
                      {location?.location} {location?.state}
                    </MuiTypography>
                    <MuiTypography variant="body1" className="username">
                      {location?.user?.firstName} {location?.user?.lastName}
                    </MuiTypography>
                  </div>
                </div>
                <MuiBox className="action-group">
                  <MuiIconButton
                    color="warning"
                    onClick={handleSetEditData(location)}
                    className={`action-btn edit-btn `}>
                    <IconEdit />
                  </MuiIconButton>

                  <MuiInputLabel
                    style={{ cursor: "pointer" }}
                    onClick={handleToggleActiveStatus(location.id)}>
                    <CustomSwitch
                      disabled
                      checked={location?.isActive}
                      defaultChecked={location?.isActive}
                    />
                  </MuiInputLabel>
                </MuiBox>
              </div>
            ))}
          </section>
        )}

      {!approvedLocationsIsLoading && approvedLocations && mode !== "list" && (
        <FormikProvider value={formik}>
          <StyledForm onSubmit={handleSubmit}>
            <div className="wrapper">
              <GoogleLocationInput
                label="Pickup Address"
                updateInput={handelUpdateValue}
                value={locationValue}
                error={!!errors?.location}
              />

              <AppVirtualizedCountriesSelect
                label="Select Pro-seller (optional)"
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

              <div className="btn-group">
                {approvedLocations.length > 0 && (
                  <MuiButton
                    type="button"
                    variant="contained"
                    onClick={handleSeeList}
                    disabled={isSaving}
                    className="secondary-btn btn">
                    Back
                  </MuiButton>
                )}
                <MuiButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSaving}
                  startIcon={
                    isSaving ? <MuiCircularProgress size={16} /> : null
                  }
                  className="btn">
                  {mode} Address
                </MuiButton>
              </div>
            </div>
          </StyledForm>
        </FormikProvider>
      )}

      {/* <AppCustomModal
        handleClose={handleToggleShow("list")}
        open={mode === "delete"}
        showClose>
        <></>
      </AppCustomModal> */}

      {((approvedLocationsIsLoading &&
        !approvedLocations &&        
        mode === "list" ) || showLoader) && (
        <div className="loader">
          <MuiCircularProgress size={40} />
        </div>
      )}
    </SectionWrapper>
  );
};

const StyledForm = styled.form`
  width: 100%;

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

    & .secondary-btn {
      background: #fbfbfb;
      color: #363636;
    }
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

const SectionWrapper = styled.section`
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  max-width: 450px;
  width: calc(100vw - 80px);
  position: relative;
  min-height: 300px;

  & .loader {
    width: 100%;
    height: 100%;
    background: #00000014;
    z-index: 100;
    position: absolute;
    top: 0;
    min-height: 300px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  & .location-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    & .add-new {
      margin-bottom: 30px;
      align-self: end;
    }
  }

  & .location {
    display: flex;
    gap: 30px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 14px 0;

    & .left {
      display: flex;
      gap: 10px;
      align-items: center;
      flex: 1;

      & .content {
        flex: 1;
      }
      & .address {
        color: #282828;
        font-size: 14px;
        font-weight: 500;
        line-height: 18px;
      }

      & .username {
        color: #64748b;
        font-size: 12px;
        font-weight: 400;
      }
    }
  }

  & .no-data-group {
    display: flex;
    flex-direction: column;
    gap: 30px;
    justify-items: center;
    align-items: center;
  }

  & .btn {
    height: 36px;
    font-size: 12px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  & .action-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  & .MuiSwitch-track {
    opacity: 1 !important;
  }
  & .Mui-checked {
    color: #fff !important;
  }

  & .edit-btn {
    background: #ffc5021a;
    color: #d78950;

    svg {
      color: #d78950;
    }
  }

  & .delete-btn {
    background: #ef50501a;
    color: #d78950;

    svg {
      color: #d78950;
    }
  }
`;
