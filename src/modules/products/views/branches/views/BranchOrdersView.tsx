import { MuiTypography, styled } from "@/lib/index";

import { OrderTable } from "@/modules/orders";
import { useNavigate } from "react-router-dom";

export function BranchOrdersView() {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/app/orders");
  };
  return (
    <PageContent>
      <div className="activities">
        <div className="top-section">
          <MuiTypography variant="body2" className="heading">
            Orders
          </MuiTypography>
        </div>

        <OrderTable variant="page" page="branch-order" />
      </div>
    </PageContent>
  );
}

const PageContent = styled.section`
  width: 100%;
  margin: auto;
  position: relative;

  & .activities {
    width: 100%;

    & .top-section {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 10px;

      & .heading {
        font-weight: 600;
        font-size: 18px;
      }

      & .view-all {
        height: fit-content;
        min-height: fit-content;
      }
    }
  }
`;
