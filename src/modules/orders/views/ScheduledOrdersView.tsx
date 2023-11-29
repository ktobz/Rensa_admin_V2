import { styled } from "@/lib/index";
import { OrderTable } from "@/modules/orders";
import OrderService from "@/services/order-service";
import { useURLQuery } from "@/utils/query";

export function ScheduledOrdersView() {
  const urlQuery = useURLQuery();
  const date = useURLQuery()?.get("date") || "";
  const orderDate = new Date(date);
  const convertedDate = orderDate.toDateString();

  return (
    <PageContent>
      <OrderTable
        variant="page"
        page="orders"
        queryKey={`scheduled-query`}
        title={convertedDate}
        showPagination
        apiFunc={OrderService.getByDate({
          day: orderDate.getDate(),
          month: orderDate.getMonth(),
          year: orderDate.getFullYear(),
        })}
        viewMode="list"
        orderDate={date}
      />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
