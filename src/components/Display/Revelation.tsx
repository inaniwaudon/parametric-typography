import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const expansion = keyframes`
  0% {
    stroke-dasharray: 0.3 1;
    stroke-dashoffset: 0.8;
  }
  100% {
    stroke-dasharray: 0 1;
    stroke-dashoffset: 0;
  }
`;

const Line = styled.line`
  stroke: #333;
  stroke-dasharray: 800px;
  stroke-width: 0.04;
  stroke-dasharray: 0 1;
  stroke-dashoffset: 0;
  animation: ${expansion} 0.6s linear;
`;

const Revelation = () => {
  const outerDistance = 1.0;
  return (
    <Svg viewBox="0 0 2 2">
      {[...Array(8)].map((_, i) => {
        const rad = ((2 * Math.PI) / 8) * i;
        return (
          <Line
            x1={1}
            y1={1}
            x2={1 + Math.cos(rad) * outerDistance}
            y2={1 + Math.sin(rad) * outerDistance}
          />
        );
      })}
    </Svg>
  );
};

export default Revelation;
