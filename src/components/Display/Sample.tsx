import styled from "@emotion/styled";

import Drawer from "../Drawer";
import { Typo } from "../../lib/typo";

const Wrapper = styled.div`
  opacity: 0.7;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Line = styled.div`
  display: flex;
`;

const Item = styled.div`
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.6;
  }
`;

const Item0 = styled(Item)`
  width: 100px;
  height: 120px;

  @media (600px <= width < 800px) {
    width: 80px;
    height: ${80 * 1.2}px;
  }
  @media (width < 600px) {
    width: 50px;
    height: ${50 * 1.2}px;
  }
`;

const Item1 = styled(Item)`
  width: 140px;
  height: ${140 * 1.2}px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.6;
  }

  @media (600px <= width < 800px) {
    width: 120px;
    height: ${100 * 1.2}px;
  }
  @media (width < 600px) {
    width: 70px;
    height: ${70 * 1.2}px;
  }
`;

interface SampleProps {
  typo: Typo;
}

const Sample = ({ typo }: SampleProps) => {
  const color = "#333";

  return (
    <Wrapper>
      <Line>
        <Item0>
          <Drawer char="か" typo={typo} color={color} />
        </Item0>
        <Item0>
          <Drawer char="ん" typo={typo} color={color} />
        </Item0>
        <Item0>
          <Drawer char="ど" typo={typo} color={color} />
        </Item0>
        <Item0>
          <Drawer char="う" typo={typo} color={color} />
        </Item0>
      </Line>
      <Line>
        <Item1>
          <Drawer char="か" typo={typo} color={color} />
        </Item1>
        <Item1>
          <Drawer char="ん" typo={typo} color={color} />
        </Item1>
        <Item1>
          <Drawer char="ど" typo={typo} color={color} />
        </Item1>
        <Item1>
          <Drawer char="う" typo={typo} color={color} />
        </Item1>
      </Line>
    </Wrapper>
  );
};

export default Sample;
