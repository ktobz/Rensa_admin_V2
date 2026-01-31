import { styled } from "@/lib/index";
import { PricingTable } from "../components/PricingTable";

export function PricingModelView() {
    return (
        <PageContent>
            <PricingTable />
        </PageContent>
    );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;