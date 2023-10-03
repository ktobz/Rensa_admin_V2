import { styled } from "@/lib/index";
import { OrderTable } from "@/modules/orders";

export function OrdersView() {
  return (
    <PageContent>
      <OrderTable variant="page" page="orders" />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
