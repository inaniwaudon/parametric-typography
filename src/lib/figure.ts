import { Bezier } from "bezier-js";

interface Point {
  x: number;
  y: number;
}

interface Arc {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
}

export interface CurveTo {
  command: "C";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
}

interface MoveTo {
  command: "M";
  x: number;
  y: number;
}

interface LineTo {
  command: "L";
  x: number;
  y: number;
}

export type InputCommand = MoveTo | CurveTo;

export type OutputCommand = InputCommand | LineTo | { command: "Z" };

// OutputCommand からパスコマンドへ変換する
export const commandsToPathD = (array: OutputCommand[][]) =>
  array.map((commands) =>
    commands
      .map((c) => {
        switch (c.command) {
          case "C":
            return `${c.command.toUpperCase()} ${c.x1} ${c.y1} ${c.x2} ${
              c.y2
            } ${c.x} ${c.y}`;
          case "Z":
            return `${c.command.toUpperCase()}`;
          default:
            return `${c.command.toUpperCase()} ${c.x} ${c.y}`;
        }
      })
      .join(" ")
  );

// 2つのコマンドを補間する
export const interpolate = (
  commands0: InputCommand[],
  commands1: InputCommand[],
  ratio: number
) => {
  const newCommand: InputCommand[] = [];
  if (commands0.length !== commands1.length) {
    throw new Error(
      `Length is different. ${commands0.length} ${commands1.length}`
    );
  }
  for (let i = 0; i < commands0.length; i++) {
    if (commands0[i].command != commands1[i].command) {
      throw new Error("Command is different.");
    }
    const c0 = commands0[i];
    const c1 = commands1[i];

    if (c0.command === "M" && c1.command === "M") {
      newCommand.push({
        command: "M",
        x: c0.x * (1 - ratio) + c1.x * ratio,
        y: c0.y * (1 - ratio) + c1.y * ratio,
      });
    }
    if (c0.command === "C" && c1.command === "C") {
      newCommand.push({
        command: "C",
        x1: c0.x1 * (1 - ratio) + c1.x1 * ratio,
        y1: c0.y1 * (1 - ratio) + c1.y1 * ratio,
        x2: c0.x2 * (1 - ratio) + c1.x2 * ratio,
        y2: c0.y2 * (1 - ratio) + c1.y2 * ratio,
        x: c0.x * (1 - ratio) + c1.x * ratio,
        y: c0.y * (1 - ratio) + c1.y * ratio,
      });
    }
  }
  return newCommand;
};

// Arc を分割する
export const splitArc = (arc: Arc, t: number): [Arc, Arc] => {
  const q0 = {
    x: arc.p0.x + (arc.p1.x - arc.p0.x) * t,
    y: arc.p0.y + (arc.p1.y - arc.p0.y) * t,
  };
  const q1 = {
    x: arc.p1.x + (arc.p2.x - arc.p1.x) * t,
    y: arc.p1.y + (arc.p2.y - arc.p1.y) * t,
  };
  const q2 = {
    x: arc.p2.x + (arc.p3.x - arc.p2.x) * t,
    y: arc.p2.y + (arc.p3.y - arc.p2.y) * t,
  };
  const r0 = {
    x: q0.x + (q1.x - q0.x) * t,
    y: q0.y + (q1.y - q0.y) * t,
  };
  const r1 = {
    x: q1.x + (q2.x - q1.x) * t,
    y: q1.y + (q2.y - q1.y) * t,
  };
  const s = {
    x: r0.x + (r1.x - r0.x) * t,
    y: r0.y + (r1.y - r0.y) * t,
  };
  return [
    { p0: arc.p0, p1: q0, p2: r0, p3: s },
    { p0: s, p1: r1, p2: q2, p3: arc.p3 },
  ];
};

// Command から Arc へ変換する
export const commandsToArcs = (commands: InputCommand[]) => {
  const arcs: Arc[] = [];
  for (let i = 1; i < commands.length; i++) {
    const command = commands[i];
    if (command.command === "C") {
      const before = commands[i - 1];
      arcs.push({
        p0: { x: before.x, y: before.y },
        p1: { x: command.x1, y: command.y1 },
        p2: { x: command.x2, y: command.y2 },
        p3: { x: command.x, y: command.y },
      });
    }
  }
  return arcs;
};

// Arc から Command へ変換する
export const arcsToCommands = (arcs: Arc[]) => {
  const commands: OutputCommand[] = [];
  for (let i = 0; i < arcs.length; i++) {
    const arc = arcs[i];
    if (i === 0) {
      commands.push({
        command: "M",
        ...arc.p0,
      });
    }
    commands.push({
      command: "C",
      x1: arc.p1.x,
      y1: arc.p1.y,
      x2: arc.p2.x,
      y2: arc.p2.y,
      x: arc.p3.x,
      y: arc.p3.y,
    });
  }
  return commands;
};

