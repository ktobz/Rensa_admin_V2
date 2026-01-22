import * as Yup from "yup";

import useCachedDataStore from "@/config/store-config/lookup";
import {
  IconChecked,
  IconUnchecked,
  MuiButton,
  MuiCheckbox,
  MuiDivider,
  MuiFormControlLabel,
  styled,
} from "@/lib/index";
import NotificationService from "@/services/notification-service";
import { ICategory } from "@/types/globalTypes";
import { useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";

const SCHEMA = Yup.object().shape({
  waitTimeInHours: Yup.number().required("required"),
  offerExpirationInHours: Yup.number().required("required"),
  offerReminderIntervalInMinutes: Yup.number().required("required"),
  pendingCheckoutReminderInMinutes: Yup.number().optional(),
  maxCheckoutReminders: Yup.number().optional(),

  offerPendingCheckoutReminderInMinutes: Yup.number().required("required"),
  offerMaxCheckoutReminders: Yup.number().required("required"),
  auctionPendingCheckoutReminderInMinutes: Yup.number().required("required"),
  auctionMaxCheckoutReminders: Yup.number().required("required"),
});

type IViewProps = {
  initData?: any;
  refreshQuery?: () => void;
  handleClose: () => void;
};

type QueryTypes = "listingType" | "listingStatus" | "category" | "others";
type SelectedValues = { [key in QueryTypes]: number[] };

const defaultValues = {
  listingType: [],
  listingStatus: [],
  category: [],
  others: [],
};

export const MarketplaceFilter = ({
  initData,
  handleClose,
  refreshQuery,
}: IViewProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams
    ?.get("Status")
    ?.split(",")
    ?.map((x) => Number(x))
    ?.filter((x) => x);
  const categoryFilter = searchParams
    ?.get("CatalogueCategoryId")
    ?.split(",")
    ?.map((x) => Number(x))
    ?.filter((x) => x);
  const listingTypeFilter = searchParams
    ?.get("ListingType")
    ?.split(",")
    ?.map((x) => Number(x))
    ?.filter((x) => x);
  const otherFilter = searchParams
    ?.get("Others")
    ?.split(",")
    ?.map((x) => Number(x))
    ?.filter((x) => x);

  const { data: catalogueCategories } = useQuery(
    ["all-categories-filter"],
    () =>
      NotificationService.getCategories(`?PageNumber=1&PageSize=500`).then(
        (res) => {
          return res.data?.result?.data?.map((x) => ({
            name: x?.name || "",
            id: x?.id || "",
          })) as unknown as ICategory[];
        }
      ),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const { catalogueStatus, listingType, bidStatus } = useCachedDataStore(
    (state) => state.cache?.lookup
  );

  const [selectedValues, setSelectedValues] = useState<SelectedValues>(() => {
    if (
      statusFilter?.length ||
      categoryFilter?.length ||
      listingTypeFilter?.length ||
      otherFilter?.length
    ) {
      return {
        listingStatus: statusFilter || [],
        category: categoryFilter || [],
        listingType: listingTypeFilter || [],
        others: otherFilter || [],
      };
    }

    return defaultValues;
  });

  const handleReset = () => {
    setSelectedValues(defaultValues);
    searchParams.delete("CatalogueCategoryId");
    searchParams.delete("ListingType");
    searchParams.delete("Status");
    searchParams.delete("Others");
    setSearchParams(searchParams);
  };

  const handleChange = (name: QueryTypes, id: number) => (e: any) => {
    const values = selectedValues?.[name];
    if (values?.includes(id)) {
      const idx = values?.findIndex((x: number) => x === id);
      values?.splice(idx, 1);

      setSelectedValues((prev) => ({ ...prev, [name]: values }));
    } else {
      setSelectedValues((prev) => ({
        ...prev,
        [name]: [...prev?.[name], id],
      }));
    }
  };

  const handleSelectAll = (name: QueryTypes, list: ICategory[]) => (e: any) => {
    const values = selectedValues?.[name];

    if (values?.length === list.length) {
      setSelectedValues((prev) => ({ ...prev, [name]: [] }));
    } else {
      setSelectedValues((prev) => ({
        ...prev,
        [name]: list?.map((x) => x?.id),
      }));
    }
  };

  const handleSetQueries = () => {
    searchParams.set("CatalogueCategoryId", selectedValues.category?.join(","));
    searchParams.set("ListingType", selectedValues.listingType?.join(","));
    searchParams.set("Status", selectedValues.listingStatus?.join(","));
    setSearchParams(searchParams);

    handleClose();
  };

  const checkedAllListingType =
    selectedValues?.listingType?.length === listingType.length;
  const checkedAllListingStatus =
    selectedValues?.listingStatus?.length === catalogueStatus?.length;

  const checkedAllCategory =
    selectedValues?.category?.length === (catalogueCategories || [])?.length;
  const checkedAllOthers = selectedValues?.others?.length === bidStatus?.length;

  return (
    <StyledSection>
      <div className="wrapper pt-4 flex flex-col gap-5">
        <section>
          <p className="font-bold p-0 m-0 mb-3">Listing Type</p>
          <section className="flex-wrapper w-full pl-2">
            <MuiFormControlLabel
              onChange={handleSelectAll("listingType", listingType)}
              control={
                <MuiCheckbox
                  checkedIcon={<IconChecked />}
                  icon={<IconUnchecked />}
                  checked={checkedAllListingType}
                  name="All"
                />
              }
              label="All"
            />
            {listingType?.map((opt) => (
              <MuiFormControlLabel
                onChange={handleChange("listingType", opt?.id)}
                control={
                  <MuiCheckbox
                    checkedIcon={<IconChecked />}
                    icon={<IconUnchecked />}
                    checked={selectedValues?.listingType?.includes(opt?.id)}
                    name={opt?.name}
                  />
                }
                style={{ userSelect: "none" }}
                label={opt?.name}
              />
            ))}
          </section>
        </section>
        <MuiDivider className=" w-full block" />
        <section>
          <p className="font-bold p-0 m-0 mb-3 ">Listing Status</p>

          <section className="flex-wrapper w-full pl-2 flex-wrap">
            <MuiFormControlLabel
              onChange={handleSelectAll("listingStatus", catalogueStatus)}
              control={
                <MuiCheckbox
                  checkedIcon={<IconChecked />}
                  icon={<IconUnchecked />}
                  checked={checkedAllListingStatus}
                  name="All"
                />
              }
              label="All"
            />
            {catalogueStatus?.map((opt) => (
              <MuiFormControlLabel
                onChange={handleChange("listingStatus", opt?.id)}
                control={
                  <MuiCheckbox
                    checkedIcon={<IconChecked />}
                    icon={<IconUnchecked />}
                    checked={
                      !!selectedValues?.listingStatus?.find(
                        (x) => +x === opt?.id
                      ) || false
                    }
                    name={opt?.name}
                  />
                }
                style={{ userSelect: "none" }}
                label={opt?.name}
              />
            ))}
          </section>
        </section>

        <MuiDivider className="my-4 w-full block" />
        <section>
          <p className="font-bold p-0 m-0 mb-3 ">Category</p>

          <section className="flex-wrapper w-full pl-2 flex-wrap">
            <MuiFormControlLabel
              onChange={handleSelectAll("category", catalogueCategories || [])}
              control={
                <MuiCheckbox
                  checkedIcon={<IconChecked />}
                  icon={<IconUnchecked />}
                  checked={checkedAllCategory}
                  name="All"
                />
              }
              label="All"
            />
            {catalogueCategories?.map((opt) => (
              <MuiFormControlLabel
                onChange={handleChange("category", opt?.id)}
                control={
                  <MuiCheckbox
                    checkedIcon={<IconChecked />}
                    icon={<IconUnchecked />}
                    checked={
                      !!selectedValues?.category?.find((x) => +x === opt?.id) ||
                      false
                    }
                    name={opt?.name}
                  />
                }
                label={opt?.name}
                style={{ userSelect: "none" }}
              />
            ))}
          </section>
        </section>

        <MuiDivider className="my-4 w-full block" />

        <section>
          <p className="font-bold p-0 m-0 mb-3 ">Others</p>

          <section className="flex-wrapper w-full pl-2 flex-wrap">
            <MuiFormControlLabel
              onChange={handleSelectAll("others", bidStatus)}
              control={
                <MuiCheckbox
                  checkedIcon={<IconChecked />}
                  icon={<IconUnchecked />}
                  checked={checkedAllOthers}
                  name="All"
                />
              }
              label="All"
            />
            {bidStatus?.map((opt) => (
              <MuiFormControlLabel
                onChange={handleChange("others", opt?.id)}
                control={
                  <MuiCheckbox
                    checkedIcon={<IconChecked />}
                    icon={<IconUnchecked />}
                    checked={
                      !!selectedValues?.others?.find((x) => +x === opt?.id) ||
                      false
                    }
                    name={opt?.name}
                  />
                }
                label={opt?.name}
                style={{ userSelect: "none" }}
              />
            ))}
          </section>
        </section>

        <div className="btn-group border-t-1 border-t-[#E8E8E8] pt-4">
          <MuiButton
            variant="outlined"
            size="small"
            color="inherit"
            onClick={handleReset}
            className="btn">
            Reset all
          </MuiButton>
          <MuiButton
            onClick={handleSetQueries}
            size="small"
            variant="contained"
            color="primary"
            className="btn">
            Apply Filter
          </MuiButton>
        </div>
      </div>
    </StyledSection>
  );
};

const StyledSection = styled.form`
  width: 100%;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  max-width: 580px;
  width: calc(100vw - 80px);
  padding-bottom: 0;

  & .wrapper {
    width: 100%;
  }

  & .flex-wrapper {
    display: flex;
    gap: 10px;
    align-items: self-end;
  }

  & .btn {
    align-items: center;
    justify-content: center;
    width: fit;
    min-height: fit;
    height: 36px;
  }

  & .btn-group {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: end;
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

  @media screen and (max-width: 580px) {
    & .flex-wrapper {
      display: block;
    }
  }
`;
