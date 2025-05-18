import { useQuery, useQueryClient } from "react-query";

import { MuiCircularProgress, MuiRadio, MuiTypography, styled } from "@/lib/index";
import {
  IconDownload
} from "@/lib/mui.lib.icons";

import useCachedDataStore from "@/config/store-config/lookup";
import ConfigService from "@/services/config-service";
import { getIdName } from "@/utils/helper-funcs";
import { useState } from "react";

type Provider = {bankProvider:number;id:number;isActive:boolean};
type PaymentAndCollection = {
  collection:Provider[];
  payment:Provider[];
}


export function PaymentProviderView() {
  const queryClient = useQueryClient();
  const {lookup:{bankProvider}} = useCachedDataStore((state)=>state.cache);

  const [isSubmitting,setIsSubmitting] =useState(false);


  const { data, isLoading } = useQuery(
    ["payment-provider"],
    () =>
      ConfigService.getBankProviderSettings().then((res) => {
        const data = res.data?.result;
      
        
        let resolvedData =  data?.reduce((acc,curr)=>{
        
          if(curr?.transactionType===1){
            acc.payment.push(curr);

          }else{
           acc.collection.push(curr);

          }


           return acc;
        },{collection:[],payment:[]} as PaymentAndCollection);

        return resolvedData
      }),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );


  const handleRefreshService = () => {
    queryClient.invalidateQueries(["payment-provider"]);
  };

  const handleRefreshDelivery = () => {
    queryClient.invalidateQueries(["delivery-fee"]);
  };
  const handleRefreshPayout = () => {
    queryClient.invalidateQueries(["payout-setting"]);
    queryClient.invalidateQueries(["offer-setting"]);
  };

  const [state, setState] = useState(()=>{
 return {
  payment: 1,
  collection: 1
 }
  });

  const [variant, setVariant] = useState<string>('');

  const handleChange=(type:'payment'|'collection', value:number)=>async()=>{
    setState((prev)=> ({...prev, [type]: value}));
    setVariant(type);

    setIsSubmitting(true);
   const {data} = await ConfigService.setBankProviderSettings({bankProvider:value,bankProviderTransactionType: type==='collection'? 2: 1});
   setIsSubmitting(false);


   handleRefreshService();
  }

  return (
    <StyledPage>
      <div className="section">
        <div className="tab-section">
          <div className="top-section">
            <MuiTypography variant="body2" className="heading">
            Collection & Payments Switch
            </MuiTypography>
          </div>
        </div>

        <div className="settings-group">
          <IconDownload className="icon" style={{transform:'rotateZ(180deg)'}} />
          <div className="rows ">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Payout
              </MuiTypography>
             
            </div>
            {
              data?.collection?.map((option)=>(
                <div className="data-row border !h-[62px]" key={option?.id}>
              <MuiTypography variant="body1" className="label">
              {getIdName(option?.bankProvider,bankProvider)}
              </MuiTypography>
              {
                isSubmitting && state.collection===option?.bankProvider && variant==='collection' ? (
                    <MuiCircularProgress style={{margin:10}}  size={24} />
                ):(

                  <MuiRadio
                    checked={ option?.isActive}
                    onChange={handleChange('collection', option?.bankProvider)}
                    value="a"
                    name="radio-buttons"
                    inputProps={{ 'aria-label': getIdName(option?.bankProvider,bankProvider) }}
                  />
                )
              }
              
            </div>
              ))
            }
      
           
          </div>
        </div>

        <div className="settings-group">
          <IconDownload className="icon" />
          <div className="rows ">
            <div className="heading">
              <MuiTypography variant="h3" className="group-heading">
                Collection
              </MuiTypography>
            </div>
            {
              data?.payment?.map((option)=>(
                <div className="data-row border !h-[62px]" key={option?.id}>
              <MuiTypography variant="body1" className="label">
              {getIdName(option?.bankProvider,bankProvider)}
              </MuiTypography>
              {
                isSubmitting && state.payment===option?.bankProvider  && variant==='payment' ? (
                    <MuiCircularProgress style={{margin:10}} size={24} />
                ):(
              <MuiRadio
                checked={ option?.isActive}
                onChange={handleChange('payment', option?.bankProvider)}
                value="a"
                name="radio-buttons"
                inputProps={{ 'aria-label': getIdName(option?.bankProvider,bankProvider) }}
              />)}
              
            </div>
              ))
            }
          </div>
          
        </div>
      </div>

     
      
    </StyledPage>
  );
}

const StyledPage = styled.section`
  width: 100%;
  padding: 0 10px;
  display: flex;
  gap: 20px;
  flex-direction: column;

  & .visible-btn {
    background-color: #e8f1f8;
    border-radius: 10px;
    color: #1e75bb;
    padding: 12px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  & .action-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  & .top-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    & .heading {
      font-weight: 600;
      color: #000;
      font-size: 20px;
      font-family: "Helvetica";
    }
  }

  & .tabs {
    flex: 1;
  }

  & .tab-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 25px 0;
    flex-wrap: wrap;
    gap: 20px;

    & .action-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      justify-content: end;
    }
  }

  & .btn {
    height: 36px;
    font-size: 12px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  & .action-btn {
    background-color: #e8f1f8;
    border-radius: 10px;
    padding: 12px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  & .edit-btn {
    background: #ffc5021a;
    color: #d78950;

    svg {
      color: #d78950;
    }
  }

  & .rows-wrapper {
    padding: 10px;
  }

  & .rows {
    flex: 1;
  }
  & .settings-group {
    display: flex;
    gap: 20px;
    align-items: start;
    width: 100%;
    margin-bottom: 20px;

    & .icon {
      width: 30px;
      height: 30px;
    }

    & .heading {
      width: 100%;
      display: flex;
      gap: 20px;
      align-items: center;
      justify-content: space-between;

      & .group-heading {
        color: #000;
        font-weight: 500;
        font-size: 15px;
      }
    }
  }

  & .data-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: center;
    padding: 10px 0;
    width: 100%;

    & .label {
      color: #64748b;
    }

    & .value {
      color: #05a357;
      background: #9bdf461a;
      padding: 5px 10px;
      border-radius: 30px;
      font-weight: 600;
    }

    & .price-group {
      display: flex;
      align-items: center;
      gap: 16px;
      justify-items: flex-end;
    }
  }

  & .visible-btn {
    background-color: #e8f1f8;
    border-radius: 10px;
    color: #1e75bb;
    padding: 12px;

    svg {
      width: 15px;
      height: 15px;
    }
  }

  & .border {
    border-bottom: 1px solid #eeeeee;
  }
`;
