import styled from "@emotion/styled";
import { useMemo } from "react";

import { Typo } from "../../lib/typo";
import Drawer from "../Drawer";
import { keyframes } from "@emotion/react";

const Wrapper = styled.div`
  height: 110vh;
  display: flex;
  gap: 36px;
  transform: rotate(10deg);
  position: absolute;
  top: -30px;
  right: 110px;
`;

const Line = styled.div`
  height: 100%;
  margin: 0 -40px;
  padding: 0 40px;
  overflow: hidden;
`;

const marquee = keyframes`
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%);
  }
`;

const Content = styled.div`
  height: 200%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 20px;
  animation: ${marquee} 10s linear infinite;
`;

const Item = styled.div<{ selected: boolean }>`
  width: 64px;
  height: 64px;
  cursor: pointer;
  flex: 0;
  filter: ${({ selected }) => (selected ? "blur(4px)" : "none")};
  transition: transform 0.2s ease, filter 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const COLUMN_COUNT = 3;
const ROW_COUNT = 8;

interface SelectionProps {
  typos: Record<string, Typo>;
  selectedTypo: string | null;
  setSelectedTypo: (value: string) => void;
}

const Selection = ({
  typos,
  selectedTypo,
  setSelectedTypo,
}: SelectionProps) => {
  const baseHue = 260;
  const totalCount = ROW_COUNT * COLUMN_COUNT;

  const typoLines = useMemo(() => {
    const values = Object.entries(typos);
    if (values.length === 0) {
      return [];
    }
    const temp = [...Array(Math.ceil(totalCount / values.length))]
      .flatMap(() => values)
      .slice(0, totalCount);

    // 行ごとに分割する。水平方向が揃わないように行ごとにランダムにずらす
    return [...Array(COLUMN_COUNT)]
      .map((_, i) => temp.slice(ROW_COUNT * i, ROW_COUNT * (i + 1)))
      .map((line) => [...line, ...line])
      .map((line) => {
        const random = Math.floor(Math.random() * ROW_COUNT * 2);
        return [...line.slice(random), ...line.slice(0, random)];
      });
  }, [typos, totalCount]);

  return (
    <Wrapper>
      {typoLines.map((line, lineI) => (
        <Line key={lineI}>
          <Content>
            {line.map(([id, typo], itemI) => {
              const hue = baseHue + (Math.random() - 0.5) * 100;
              const color = `hsl(${hue}deg, 80%, 60%)`;
              return (
                <Item
                  selected={id === selectedTypo}
                  onClick={() => setSelectedTypo(id)}
                  key={itemI}
                >
                  <Drawer char="あ" typo={typo} color={color} />
                </Item>
              );
            })}
          </Content>
        </Line>
      ))}
    </Wrapper>
  );
};

export default Selection;
