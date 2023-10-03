import { styled } from "@/lib/index";
import { TransactionTable } from "@/modules/branches copy/components/TransactionTable";
import { useIds } from "@/utils/hooks";

export function CustomerTransactionsView() {
  const { customerId } = useIds();

  return (
    <PageContent>
      <TransactionTable title="Recent transactions" customerId={customerId} />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
