import { aIntonations, aLineCommands, aLineCommands1 } from "../commands/a";
import {
  doIntonations,
  doLineCommands0,
  doLineCommands1,
} from "../commands/do";
import {
  kaIntonations,
  kaLineCommands0,
  kaLineCommands1,
} from "../commands/ka";
import { nIntonations, nLineCommands0, nLineCommands1 } from "../commands/n";
import { uIntonations, uLineCommands0, uLineCommands1 } from "../commands/u";
import { interpolate, strokeToPath } from "./figure";

export type Char = "あ" | "か" | "ん" | "ど" | "う";

const lineCommands = {
  あ: [aLineCommands, aLineCommands1],
  か: [kaLineCommands0, kaLineCommands1],
  ん: [nLineCommands0, nLineCommands1],
  ど: [doLineCommands0, doLineCommands1],
  う: [uLineCommands0, uLineCommands1],
};

const intonations = {
  あ: aIntonations,
  か: kaIntonations,
  ん: nIntonations,
  ど: doIntonations,
  う: uIntonations,
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
  const width = 0.12 * Math.max(1.0 - typo.ratio1, 0);
  return interpolated.map((commands, i) =>
    strokeToPath(commands, width, intonations[char][i], typo.ratio2)
  );
};
