import * as React from "react";
import { styled } from "@/lib/index";

import { ProductsTable } from "../components/ProductTable";

export function ProductsView() {
  return (
    <PageContent>
      <ProductsTable />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
