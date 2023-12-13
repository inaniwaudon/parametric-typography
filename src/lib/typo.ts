import aCommands from "../const/commands/a.json";
import doCommands from "../const/commands/do.json";
import kaCommands from "../const/commands/ka.json";
import nCommands from "../const/commands/n.json";
import uCommands from "../const/commands/u.json";
import { InputCommand, interpolate, strokeToPath } from "./figure";
import { intonations } from "./intonation";

export type Char = "あ" | "か" | "ん" | "ど" | "う";

const lineCommands = {
  あ: aCommands as InputCommand[][][],
  か: kaCommands as InputCommand[][][],
  ん: nCommands as InputCommand[][][],
  ど: doCommands as InputCommand[][][],
  う: uCommands as InputCommand[][][],
};

export interface Typo {
  ratio0: number;
  ratio1: number;
  ratio2: number;
}

export const typoToCommands = (char: Char, typo: Typo) => {
  const charCommands = lineCommands[char];
  const interpolated = charCommands[0].map((commands, i) =>
    interpolate(commands, charCommands[1][i], typo.ratio0)
  );
  const width = 0.12 * Math.max(1.0 - typo.ratio1, 0) + 0.01;
  return interpolated.map((commands, i) =>
    strokeToPath(commands, width, intonations[char][i], typo.ratio2)
  );
};
