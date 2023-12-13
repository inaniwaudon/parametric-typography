import styled from "@emotion/styled";

import { commandsToPathD } from "../lib/figure";
import { Typo, typoToCommands } from "../lib/typo";

const Svg = styled.svg`
  width: 100%;
`;

interface DrawerProps {
  char: "あ" | "か" | "ん" | "ど" | "う";
  typo: Typo;
  color: string;
}

const Drawer = ({ char, typo, color }: DrawerProps) => {
  const dArray = commandsToPathD(typoToCommands(char, typo));

  return (
    <Svg viewBox="-0.1 -0.1 1.2 1.3">
      {dArray.map((d, i) => (
        <path d={d} fill={color} key={i} />
      ))}
    </Svg>
  );
};

export default Drawer;
