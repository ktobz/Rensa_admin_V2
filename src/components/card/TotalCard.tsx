import * as React from "react";
import {
  MuiButton,
  MuiSelectChangeEvent,
  MuiTypography,
  styled,
} from "@/lib/index";
import { formatCurrency } from "utils/helper-funcs";
import Title from "@/components/text/Title";
import { IconLocation } from "@/lib/mui.lib.icons";
import DurationFilter from "../select/DurationFilter";
import { IBranchData, ICategory, IStatus } from "@/types/globalTypes";
import CustomStyledSelect from "../select/CustomStyledSelect";
import { OrderStatus } from "../feedback/OrderStatus";
import { useQuery } from "react-query";
import OrderService from "@/services/order-service";
import { AxiosPromise } from "axios";

type IProps =
  | {
      title: string;

      showFilter?: boolean;
      defaultValue?: number | string;
      defaultOptions?: any[];
      defaultOptionId?: number;

      setValues?: React.Dispatch<React.SetStateAction<string>>;
      value?: string;
      variant: "order" | "sales";
      name?: string;
      subAction?: {
        name: string;
        action: () => void;
      };
      className?: string;
      filterType?: "minimal" | "standard" | "status";
      statusType?: IStatus;
      queryKey?: string;
      serviceFunc?: ({ filter }: { filter: number }) => AxiosPromise<any>;
    }
  | {
      title: string;
      showFilter?: boolean;
      defaultValue?: string;
      defaultOptionId?: number;
      defaultOptions?: ICategory[];
      setValues?: React.Dispatch<React.SetStateAction<any>>;
      value?: string;
      variant: "branch";
      name?: string;
      subAction?: {
        name: string;
        action: () => void;
      };
      className?: string;
      filterType?: "minimal" | "standard" | "status";
      statusType?: IStatus;
      queryKey?: never;
      serviceFunc?: never;
    };

export function TotalCard({
  title,
  variant,
  showFilter = true,
  className,
  subAction,
  defaultValue = "",
  defaultOptionId,
  defaultOptions,
  setValues,
  // value,
  name,
  filterType = "minimal",
  statusType = "new",
  queryKey,
  serviceFunc,
}: IProps) {
  const options = defaultOptions?.map((x) => x) || [];

  const [value, setValue] = React.useState<number>(
    options?.[defaultOptionId || 0]?.id
  );
  const [valueString, setValueString] = React.useState<string>(
    options?.[defaultOptionId || 0]?.name
  );

  const handleChangeMinimal = (val: ICategory) => {
    setValueString(val?.name);
    setValue(val?.id);
  };

  const handleChangeStandard = (
    e: MuiSelectChangeEvent<any>,
    newValue: React.ReactNode
  ) => {
    const { value } = e.target;
    setValues?.((prev: any) => ({ ...prev, [name || ""]: value }));
  };

  const { data } = useQuery(
    [queryKey, valueString],
    () =>
      serviceFunc?.({ filter: value }).then((res) => {
        const data = res.data?.result?.data || 0;
        return data as number;
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: typeof serviceFunc === "function",
    }
  );

  const totalValue =
    typeof (defaultValue || data) === "number"
      ? formatCurrency({ amount: +defaultValue || data || 0, style: "decimal" })
      : typeof (defaultValue || data) === "string"
      ? defaultValue || data
      : "";

  return (
    <StyledWrapper className={className}>
      <div className="top-section">
        <MuiTypography className="title" variant="subtitle2">
          {title}
        </MuiTypography>
        {showFilter && (
          <div className="actions">
            {filterType === "minimal" && (
              <DurationFilter
                selectedValue={value}
                handleOptionSelect={handleChangeMinimal}
                options={options}
              />
            )}
            {filterType === "standard" && (
              <CustomStyledSelect
                value={value}
                onChange={handleChangeStandard}
                options={options || []}
                optionTitle="name"
                optionValue="id"
                style={{ width: "130px" }}
              />
            )}

            {filterType === "status" && (
              <OrderStatus
                type={statusType}
                style={{
                  fontSize: "11px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              />
            )}
          </div>
        )}
      </div>

      {subAction && (
        <MuiButton
          className="action-btn"
          color="secondary"
          onClick={subAction.action}
          variant="text">
          {subAction?.name}
        </MuiButton>
      )}

      {variant === "sales" && (
        <MuiTypography variant="body1" className="balance">
          ₦ {totalValue || 0}{" "}
          {showFilter && filterType === "minimal" && (
            <span className="duration">({valueString})</span>
          )}
        </MuiTypography>
      )}
      {variant === "order" && (
        <MuiTypography variant="body1" className="balance">
          {totalValue || 0}{" "}
          {showFilter && filterType === "minimal" && (
            <span className="duration">({valueString})</span>
          )}
        </MuiTypography>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  background: #fbfbfb;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 20px;

  @media screen and (max-width: 450px) {
    & .top-section {
      & .MuiTypography-root {
        font-size: 11px !important;
      }
    }
  }

  & .action-btn {
    width: fit-content;
    height: fit-content;
    padding: 3px 0;
  }

  & .duration {
    font-size: 10px;
    white-space: nowrap;
  }

  & .branch {
    display: flex;
    flex-direction: column;
    width: 100%;

    & .branch-name {
      text-align: left;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 300px;
    }

    & .location {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 300px;
      /* display: flex;
      align-items: center; */
    }

    & .no-data {
      color: #5d6c87;
      text-align: center;
    }
  }

  & .balance {
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 34px;
    color: #000000;
    margin: 20px 0 10px 0;
    line-height: 19px;
  }

  & .top-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;

    & .actions {
      display: flex;
      gap: 10px;
    }
    & .title {
      font-weight: 600;
    }
  }
`;
