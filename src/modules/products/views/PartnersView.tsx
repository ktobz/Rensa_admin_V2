import * as React from "react";
import { styled } from "@/lib/index";

import { PartnerTableView } from "../components/PartnerTableVew";

export function PartnersView() {
  return (
    <PageContent>
      <PartnerTableView />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
