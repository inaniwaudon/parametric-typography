import styled from "@emotion/styled";

import { commandsToPathD } from "../lib/figure";
import { Char, Typo, typoToCommands } from "../lib/typo";
import { useMemo } from "react";

const Svg = styled.svg`
  height: 100%;
  flex-grow: 1;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
`;

interface DrawerProps {
  char: Char;
  typo: Typo;
  color: string;
}

const Drawer = ({ char, typo, color }: DrawerProps) => {
  const dArray = useMemo(
    () => commandsToPathD(typoToCommands(char, typo)),
    [char, typo]
  );

  return (
    <Svg viewBox="-0.1 -0.1 1.2 1.3">
      {dArray.map((d, i) => (
        <path d={d} fill={color} key={i} />
      ))}
    </Svg>
  );
};

export default Drawer;
