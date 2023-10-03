import { MuiTypography, styled } from "@/lib/index";
import { OrderTable } from "@/modules/orders";
import RiderService from "@/services/rider-service";
import { useIds } from "@/utils/hooks";

export function RiderOrders() {
  const { riderId } = useIds();
  return (
    <PageContent>
      <div className="top-section">
        <MuiTypography variant="body2" className="heading">
          Rider Orders
        </MuiTypography>
      </div>
      <OrderTable
        variant="section"
        page="branches"
        apiFunc={RiderService.getOrders}
        id={riderId || ""}
        queryKey="all-riders-orders"
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
