import styled from "@emotion/styled";

import { lineCommands, lineCommands2, intonations } from "../lib/commands";
import { commandsToPathD, interpolate, strokeToPath } from "../lib/figure";

const Svg = styled.svg`
  width: 100%;
`;

interface DrawerProps {
  ratio0: number;
  ratio1: number;
  ratio2: number;
}

const Drawer = ({ ratio0, ratio1, ratio2 }: DrawerProps) => {
  const interpolated = lineCommands.map((commands, i) =>
    interpolate(commands, lineCommands2[i], ratio0)
  );
  const width = 0.1 * Math.max(1.0 - ratio1, 0);
  const offseted = interpolated.map((commands, i) =>
    strokeToPath(commands, width, intonations[i], ratio2)
  );
  const dArray = commandsToPathD(offseted);
  const color = `hsl(${ratio2 * 360}deg, 70%, 40%)`;

  return (
    <Svg viewBox="-0.1 -0.1 1.2 1.3">
      {dArray.map((d, i) => (
        <path d={d} fill={color} key={i} />
      ))}
    </Svg>
  );
};

export default Drawer;
