import { styled } from "lib/index";

interface Props {
  size?: number;
}
interface PropsStyle {
  size: number;
}

export function Loader(props: Props) {
  const { size = 100 } = props;
  return <StyledLoader size={size || 100} />;
}

const StyledLoader = styled.div<PropsStyle>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border: ${({ size }) => `${size / 10.687}px solid #ffffff`};
  border-bottom-color: #EF5050;
  border-right-color: #EF5050;
  border-left-color: #EF5050;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
