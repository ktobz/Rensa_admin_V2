import { styled } from "@/lib/index";
import { OrderTable } from "@/modules/orders";

import "./calendar.css";

export function OrdersView() {
  return (
    <PageContent>
      <OrderTable
        variant="page"
        page="orders"
        showFilter
        viewMode="grid"
        showMetrics
        showPagination
      />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
