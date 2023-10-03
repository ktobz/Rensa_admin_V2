import { styled } from "@/lib/index";
import { CustomersTable } from "../components/CustomersTable";

export function CustomersView() {
  return (
    <PageContent>
      <CustomersTable />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
