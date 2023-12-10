import fs from "fs";

type Command =
  | {
      command: "M" | "m" | "L";
      x: number;
      y: number;
    }
  | {
      command: "h";
      x: number;
    }
  | {
      command: "v";
      y: number;
    }
  | {
      command: "c";
      x0: number;
      y0: number;
      x1: number;
      y1: number;
      x: number;
      y: number;
    };

const parseValues = (input: string) => {
  const result: number[] = [];
  let currentNumber = "";

  const addNumber = () => {
    if (currentNumber.length > 0) {
      result.push(parseFloat(currentNumber));
      currentNumber = "";
    }
  };

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === ",") {
      addNumber();
    } else if (currentNumber.includes(".") && char === ".") {
      addNumber();
      currentNumber += ".";
    } else if (char === "-") {
      addNumber();
      currentNumber += "-";
    } else {
      currentNumber += char;
    }
  }
  if (currentNumber.length > 0) {
    addNumber();
  }
  return result;
};

export const convert = (txt: string) => {
  const file = fs.readFileSync(txt, "utf8");
  const lines = file.split("\n");
  const lineCommands: Command[][] = [];

  for (const line of lines) {
    const commands: Command[] = [];

    for (let i = 0; i < line.length; i++) {
      const command = line[i];

      const after = line.substring(i + 1);
      const toResult = after.search(/[MmLchv]/);
      const to = toResult > -1 ? toResult : after.length;
      const value = after.substring(0, to);
      const values = parseValues(value);

      if (command === "M" || command === "m" || command === "L") {
        commands.push({
          command,
          x: values[0],
          y: values[1],
        });
      }
      if (command === "h") {
        commands.push({
          command,
          x: values[0],
        });
      }
      if (command === "v") {
        commands.push({
          command,
          y: values[0],
        });
      }
      if (command === "c") {
        for (let i = 0; i < values.length / 6; i++) {
          commands.push({
            command,
            x0: values[i * 6 + 0],
            y0: values[i * 6 + 1],
            x1: values[i * 6 + 2],
            y1: values[i * 6 + 3],
            x: values[i * 6 + 4],
            y: values[i * 6 + 5],
          });
        }
      }
      i += to;
    }

    if (commands.length > 0) {
      lineCommands.push(commands);
    }
  }

  // 相対位置 → 絶対位置に変換
  for (const commands of lineCommands) {
    let beforeX = 0;
    let beforeY = 0;

    for (const command of commands) {
      const isAbsolute = command.command === "M" || command.command === "L";
      if (isAbsolute) {
        continue;
      }
      if ("x" in command) {
        command.x += beforeX;
      }
      if ("y" in command) {
        command.y += beforeY;
      }
      if ("x0" in command) {
        command.x0 += beforeX;
      }
      if ("y0" in command) {
        command.y0 += beforeY;
      }
      if ("x1" in command) {
        command.x1 += beforeX;
      }
      if ("y1" in command) {
        command.y1 += beforeY;
      }

      if ("x" in command) {
        beforeX = command.x;
      }
      if ("y" in command) {
        beforeY = command.y;
      }
    }
  }

  // 正規化
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = 0;
  let maxY = 0;

  for (const commands of lineCommands) {
    for (const command of commands) {
      if (command.command === "c") {
        minX = Math.min(minX, command.x, command.x0, command.x1);
        minY = Math.min(minY, command.y, command.y0, command.y1);
        maxX = Math.max(maxX, command.x, command.x0, command.x1);
        maxY = Math.max(maxY, command.y, command.y0, command.y1);
      } else {
        if (command.command !== "h") {
          minY = Math.min(minY, command.y);
          maxY = Math.max(maxY, command.y);
        }
        if (command.command !== "v") {
          minX = Math.min(minX, command.x);
          maxX = Math.max(maxX, command.x);
        }
      }
    }
  }

  const normalizeX = (x: number) => (x - minX) / (maxX - minX);
  const normalizeY = (y: number) => (y - minY) / (maxY - minY);

  for (const commands of lineCommands) {
    for (const command of commands) {
      if (command.command !== "v") {
        command.x = normalizeX(command.x);
      }
      if (command.command !== "h") {
        command.y = normalizeY(command.y);
      }
      if (command.command === "c") {
        command.x0 = normalizeX(command.x0);
        command.y0 = normalizeY(command.y0);
        command.x1 = normalizeX(command.x1);
        command.y1 = normalizeY(command.y1);
      }
    }
  }

  console.log(lineCommands);
};

convert(process.argv[2]);
