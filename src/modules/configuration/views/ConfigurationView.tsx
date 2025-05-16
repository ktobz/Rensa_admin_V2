import { styled } from "@/lib/index";
import { AutomatedMessagesView } from "../components/AutomatedMessagesView";
import { CategoryTable } from "../components/CategoryTable";
import { ConditionTable } from "../components/ConditionTable";
import { OperationSettingsView } from "../components/OperationSettingsView";
import { PaymentProviderView } from "../components/PaymentProviderView";

export function ConfigurationView() {
  return (
    <PageContent>
      <div className="sections-layout">
        <div className="grid-column left-column">
          <OperationSettingsView />
        </div>

        <div className="grid-column right-column">
          <section className="auto-message">
          <AutomatedMessagesView />

          </section>
          <PaymentProviderView />
        </div>
        {/* <div className="payment">
          <PaymentProviderView />
        </div> */}
        <div className="third">
          <CategoryTable />
        </div>
        <div className="fourth">
          <ConditionTable />
        </div>
      </div>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;

  & .sections-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;

  
    .auto-message {
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

  @media screen and (max-width: 870px) {
    & .sections-layout {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    & .right-column {
      // height: auto;
      // min-height: 850px;
    }
  }
`;
