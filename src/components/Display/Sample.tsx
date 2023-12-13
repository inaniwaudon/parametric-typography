import styled from "@emotion/styled";

import Drawer from "../Drawer";
import { Typo } from "../../lib/typo";

const Wrapper = styled.div`
  line-height: 1.2;
  color: #777;
  font-size: 140px;
  margin-bottom: 24px;
`;

const Line = styled.div`
  display: flex;
`;

const Item = styled.div`
  width: 100px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.6;
  }
`;

interface SampleProps {
  typo: Typo;
  color: string;
}

const Sample = ({ typo, color }: SampleProps) => {
  return (
    <Wrapper>
      <Line>
        <Item>
          <Drawer char="か" typo={typo} color={color} />
        </Item>
        <Item>
          <Drawer char="ん" typo={typo} color={color} />
        </Item>
        <Item>
          <Drawer char="ど" typo={typo} color={color} />
        </Item>
        <Item>
          <Drawer char="う" typo={typo} color={color} />
        </Item>
      </Line>
      きょうえん
    </Wrapper>
  );
};

export default Sample;
