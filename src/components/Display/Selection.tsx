import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useMemo } from "react";

import { FirebaseTypo } from "../../Display";
import SelectionItem from "./SelectionItem";

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

const COLUMN_COUNT = 3;
const ROW_COUNT = 8;

interface SelectionProps {
  typos: Record<string, FirebaseTypo>;
  selectedTypo: string | null;
  setSelectedTypo: (value: string | null) => void;
}

const Selection = ({
  typos,
  selectedTypo,
  setSelectedTypo,
}: SelectionProps) => {
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

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!(e.target as any).closest("#selection")) {
        setSelectedTypo(null);
      }
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, [setSelectedTypo]);

  return (
    <Wrapper id="selection">
      {typoLines.map((line, lineI) => (
        <Line key={lineI}>
          <Content>
            {line.map(([id, typo], itemI) => {
              return (
                <SelectionItem
                  typo={typo}
                  id={id}
                  selectedTypo={selectedTypo}
                  setSelectedTypo={setSelectedTypo}
                  key={id + itemI}
                />
              );
            })}
          </Content>
        </Line>
      ))}
    </Wrapper>
  );
};

export default Selection;
