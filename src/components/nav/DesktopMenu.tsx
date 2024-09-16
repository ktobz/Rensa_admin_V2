import { Logo } from "components/logo";
import { styled } from "lib";
import CustomMenu from "./CustomMenu";

export default function DesktopMenu() {
  return (
    <StyledWrapper>
      <div className="logo-section">
        <Logo style={{ width: "100px" }} />
      </div>
      <CustomMenu />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.header`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding: 40px 5px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 0;

  & .logo-section {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    /* justify-content: center; */

    img {
      /* padding-top: 58px; */
    }
  }
`;
