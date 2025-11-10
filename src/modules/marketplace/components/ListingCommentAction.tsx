import { MuiCircularProgress, MuiIconButton } from "@/lib/mui.lib";
import { IconVisibility, IconVisibilityOff } from "@/lib/mui.lib.icons";
import { cn } from "@/lib/utils";
import { IListingQuestionsAndAnswer } from "@/types/globalTypes";
import { Flag } from "@mui/icons-material";

type IProps={
    isDeleting:boolean;
    handleAction:(id:string|number, shouldDelete:boolean)=> ()=>void;
    handleUnflag:(id:string|number, reason:string)=> ()=>void;
    data:IListingQuestionsAndAnswer;
    isCurrent:boolean;
}

export const ListingCommentAction=({isDeleting,handleAction,isCurrent, data,handleUnflag}:Readonly<IProps>)=>{

    return ( data?.isFlagged ? (
      <section className="flex flex-row gap-2 items-center">
  
        <section  className="bg-[#FFF5F8] w-[24px] h-[24px] rounded-md flex justify-center items-center">
        
        
            <Flag htmlColor="#F53139" fontSize="small" className="!w-[10px] !h-[11px]" />
         
        
      </section>
      <MuiIconButton disabled={isDeleting} onClick={isDeleting ? undefined: handleUnflag(data?.id, data?.flagReason)} color="primary" className={cn("!flex !justify-center !items-center !rounded-md w-[24px] h-[24px]", {
           '!bg-[#E8F1F8]': data?.isDeleted,
           '!bg-[#F0F0F0]':!data?.isDeleted
        })} size="small">
        { (isDeleting && isCurrent) ? <MuiCircularProgress size={18} />:
        data?.isDeleted ? (

            <IconVisibility htmlColor="#137AC9" fontSize='small' className="!w-[10px] !h-[11px]"  />
          ):(
            <IconVisibilityOff htmlColor="#777E90" fontSize='small' className="!w-[10px] !h-[11px]"  />
          )
        }
      </MuiIconButton>
      </section>
    ):( 
        <MuiIconButton disabled={isDeleting} onClick={isDeleting ? undefined: handleAction(data?.id, !data?.isDeleted)} color="primary" className={cn("!flex !justify-center !items-center !rounded-md w-[24px] h-[24px]", {
           '!bg-[#E8F1F8]': data?.isDeleted,
           '!bg-[#F0F0F0]':!data?.isDeleted
        })} size="small">
        { (isDeleting && isCurrent) ? <MuiCircularProgress size={18} />:
        data?.isDeleted ? (

            <IconVisibility htmlColor="#137AC9" fontSize='small' className="!w-[10px] !h-[11px]"  />
          ):(
            <IconVisibilityOff htmlColor="#777E90" fontSize='small' className="!w-[10px] !h-[11px]"  />
          )
        }
      </MuiIconButton>
    )

    )
}