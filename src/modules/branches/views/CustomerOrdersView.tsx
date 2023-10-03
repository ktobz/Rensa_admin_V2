import { MuiTypography, styled } from "@/lib/index";

import { OrderTable } from "@/modules/orders";
import CustomerService from "@/services/customer-service";
import { useIds } from "@/utils/hooks";

export function CustomerOrdersView() {
  const { customerId } = useIds();
  console.log(customerId);
  return (
    <PageContent>
      <div className="top-section">
        <MuiTypography variant="body2" className="heading">
          Customer Orders
        </MuiTypography>
      </div>

      <OrderTable
        variant="page"
        page="branch-order"
        queryKey={`customer-orders-${customerId}`}
        apiFunc={CustomerService.getCustomerOrders}
        id={customerId}
      />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;

  & .top-section {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 10px;

    & .heading {
      font-weight: 600;
      font-size: 18px;
    }
  }
`;