// 骨格にオフセットを与える
export const strokeToPath = (
  commands: InputCommand[],
  baseWidth: number,
  widths: number[],
  ratio: number
): OutputCommand[] => {
  const arcs = commandsToArcs(commands);
  const outsideArcs: Arc[] = [];
  const insideArcs: Arc[] = [];
  for (let i = 0; i < arcs.length; i++) {
    const arc = arcs[i];
    if (arcs.length + 1 !== widths.length) {
      throw new Error(
        `The length is different. ${arcs.length} ${widths.length}`
      );
    }

    const fromWidth = baseWidth * (widths[i] * ratio + (1 - ratio));
    const toWidth = baseWidth * (widths[i + 1] * ratio + (1 - ratio));
    outsideArcs.push(...offsetArc(arc, fromWidth, toWidth, true));
    insideArcs.push(...offsetArc(arc, fromWidth, toWidth, false));
  }
  console.log(outsideArcs.length, insideArcs.length);

  const newCommands: OutputCommand[] = [];
  for (let i = 0; i < outsideArcs.length; i++) {
    const arc = outsideArcs[i];
    if (i === 0) {
      newCommands.push({
        command: "M",
        ...arc.p0,
      });
    }
    newCommands.push({
      command: "C",
      x1: arc.p1.x,
      y1: arc.p1.y,
      x2: arc.p2.x,
      y2: arc.p2.y,
      x: arc.p3.x,
      y: arc.p3.y,
    });
  }

  for (let i = insideArcs.length - 1; i >= 0; i--) {
    const arc = insideArcs[i];
    if (i === insideArcs.length - 1) {
      newCommands.push({
        command: "L",
        ...arc.p3,
      });
    }
    newCommands.push({
      command: "C",
      x1: arc.p2.x,
      y1: arc.p2.y,
      x2: arc.p1.x,
      y2: arc.p1.y,
      x: arc.p0.x,
      y: arc.p0.y,
    });
  }
  newCommands.push({ command: "Z" });
  return newCommands;
};

// コマンドに縮尺を掛ける
const scaleCommand = (c: OutputCommand, scale: number): OutputCommand => {
  if (c.command === "M" || c.command === "L") {
    return {
      command: c.command,
      x: c.x * scale,
      y: c.y * scale,
    };
  }
  if (c.command === "C") {
    return {
      command: "C",
      x1: c.x1 * scale,
      y1: c.y1 * scale,
      x2: c.x2 * scale,
      y2: c.y2 * scale,
      x: c.x * scale,
      y: c.y * scale,
    };
  } else {
    return c;
  }
};

// コマンドを移動する
const moveCommand = (c: OutputCommand, delta: Point): OutputCommand => {
  if (c.command === "M" || c.command === "L") {
    return {
      command: c.command,
      x: c.x + delta.x,
      y: c.y + delta.y,
    };
  }
  if (c.command === "C") {
    return {
      command: "C",
      x1: c.x1 + delta.x,
      y1: c.y1 + delta.y,
      x2: c.x2 + delta.x,
      y2: c.y2 + delta.y,
      x: c.x + delta.x,
      y: c.y + delta.y,
    };
  } else {
    return c;
  }
};

// コマンドを反転させる
const invertCommand = (c: OutputCommand, vertical: boolean): OutputCommand => {
  const xRatio = vertical ? 1 : -1;
  const yRatio = vertical ? -1 : 1;
  if (c.command === "M" || c.command === "L") {
    return {
      command: c.command,
      x: c.x * xRatio,
      y: c.y * yRatio,
    };
  }
  if (c.command === "C") {
    return {
      command: "C",
      x1: c.x1 * xRatio,
      y1: c.y1 * yRatio,
      x2: c.x2 * xRatio,
      y2: c.y2 * yRatio,
      x: c.x * xRatio,
      y: c.y * yRatio,
    };
  } else {
    return c;
  }
};

export const scaleCommands = (
  outputCommands: OutputCommand[][],
  scale: number
) =>
  outputCommands.map((commands) => commands.map((c) => scaleCommand(c, scale)));

export const moveCommands = (outputCommands: OutputCommand[][], delta: Point) =>
  outputCommands.map((commands) => commands.map((c) => moveCommand(c, delta)));

export const invertCommands = (
  outputCommands: OutputCommand[][],
  vertical: boolean
) =>
  outputCommands.map((commands) =>
    commands.map((c) => invertCommand(c, vertical))
  );

export const quadraticToCubicArc = (p0: Point, p1: Point, p2: Point): Arc => ({
  p0,
  p1: {
    x: (p0.x + 2 * p1.x) / 3,
    y: (p0.y + 2 * p1.y) / 3,
  },
  p2: {
    x: (2 * p1.x + p2.x) / 3,
    y: (2 * p1.y + p2.y) / 3,
  },
  p3: p2,
});

// Arc にオフセットを与える
const offsetArc = (
  arc: Arc,
  fromWidth: number,
  toWidth: number,
  opposite: boolean
) => {
  const bezier = new Bezier(
    arc.p0.x,
    arc.p0.y,
    arc.p1.x,
    arc.p1.y,
    arc.p2.x,
    arc.p2.y,
    arc.p3.x,
    arc.p3.y
  );
  const outline = bezier.outline(
    fromWidth / 2,
    fromWidth / 2,
    toWidth / 2,
    toWidth / 2
  ).curves;
  const arcs: Arc[] = [];

  const getArc = (i: number) => {
    if (outline[i].points.length === 3) {
      return quadraticToCubicArc(
        outline[i].points[0],
        outline[i].points[1],
        outline[i].points[2]
      );
    }
    return {
      p0: outline[i].points[0],
      p1: outline[i].points[1],
      p2: outline[i].points[2],
      p3: outline[i].points[3],
    };
  };

  if (opposite) {
    for (let i = outline.length - 1; i >= outline.length / 2 + 1; i--) {
      const arc = getArc(i);
      arcs.push({
        p0: arc.p3,
        p1: arc.p2,
        p2: arc.p1,
        p3: arc.p0,
      });
    }
  } else {
    for (let i = 1; i < outline.length / 2; i++) {
      arcs.push(getArc(i));
    }
  }
  return arcs;
};
