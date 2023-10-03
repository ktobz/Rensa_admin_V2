import { styled } from "@/lib/index";
import { NotificationCenterTable } from "../components/NotificationCenterTable";

export function NotificationCenterView() {
  return (
    <PageContent>
      <NotificationCenterTable />
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;
`;
