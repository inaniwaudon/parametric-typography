import styled from "@emotion/styled";

import { lineCommands, lineCommands2 } from "./commands";
import { commandsToPathD, interpolate, strokeToPath } from "./lib/figure";

const Svg = styled.svg`
  width: 60%;
`;

interface DrawerProps {
  ratio0: number;
  ratio1: number;
  ratio2: number;
}

const Drawer = ({ ratio0, ratio1, ratio2 }: DrawerProps) => {
  /*const interpolated = lineCommands.map((commands, i) =>
    interpolate(commands, lineCommands2[i], ratio0)
  );*/
  // const dArray = commandsToPathD(interpolated);

  const a = lineCommands.map((commands) => strokeToPath(commands, 0.1));
  const aarray = commandsToPathD(a);
  const barray = commandsToPathD(lineCommands);

  const color = `hsl(${ratio2 * 360}deg, 70%, 40%)`;

  return (
    <Svg viewBox="-0.1 -0.1 1.2 1.2">
      {aarray.map((d, i) => (
        <path
          d={d}
          stroke={color}
          fill="none"
          strokeWidth={0.01}
          //strokeWidth={0.08 * Math.max(1.0 - ratio1, 0)}
          key={i}
        />
      ))}
      {barray.map((d, i) => (
        <path
          d={d}
          stroke={color}
          fill="none"
          strokeWidth={0.01}
          //strokeWidth={0.08 * Math.max(1.0 - ratio1, 0)}
          key={i}
        />
      ))}
    </Svg>
  );
};

export default Drawer;
