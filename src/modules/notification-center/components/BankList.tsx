import * as React from "react";

import {
  MuiButton,
  MuiCircularProgress,
  MuiTypography,
  styled,
} from "@/lib/index";
import { toast } from "react-toastify";

import { NoData } from "@/components/feedback/NoData";
import CustomSearch from "@/components/input/CustomSearch";
import { CustomSwitch } from "@/components/input/CustomSwitch";
import LineListSkeleton from "@/components/skeleton/LineListSkeleton";
import AuthService from "@/services/auth.service";
import { IBank } from "@/types/globalTypes";
import throttle from "lodash.throttle";
import { useQuery, useQueryClient } from "react-query";

type IViewProps = {
  handleClose: () => void;
};

export const BankList = ({ handleClose }: IViewProps) => {
  const queryId = React.useRef(new Date().getTime());
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [text, setText] = React.useState("");

  const [allData, setAllData] = React.useState<IBank[]>([]);
  const [ids, setIds] = React.useState<number[]>([]);
  const [changedStatusIds, setChangedStatusIDs] = React.useState<{
    [key: string]: boolean;
  }>({});

  const [checked, setChecked] = React.useState(() => {
    const states: { [key: string]: boolean } = {};

    for (let i = 0; i < allData.length; i += 1) {
      states[allData[i]?.id] = allData[i]?.isActive || false;
    }

    return states;
  });

  const handleSetCheckStatus = (data: IBank[]) => {
    const states: { [key: string]: boolean } = {};

    for (let i = 0; i < data.length; i += 1) {
      states[data[i]?.id] = data[i]?.isActive;
    }
    setChecked(states);
  };
  const handleSetDefaultCheckStatus = (data: IBank[]) => {
    const states: { [key: string]: boolean } = {};

    for (let i = 0; i < data.length; i += 1) {
      states[data[i]?.id] = data[i]?.isActive;
    }
    setChangedStatusIDs(states);
  };

  const { data, isLoading } = useQuery(
    ["all-banks", text, queryId],
    () =>
      AuthService.allBanks(
        `?PageNumber=${1}&PageSize=${1000}&searchText=${text}`
      ).then((res) => {
        const data = res.data.result?.data?.sort((a, b) => {
          if (a.isActive && !b.isActive) {
            return 1;
          } else if (!a.isActive && b.isActive) {
            return -1;
          } else {
            return 0;
          }
        });
        setAllData(data);
        handleSetCheckStatus(data);
        handleSetDefaultCheckStatus(data);

        return data as IBank[];
      }),

    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries(["all-bank", text, queryId]);
    handleClose();
  };

  const handleUpdateProductStatus = () => {
    setIsSubmitting(true);

    AuthService.updateBankStatus(ids)
      .then((res) => {
        handleRefresh?.();
        toast.success(res.data?.message || "");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCheck =
    (id: number) =>
    (event: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
      // const statusInCheck = checked[id];
      const statusInDefault = changedStatusIds[id];
      const isChanged = value !== statusInDefault;
      setChecked((prev) => ({ ...prev, [id]: value }));

      if (isChanged) {
        setIds((prev) => [...prev, id]);
      } else {
        ids?.filter((x) => x === id);
      }
    };

  const handleSetSearchText = (value: string) => () => {
    if (value) {
      setSearchText(value);
    }
  };

  const debouncedChangeHandler = React.useMemo(
    () => throttle(handleSetSearchText(text), 500),
    [text]
  );

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setText(value);
    debouncedChangeHandler();
  };

  return (
    <StyledSection>
      <div className="wrapper">
        <div className="search">
          <CustomSearch
            placeholder="Search bank name"
            value={text}
            onChange={handleChangeText}
          />
        </div>

        {data &&
          data?.map((row, index) => (
            <MuiTypography key={index} variant="body2" className="item">
              <span>{row?.name}</span>{" "}
              <CustomSwitch
                color="primary"
                defaultChecked={row?.isActive}
                value={row?.isActive}
                checked={checked[row.id]}
                onChange={handleCheck(row.id)}
              />
            </MuiTypography>
          ))}
        <MuiTypography
          variant="body2"
          className="item"
          style={{ height: "40px", marginTop: "40px", display: "block" }}>
          <span></span>
        </MuiTypography>

        {!data && isLoading && <LineListSkeleton rows={7} />}

        {data && data?.length === 0 && !isLoading && (
          <NoData title="No banks added" message=""></NoData>
        )}
      </div>
      <MuiButton
        type="button"
        onClick={handleUpdateProductStatus}
        color="primary"
        variant="contained"
        startIcon={isSubmitting ? <MuiCircularProgress size={18} /> : null}
        disabled={isSubmitting}
        className="primary-btn btn">
        Save
      </MuiButton>

      {/* <div className="action-group"></div> */}
    </StyledSection>
  );
};

const StyledSection = styled.section`
  width: calc(100vw - 80px);
  /* height: calc(100vw - 80px); */
  max-height: 600px;
  max-width: 500px;
  background-color: #fff;
  padding: 10px 0px 10px 0px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  .search {
    margin-bottom: 20px;
    width: 100%;
  }
  & .delete-icon {
    width: 130px;
    height: 130px;
  }

  & .heading {
    font-weight: 700;
    font-size: 18px;
  }

  & .product-name {
    color: #64748b;
    font-size: 12px;
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
    width: 100%;
    display: flex;
    gap: 6px;
    align-items: center;
    flex-direction: column;
    min-height: 300px;
    position: relative;
    padding-bottom: 100px;
  }

  & .item {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    background-color: #fbfbfb;
    border-radius: 5px;
  }

  & .branch {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;

    & .branch-name {
      background-color: #e8f1f8;
      padding: 15px 20px;
      border-radius: 30px;
      flex: 1;
      max-width: 350px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    & .img-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 51px;
      height: 51px;
      background-color: #f05b2a;
      border-radius: 50%;

      & svg {
        width: 30px;
        height: 30px;
        path {
          stroke: #fff;
        }
      }
    }
  }

  & .body {
    max-width: 350px;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
  }

  & .subtitle {
    color: #aeaeae;
  }

  & .flex-wrapper {
    display: flex;
    gap: 30px;
    align-items: self-end;
  }

  & .btn {
    width: 100%;
    max-width: 500px;
    /* margin-top: 45px; */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    margin-bottom: 10px;
    position: absolute;
    bottom: 0;
  }

  & .MuiInputBase-input {
    width: 100%;
    max-width: 100% !important;
  }
`;
