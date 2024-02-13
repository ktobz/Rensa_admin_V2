import * as React from "react";
import { styled } from "lib";
import { Logo } from "components/logo";
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

  & .logo-section {
    width: 100%;
<<<<<<< HEAD
    height: 100px;
    display: flex;
    align-items: center;
=======
    height: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 40px;
>>>>>>> 670f71a8fd81ffb38354ff6197bfd8bbc66853e3
    /* justify-content: center; */

    img {
      /* padding-top: 58px; */
    }
  }
`;
