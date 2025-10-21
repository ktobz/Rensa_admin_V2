import * as React from "react";
import SimpleBar from "simplebar-react";

import { NoData } from "@/components/feedback/NoData";
import { MuiButton, MuiTypography, styled } from "@/lib/index";
import { IconNotificationInfo } from "@/lib/mui.lib.icons";

import { UserDetailCard } from "@/components/card/UserCard";
import { cn } from "@/lib/utils";
import ListingService from "@/services/listing-service";
import { IListingQuestionsAndAnswerResponse } from "@/types/globalTypes";
import { formatDate } from "@/utils/helper-funcs";
import { toast } from "react-toastify";
import { ListingCommentAction } from "./ListingCommentAction";

type IProps = {
  listingComments: IListingQuestionsAndAnswerResponse['result'] | undefined;
  isLoading: boolean;
  isError: boolean;
  handleRefresh:()=>void;
};
const record =[
  {username:'John doe', profilePictureUrl:'', creationTime:new Date(), comment:'Hello testing this',id: 1, isVerified: true}
]
export function QandASection({ isLoading, listingComments, isError, handleRefresh }: IProps) {

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<null|string|number>(null);

  

  const handleHideAndShow=(id:string|number, isDelete:boolean)=>async ()=>{
    setIsDeleting(true);
    setDeleteId(id);
    try {
      const {data,status} = await ListingService.hideAndShowCommentFlag(id);
        if(status){
          toast.success(data?.result?.message||'');
      }
  
        handleRefresh();
      
    } catch (error:any) {
      toast.error(error?.response?.data?.message||'');
      
    }

    setIsDeleting(false);
    setDeleteId(null);

  }



  return (
    <StyledPage>
      
          <SimpleBar className="list-wrapper flex flex-col !gap-3">
            {
              listingComments &&
              listingComments?.map((row) => (
                <div key={row?.id} className=" flex-col border-b border-b-[#E8E8E8] mb-5 pb-2">

                  <UserDetailCard
                    variant="bidder"
                    data={{
                      fullName: `${row?.user?.firstName || "-"} ${row?.user?.lastName || "-"}`,
                      date: formatDate(
                        row?.createdAt || "",
                        "do LLL yyyy, HH:MM:ss"
                      ),
                      image: row?.user?.profilePictureUrl || "",
                      verStatus: row?.user?.isVerified || false,
                    }}
                  />
                  <section className="flex! flex-row! justify-between gap-3 w-full mt-3 ">
                    <section className="flex flex-col gap-0">
                    <MuiTypography variant="body1" className="flex-1 !m-0 pb-0  !text-[14px]" style={{color: row?.isFlagged ? '#B1B5C3': ''}}>
                     {row?.comment||'-'}
                    </MuiTypography>
                    {
                      row?.flagReason && (

                    <MuiTypography variant="body1" className=" !text-[#F53139] !text-[12px]">
                     {row?.flagReason||'-'}
                    </MuiTypography>
                      )
                    }
                    </section>
                    <section>
                    <ListingCommentAction handleAction={handleHideAndShow} isDeleting={isDeleting} data={row}   isCurrent={row?.id===deleteId}   />
                    </section>
                  </section>
                  <MuiButton size="small" variant="text" className="!p-0 !h-fit !w-fit !min-w-fit !mt-2">Reply</MuiButton>

                  <section className=" justify-between items-center pl-3 mt-2 ml-3 border-l border-l-[#E8E8E8] flex flex-col gap-4">
                 {
                  row?.replies?.map((x)=>(
                    <section className="w-full">
                      <section className="flex">
                      <section className="flex flex-row gap-1 items-center flex-nowrap ">
                    <MuiTypography className="!text-[12px] !text-[#FB651E]" variant="subtitle2">
                    Answered by {x?.isAdmin ? 'Admin':'User'}
            </MuiTypography>

                      <div className="w-[5px] h-[5px] rounded-full bg-[#B1B5C3]" />
                      <MuiTypography className={cn("!text-[12px] ", {
                        '!text-[#B1B5C3]':x?.isFlagged
                      })} variant="subtitle2">
                     {formatDate(
                        x?.createdAt || "",
                        "do LLL yyyy, HH:MM:ss"
                      )}
            </MuiTypography>
                    </section>
                      </section>
                      <section className="flex justify-between items-center !w-full flex-nowrap">
                      <section className="flex flex-col gap-0">
                      <MuiTypography variant="body1" className="flex-1 !m-0 pb-0" style={{color: x?.isFlagged ? '#B1B5C3': ''}}>
                     {x?.comment||'-'}
                    </MuiTypography>
                    {
                      x?.flagReason && (

                    <MuiTypography variant="body1" className=" !text-[#F53139] !text-[12px]">
                     {x?.flagReason||'-'}
                    </MuiTypography>
                      )
                    }
                        </section>

   <ListingCommentAction handleAction={handleHideAndShow} isDeleting={isDeleting} data={x} isCurrent={x?.id===deleteId}  />
                  
                      </section>

                   

                    </section>
                  ))
                 }
                  </section>
                </div>
              ))}

            {!isLoading && listingComments && listingComments?.length === 0 && !isError && (
              <div className="no-data-cell">
                <NoData
                  title="No comments yet"
                  icon={<IconNotificationInfo className="icon" />}
                  message="Comments on this listing will show here"></NoData>
              </div>
            )}
          </SimpleBar>
       

      {/* {isError && !data && (
        <div className="no-data-cell">
          <NoData
            title="An Error Occurred"
            message="Sorry, we couldn't fetch bids. Try again later or contact Rensa support."
            icon={<IconNotificationInfo className="icon" />}
          />
        </div>
      )} */}

      {/* {!data && isLoading && (
                <CustomTableSkeleton columns={7} rows={10} />
              )} */}
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;



  & .action-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  & .tabs {
    /* width: 50%; */
    flex: 1;
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;

    & .custom-tab {
      flex: 1;
      width: 100%;
    }

    & .action-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      justify-content: end;
    }
  }

  & .rows-wrapper {
    padding: 10px;

    & .heading {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: center;
      margin-bottom: 10px;

      & .section-heading {
        color: #64748b;
        font-size: 14px;
        font-weight: 600;
      }

      & .total {
        color: #fb651e;
        font-size: 14px;
      }

      & .totals {
        display: flex;
        justify-content: end;
        gap: 10px;
        align-items: center;
        & span {
          color: #f4f4f4;
        }
      }
    }
  }

  & .notif-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: center;
    border-bottom: 1px solid #f4f4f4;
    border-top: 1px solid #f4f4f4;
    padding: 5px 0;

    & .bid-value {
      display: flex;
      gap: 0px;
      align-items: end;
      flex-direction: column;

      & .amount {
        font-weight: 500;
      }
    }
  }

  & .list-wrapper {
    height: 320px;
    padding-right: 20px;
    width: calc(100% + 20px);
  }
`;
