import fs from "fs";
import { InputCommand } from "./src/lib/figure";

type TempCommand =
  | {
      command: "M" | "m";
      x: number;
      y: number;
    }
  | {
      command: "s";
      x2: number;
      y2: number;
      x: number;
      y: number;
    }
  | {
      command: "c" | "C";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      x: number;
      y: number;
    };

interface MinMax {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const calculateMinMax = (...minMaxes: MinMax[]): MinMax => {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = 0;
  let maxY = 0;

  for (const minMax of minMaxes) {
    minX = Math.min(minX, minMax.minX);
    minY = Math.min(minY, minMax.minY);
    maxX = Math.max(maxX, minMax.maxX);
    maxY = Math.max(maxY, minMax.maxY);
  }
  return { minX, minY, maxX, maxY };
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

const convert = (txt: string) => {
  const file = fs.readFileSync(txt, "utf8");
  const lines = file.split("\n");
  const tempCommands: TempCommand[][] = [];

  // パース
  for (const line of lines) {
    const commands: TempCommand[] = [];

    for (let i = 0; i < line.length; i++) {
      const command = line[i];

      const after = line.substring(i + 1);
      const toResult = after.search(/[MmsCc]/);
      const to = toResult > -1 ? toResult : after.length;
      const value = after.substring(0, to);
      const values = parseValues(value);

      if (command === "M" || command === "m") {
        commands.push({
          command,
          x: values[0],
          y: values[1],
        });
      }
      if (command === "s") {
        for (let i = 0; i < values.length / 4; i++) {
          commands.push({
            command: "s",
            x2: values[i * 4 + 0],
            y2: values[i * 4 + 1],
            x: values[i * 4 + 2],
            y: values[i * 4 + 3],
          });
        }
      }
      if (command === "c" || command === "C") {
        for (let i = 0; i < values.length / 6; i++) {
          commands.push({
            command,
            x1: values[i * 6 + 0],
            y1: values[i * 6 + 1],
            x2: values[i * 6 + 2],
            y2: values[i * 6 + 3],
            x: values[i * 6 + 4],
            y: values[i * 6 + 5],
          });
        }
      }
      i += to;
    }
    if (commands.length > 0) {
      tempCommands.push(commands);
    }
  }

  // 相対位置 → 絶対位置に変換
  for (const commands of tempCommands) {
    let beforeX = 0;
    let beforeY = 0;

    for (const command of commands) {
      const isAbsolute = command.command === "M" || command.command === "C";
      if (isAbsolute) {
        beforeX = command.x;
        beforeY = command.y;
        continue;
      }
      if ("x" in command) {
        command.x += beforeX;
      }
      if ("y" in command) {
        command.y += beforeY;
      }
      if ("x1" in command) {
        command.x1 += beforeX;
      }
      if ("y1" in command) {
        command.y1 += beforeY;
      }
      if ("x2" in command) {
        command.x2 += beforeX;
      }
      if ("y2" in command) {
        command.y2 += beforeY;
      }

      if ("x" in command) {
        beforeX = command.x;
      }
      if ("y" in command) {
        beforeY = command.y;
      }
    }
  }

  for (const commands of tempCommands) {
    for (const command of commands) {
      const before = commands[commands.indexOf(command) - 1];
      // s を変換
      if (
        command.command === "s" &&
        (before.command === "c" || before.command === "C")
      ) {
        (command as any).command = "C";
        (command as any).x1 = before.x + (before.x - before.x2);
        (command as any).y1 = before.y + (before.y - before.y2);
      }
      command.command = command.command.toUpperCase() as "M" | "C";
    }
  }
  return tempCommands as InputCommand[][];
};

const getMinMax = (inputCommands: InputCommand[][]): MinMax => {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = 0;
  let maxY = 0;

  for (const commands of inputCommands) {
    for (const command of commands) {
      if (command.command === "C") {
        minX = Math.min(minX, command.x, command.x1, command.x2);
        minY = Math.min(minY, command.y, command.y1, command.y2);
        maxX = Math.max(maxX, command.x, command.x1, command.x2);
        maxY = Math.max(maxY, command.y, command.y1, command.y2);
      } else {
        minX = Math.min(minX, command.x);
        maxX = Math.max(maxX, command.x);
        minY = Math.min(minY, command.y);
        maxY = Math.max(maxY, command.y);
      }
    }
  }
  return { minX, minY, maxX, maxY };
};

// 正規化
const normalize = (inputCommands: InputCommand[][], minMax: MinMax) => {
  const width = minMax.maxX - minMax.minX;
  const height = minMax.maxY - minMax.minY;
  const size = Math.max(width, height);

  const normalizeX = (x: number) => x / size;
  const normalizeY = (y: number) => y / size;

  for (const commands of inputCommands) {
    for (const command of commands) {
      command.x = normalizeX(command.x);
      command.y = normalizeY(command.y);
      if (command.command === "C") {
        command.x1 = normalizeX(command.x1);
        command.y1 = normalizeY(command.y1);
        command.x2 = normalizeX(command.x2);
        command.y2 = normalizeY(command.y2);
      }
    }
  }
  return inputCommands;
};

// 中央揃え
const centerlize = (inputCommands: InputCommand[][]) => {
  const minMax = getMinMax(inputCommands);
  const width = minMax.maxX - minMax.minX;
  const height = minMax.maxY - minMax.minY;
  const left = (1.0 - width) / 2;
  const top = (1.0 - height) / 2;

  for (const commands of inputCommands) {
    for (const command of commands) {
      command.x += left;
      command.y += top;
      if (command.command === "C") {
        command.x1 += left;
        command.y1 += top;
        command.x2 += left;
        command.y2 += top;
      }
    }
  }
  return inputCommands;
};

const chars = ["a", "ka", "n", "do", "u", "ki", "yo", "e"];
for (const char of chars) {
  const converted = [
    convert(`font/${char}0.svg`),
    convert(`font/${char}1.svg`),
  ];
  const minMax0 = getMinMax(converted[0]);
  const minMax1 = getMinMax(converted[1]);
  const minMax = calculateMinMax(minMax0, minMax1);
  const normaized = [
    normalize(converted[0], minMax),
    normalize(converted[1], minMax),
  ];
  const centerlized = [centerlize(normaized[0]), centerlize(normaized[1])];
  const json = JSON.stringify(centerlized);

  fs.writeFileSync(`src/const/commands/${char}.json`, json);
}
