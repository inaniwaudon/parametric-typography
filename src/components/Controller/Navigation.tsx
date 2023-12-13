import styled from "@emotion/styled";

import { Point3D } from "../../lib/utils";
import { keyColor } from "../../const/color";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: end;
  position: absolute;
  right: 24px;
  bottom: 24px;
`;

const InputRange = styled.input`
  width: 100%;
  outline: none;
  background: transparent;
  cursor: pointer;
  appearance: none;

  &::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 8px;
    background: #dddddd;
  }

  &::-moz-range-track {
    height: 8px;
    border-radius: 8px;
    background: #dddddd;
  }

  &::-webkit-slider-thumb {
    width: 16px;
    height: 16px;
    margin-top: -3px; /* 位置の調整が必要 */
    border-radius: 50%;
    background: ${keyColor};
    appearance: none;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 50%;
    background: ${keyColor};
  }
`;

const Submit = styled.button`
  color: ${keyColor};
  margin-top: 8px;
  padding: 4px 16px;
  border: solid 1px ${keyColor};
  border-radius: 4px;
  background: none;

  &:hover {
    color: #fff;
    background: ${keyColor};
  }
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
        <InputRange
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
        <InputRange
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
        <InputRange
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
        <Submit onClick={submit}>Submit</Submit>
      </div>
    </Wrapper>
  );
};

export default Navigation;
