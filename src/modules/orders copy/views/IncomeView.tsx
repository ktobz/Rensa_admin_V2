import * as React from "react";
import { MuiButton, MuiTypography, styled } from "@/lib/index";
import PageTitle from "components/text/PageTitle";
import { IncomeTable } from "../components/IncomeTable";

export function IncomeView() {
  return (
    <PageContent>
      <IncomeTable />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
