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
import { IBranchData, IStatus } from "@/types/globalTypes";
import CustomStyledSelect from "../select/CustomStyledSelect";
import { OrderStatus } from "../feedback/OrderStatus";

type IProps =
  | {
      title: string;

      showFilter?: boolean;
      defaultValue?: number | string;
      defaultOptions?: any[];
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
    }
  | {
      title: string;
      showFilter?: boolean;
      defaultValue?: IBranchData;
      defaultOptions?: any[];
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
    };

export function TotalCard({
  title,
  variant,
  showFilter = true,
  className,
  subAction,
  defaultValue = "",
  defaultOptions,
  setValues,
  value,
  name,
  filterType = "minimal",
  statusType = "new",
}: IProps) {
  const handleChangeMinimal = (value: string) => {
    setValues?.((prev: any) => ({ ...prev, [name || ""]: value }));
  };

  const handleChangeStandard = (
    e: MuiSelectChangeEvent<any>,
    newValue: React.ReactNode
  ) => {
    const { value } = e.target;
    setValues?.((prev: any) => ({ ...prev, [name || ""]: value }));
  };

  const totalValue =
    typeof defaultValue === "number"
      ? formatCurrency({ amount: defaultValue, style: "decimal" })
      : typeof defaultValue === "string"
      ? defaultValue
      : "";

  const options = defaultOptions?.map((x) => x) || [];

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
      {variant === "branch" && (
        <div className="branch">
          {defaultValue ? (
            <>
              <Title className="branch-name">
                {(defaultValue as IBranchData)?.name || ""}
              </Title>
              <MuiTypography variant="body2" className="location">
                <IconLocation /> {(defaultValue as IBranchData)?.location || ""}
              </MuiTypography>
            </>
          ) : (
            <MuiTypography variant="body2" className="no-data">
              Top selling branch will appear here
            </MuiTypography>
          )}
        </div>
      )}

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
            <span className="duration">({value?.replaceAll("_", " ")})</span>
          )}
        </MuiTypography>
      )}
      {variant === "order" && (
        <MuiTypography variant="body1" className="balance">
          {totalValue || 0}{" "}
          {showFilter && filterType === "minimal" && (
            <span className="duration">({value?.replaceAll("_", " ")})</span>
          )}
        </MuiTypography>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  /* max-width: 570px; */
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
