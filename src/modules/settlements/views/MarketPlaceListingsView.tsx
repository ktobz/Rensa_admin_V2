import { styled } from "@/lib/index";
import { SettlementTable } from "../components/SettlementTable";

export function MarketPlaceListingsView() {
  return (
    <PageContent>
      <SettlementTable showPagination showFilter showMoreText={false} />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
