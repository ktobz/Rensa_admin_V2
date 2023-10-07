import { styled } from "@/lib/index";
import { ReportTable } from "../components/ReportTable";

export function MarketPlaceListingsView() {
  return (
    <PageContent>
      <ReportTable showPagination showFilter showMoreText={false} />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
