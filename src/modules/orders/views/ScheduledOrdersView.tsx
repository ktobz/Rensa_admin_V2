import { styled } from "@/lib/index";
import { OrderTable } from "@/modules/orders";
import { useURLQuery } from "@/utils/query";

export function ScheduledOrdersView() {
  const urlQuery = useURLQuery();
  const date = useURLQuery()?.get("date") || "";
  const convertedDate = new Date(date).toDateString();
  return (
    <PageContent>
      <OrderTable
        variant="page"
        page="orders"
        queryKey={`scheduled-query`}
        title={convertedDate}
        showPagination
        viewMode="list"
      />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
