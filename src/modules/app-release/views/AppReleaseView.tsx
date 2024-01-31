import { styled } from "@/lib/index";
import { AppReleaseTable } from "../components/AppReleaseTable";

export function AppReleaseView() {
  return (
    <PageContent>
      <AppReleaseTable />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
