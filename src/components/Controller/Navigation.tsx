import styled from "@emotion/styled";

import { Point3D } from "../../lib/utils";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: end;
  position: absolute;
  right: 16px;
  bottom: 16px;
`;

interface NavigationProps {
  alternativeRatio: Point3D;
  setAlternativeRatio: (ratio: Point3D) => void;
  submit: () => void;
}

const Navigation = ({
  alternativeRatio,
  setAlternativeRatio,
  submit,
}: NavigationProps) => {
  return (
    <Wrapper>
      <div>
        ratio0{" "}
        <input
          type="range"
          min={-0.1}
          max={1.1}
          step={0.02}
          onChange={(e) =>
            setAlternativeRatio({
              ...alternativeRatio,
              x: parseFloat(e.currentTarget.value),
            })
          }
        />
      </div>
      <div>
        ratio1{" "}
        <input
          type="range"
          min={-0.1}
          max={1.1}
          step={0.02}
          onChange={(e) =>
            setAlternativeRatio({
              ...alternativeRatio,
              y: parseFloat(e.currentTarget.value),
            })
          }
        />
      </div>
      <div>
        ratio2{" "}
        <input
          type="range"
          min={-0.1}
          max={1.1}
          step={0.02}
          onChange={(e) =>
            setAlternativeRatio({
              ...alternativeRatio,
              z: parseFloat(e.currentTarget.value),
            })
          }
        />
      </div>
      <div>
        <button onClick={submit}>送信</button>
      </div>
    </Wrapper>
  );
};

export default Navigation;
