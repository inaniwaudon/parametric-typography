import styled from "@emotion/styled";

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
import { commandsToPathD, interpolate, strokeToPath } from "../lib/figure";
import { Typo } from "../lib/utils";

const Svg = styled.svg`
  width: 100%;
`;

interface DrawerProps {
  char: "あ" | "か" | "ん" | "ど" | "う";
  typo: Typo;
  hue: number;
}

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

const Drawer = ({ char, typo, hue }: DrawerProps) => {
  const charCommands = lineCommands[char];
  const interpolated = charCommands[0].map((commands, i) =>
    interpolate(commands, charCommands[1][i], typo.ratio0)
  );
  const width = 0.12 * Math.max(1.0 - typo.ratio1, 0);
  const offseted = interpolated.map((commands, i) =>
    strokeToPath(commands, width, intonations[char][i], typo.ratio2)
  );
  const dArray = commandsToPathD(offseted);
  const color = `hsl(${hue}deg, 80%, 60%)`;

  return (
    <Svg viewBox="-0.1 -0.1 1.2 1.3">
      {dArray.map((d, i) => (
        <path d={d} fill={color} key={i} />
      ))}
    </Svg>
  );
};

export default Drawer;
