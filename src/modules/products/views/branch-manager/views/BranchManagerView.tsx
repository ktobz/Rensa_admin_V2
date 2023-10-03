import { styled } from "@/lib/index";
import { BranchManagerTable } from "../components/BranchManagerTable";

export function BranchManagerView() {
  return (
    <PageContent>
      <BranchManagerTable />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
