import { styled } from "@/lib/index";
import { RidersTableView } from "../components/RidersTableView";

export function RidersView() {
  return (
    <PageContent>
      <RidersTableView />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
