import { styled } from "@/lib/index";
import { OtpLogTable } from "../components/OtpLogTable";

export function OtpLogView() {
  return (
    <PageContent>
      <OtpLogTable />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
