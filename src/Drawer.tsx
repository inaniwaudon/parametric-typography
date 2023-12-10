import styled from "@emotion/styled";

import { Command, lineCommands, lineCommands2 } from "./commands";

const Svg = styled.svg`
  width: 500px;
`;

interface DrawerProps {
  ratio: number;
}

const Drawer = ({ ratio }: DrawerProps) => {
  const interpolate = (
    commands0: Command[],
    commands1: Command[],
    ratio: number
  ) => {
    const newCommand: Command[] = [];
    if (commands0.length !== commands1.length) {
      throw new Error("Length is different.");
    }
    for (let i = 0; i < commands0.length; i++) {
      if (commands0[i].command != commands1[i].command) {
        throw new Error("Command is different.");
      }

      const c0 = commands0[i];
      const c1 = commands1[i];

      if (c0.command === "m" && c1.command === "m") {
        newCommand.push({
          command: "m",
          x: c0.x * (1 - ratio) + c1.x * ratio,
          y: c0.y * (1 - ratio) + c1.y * ratio,
        });
      }
      if (c0.command === "c" && c1.command === "c") {
        newCommand.push({
          command: "c",
          x: c0.x * (1 - ratio) + c1.x * ratio,
          y: c0.y * (1 - ratio) + c1.y * ratio,
          x0: c0.x0 * (1 - ratio) + c1.x0 * ratio,
          y0: c0.y0 * (1 - ratio) + c1.y0 * ratio,
          x1: c0.x1 * (1 - ratio) + c1.x1 * ratio,
          y1: c0.y1 * (1 - ratio) + c1.y1 * ratio,
        });
      }
    }
    return newCommand;
  };

  const interpolated = lineCommands.map((commands, i) =>
    interpolate(commands, lineCommands2[i], ratio)
  );

  const dArray = interpolated.map((commands) =>
    commands
      .map((c) => {
        switch (c.command) {
          case "c":
            return `${c.command.toUpperCase()} ${c.x0} ${c.y0} ${c.x1} ${
              c.y1
            } ${c.x} ${c.y}`;
          default:
            return `${c.command.toUpperCase()} ${c.x} ${c.y}`;
        }
      })
      .join(" ")
  );

  return (
    <Svg viewBox="0 0 1 1">
      {dArray.map((d, i) => (
        <path d={d} stroke={"#000"} fill="none" strokeWidth={0.01} key={i} />
      ))}
    </Svg>
  );
};

export default Drawer;
