import { styled } from "@/lib/index";
import { PayoutTableView } from "../components/Payouts";

export function PayoutView() {
  return (
    <PageContent>
      <PayoutTableView />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
