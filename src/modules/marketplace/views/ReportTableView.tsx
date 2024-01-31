import { styled } from "@/lib/index";
import { ReportTable } from "../components/ReportTable";

export function ReportedListingPageView() {
  return (
    <PageContent>
      <ReportTable showFilter showPagination />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
