import { styled } from "@/lib/index";
import { TransactionTable } from "../components/TransactionTable";

export function TransactionsView() {
  return (
    <PageContent>
      <TransactionTable />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
