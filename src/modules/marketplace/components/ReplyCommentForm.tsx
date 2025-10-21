import * as React from "react";

import AppInput from "@/components/input";
import { MuiButton, MuiCircularProgress, MuiTypography, styled } from "@/lib/index";


import { UserDetailCard } from "@/components/card/UserCard";
import ListingService from "@/services/listing-service";
import { IListingQuestionsAndAnswer } from "@/types/globalTypes";
import { formatDate } from "@/utils/helper-funcs";
import { toast } from "react-toastify";



type IViewProps = {
  data: IListingQuestionsAndAnswer|null;
  refreshQuery?: () => void;
  handleClose: () => void;
  catalogueId:string;
};

export const ReplyCommentForm = ({
  data,
  handleClose,
  refreshQuery,
  catalogueId
}: IViewProps) => {

  const [comment,setComment]=React.useState('');

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const {data:responseData, status} = await ListingService.replyListingComment(catalogueId, {
        comment,
        parentCommentId: data?.id||''
      });
        if(status){
          toast.success(responseData?.result?.message||'');
      }
  
      refreshQuery?.();
      handleClose();
      
    } catch (error:any) {
      toast.error(error?.response?.data?.message||'');
      
    }

    setIsSubmitting(false);

  };

const handleChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
  const {value} = e.target;
  setComment(value)
}


  return (
      <StyledForm >
        <div className="wrapper">
    
  {
    data && (

<section className="bg-[#FFF9F6] p-4 rounded-md">
<UserDetailCard
                    variant="bidder"
                    data={{
                      fullName: `${data?.user?.userName || "-"} `,
                      // fullName: `${data?.user?.firstName || "-"} ${data?.user?.lastName || "-"}`,
                      date: formatDate(
                        data?.createdAt || "",
                        "do LLL yyyy, HH:MM:ss"
                      ),
                      image: data?.user?.profilePictureUrl || "",
                      verStatus: data?.user?.isVerified || false,
                    }}
                  />
          
                    <MuiTypography variant="body1" className="flex-1  !mt-3  !text-[14px]">
                     {data?.comment||'-'}
                    </MuiTypography>
</section>
    )
  }
    

          <AppInput
            id="message"
            name="message"
            label="Message"
            placeholder="Enter message here"
            type="text"
            value={comment}
            onChange={handleChange}
            // helperText={errors.releaseNotes}
            // error={!!errors.releaseNotes}
            required
            rows={2}
            multiline
            // maxLength={80}

          />



          <div className="btn-group">
      
            <MuiButton
              type="button"
              variant="contained"
              disabled={isSubmitting}
              onClick={handleSubmit}
              color="primary"
              startIcon={
                isSubmitting ? <MuiCircularProgress size={16} /> : null
              }
              className="btn">
              Send
            </MuiButton>
          </div>
        </div>
      </StyledForm>
  );
};

const StyledForm = styled.form`
  width: 100%;
  background-color: #fff;
  padding: 10px 0px 0px 0px;
  border-radius: 20px;
  max-width: 450px;
  width:calc(100vw - 80px);

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

