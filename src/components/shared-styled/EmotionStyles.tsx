import { styled } from "lib";

export const StyledFilter = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* gap: 30px; */

  max-width: 400px;
  max-height: calc(100vh - 40px);
  height: fit-content;
  background-color: #fff;
  border-radius: 6px;
  margin: 0 0 0 auto;
  margin-right: 20px;

  padding: 20px 5px 20px 20px;

  & .scrollbar-container {
    margin-top: 0 !important;
  }
`;
