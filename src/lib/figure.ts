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

export interface Curve {
  command: "C";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
}

export type InputCommand =
  | {
      command: "M";
      x: number;
      y: number;
    }
  | Curve;

export type OutputCommand =
  | InputCommand
  | {
      command: "L";
      x: number;
      y: number;
    }
  | { command: "Z" };

type Line =
  | {
      // y = ax + b
      type: "normal";
      a: number;
      b: number;
    }
  | {
      // y 軸に平行
      type: "vertical";
      x: number;
    };

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

// 補間する
export const interpolate = (
  commands0: InputCommand[],
  commands1: InputCommand[],
  ratio: number
) => {
  const newCommand: InputCommand[] = [];
  if (commands0.length !== commands1.length) {
    throw new Error("Length is different.");
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

interface Point {
  x: number;
  y: number;
}

// 点を移動させる
const movePoint = (point: Point, delta: Point): Point => ({
  x: point.x + delta.x,
  y: point.y + delta.y,
});

// 2 点を通る直線の式を求める
const getLine = (p0: Point, p1: Point): Line => {
  const dx = p1.x - p0.x;
  if (dx === 0) {
    return { type: "vertical", x: p0.x };
  }
  const a = (p1.y - p0.y) / dx;
  const b = -a * p0.x + p0.y;
  return { type: "normal", a, b };
};

// 2 直線の交点を求める
const getIntersection = (line0: Line, line1: Line): Point | null => {
  // 両方の直線が垂直な場合、交点は存在しない
  if (line0.type === "vertical" && line1.type === "vertical") {
    return null;
  }

  // 一方の直線が垂直である場合
  if (line0.type === "vertical" && line1.type === "normal") {
    return { x: line0.x, y: line1.a * line0.x + line1.b };
  }
  if (line0.type === "normal" && line1.type === "vertical") {
    return { x: line1.x, y: line0.a * line1.x + line0.b };
  }

  if (line0.type === "normal" && line1.type === "normal") {
    // 両方の直線が水平な場合、交点は存在しない
    if (line0.a === 0 && line1.a === 0) {
      return null;
    }

    // 一方の直線が水平である場合
    if (line0.a === Infinity) {
      return { x: line1.b - line0.b / line0.a, y: line1.b };
    }
    if (line1.a === Infinity) {
      return { x: line0.b - line1.b / line1.a, y: line0.b };
    }

    const x = (line1.b - line0.b) / (line0.a - line1.a);
    return { x, y: line0.a * x + line0.b };
  }
  return null;
};

// Arc の t における法線を求める
const getArcNormal = (arc: Arc, t: number): Point => {
  const differentiate = (p0: number, p1: number, p2: number, p3: number) =>
    -3 * (1 - t) ** 2 * p0 +
    (9 * t ** 2 - 12 * t + 3) * p1 +
    (-9 * t ** 2 + 6 * t) * p2 +
    3 * t ** 2 * p3;

  const dx = differentiate(arc.p0.x, arc.p1.x, arc.p2.x, arc.p3.x);
  const dy = differentiate(arc.p0.y, arc.p1.y, arc.p2.y, arc.p3.y);
  return { x: dy, y: dx };
};

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

// Arc を distance 移動させた平行曲線を求める
const getParallelArc = (arc: Arc, distance: number): Arc => {
  // アンカーポイントの移動量を求める
  const n0 = getArcNormal(arc, 0);
  const n1 = getArcNormal(arc, 1);
  const getDelta = (n: Point) => ({
    x: Math.cos(Math.atan2(n.y, n.x)) * distance,
    y: Math.sin(Math.atan2(n.y, n.x)) * -distance,
  });
  const fromDelta = getDelta(n0);
  const toDelta = getDelta(n1);

  // 移動前のハンドルを法線方向に d 移動させる
  const handleLine = getLine(arc.p1, arc.p2);
  if (handleLine.type === "vertical") {
    handleLine.x += distance;
  }
  if (handleLine.type === "normal") {
    const y = arc.p1.y > arc.p2.y ? -1 : 1;
    const tan = Math.atan2((1 / handleLine.a) * y, 1);
    handleLine.b += distance / -Math.sin(tan);
  }

  // 交点を求めて新たなハンドルとする
  const p0 = movePoint(arc.p0, fromDelta);
  const p3 = movePoint(arc.p3, toDelta);
  const l1 = getLine(p0, movePoint(arc.p1, fromDelta));
  const l2 = getLine(p3, movePoint(arc.p2, toDelta));
  return {
    p0,
    p1: getIntersection(handleLine, l1)!,
    p2: getIntersection(handleLine, l2)!,
    p3,
  };
};

export const commandsToArcs = (commands: InputCommand[]) => {
  // Command から Arc へ変換する
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

export const strokeToPath = (commands: InputCommand[], width: number) => {
  const arcs = commandsToArcs(commands);
  const splitedArcs = arcs.flatMap((arc) => splitArc(arc, 0.5));
  const outsideArcs: Arc[] = [];
  const insideArcs: Arc[] = [];
  for (const arc of splitedArcs) {
    outsideArcs.push(getParallelArc(arc, width / 2));
    insideArcs.push(getParallelArc(arc, -width / 2));
  }

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
