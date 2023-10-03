import { styled } from "@/lib/index";
import { AutomatedMessagesView } from "../components/AutomatedMessagesView";
// import { FAQSectionView } from "../components/FAQSectionView";
import { OperationSettingsView } from "../components/OperationSettingsView";

export function ConfigurationView() {
  return (
    <PageContent>
      <div className="top-section">
        <div className="grid-column left-column">
          <OperationSettingsView />
        </div>
        <div className="grid-column right-column">
          <AutomatedMessagesView />
        </div>
      </div>
      {/* <div className="faq-section">
    
      </div> */}
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;

  & .top-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;

    & .right-column,
    .section {
      padding: 10px 15px;
      border-radius: 10px;
      border: 1px solid #f4f4f4;
    }
  }

  & .faq-section {
    border: 1px solid #f4f4f4;
    padding: 15px;
    border-radius: 10px;
    width: 100%;
  }
`;
