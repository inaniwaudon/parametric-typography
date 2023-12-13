import { Font, Glyph, Path } from "opentype.js";
import { OutputCommand, moveCommands, scaleCommands } from "./figure";
import { Char, Typo, typoToCommands } from "./typo";

const ASCENDER = 880;

const commandsToPath = (commands: OutputCommand[][]) => {
  const path = new Path();
  for (const c of commands.flat()) {
    if (c.command === "M") {
      path.moveTo(c.x, -c.y);
    }
    if (c.command === "L") {
      path.lineTo(c.x, -c.y);
    }
    if (c.command === "C") {
      path.curveTo(c.x1, -c.y1, c.x2, -c.y2, c.x, -c.y);
    }
    if (c.command === "Z") {
      path.close();
    }
  }
  console.log(path.commands);
  return path;
};

export const makeFont = (typo: Typo) => {
  const chars: Char[] = ["あ", "か", "ん", "ど", "う"];
  const glyphs: Glyph[] = chars.map(
    (char) =>
      new Glyph({
        name: char,
        unicode: char.codePointAt(0),
        advanceWidth: 1000,
        path: commandsToPath(
          moveCommands(scaleCommands(typoToCommands(char, typo), 900), {
            x: 50,
            y: 50 - ASCENDER,
          })
        ),
      })
  );

  const notdefGlyph = new Glyph({
    name: ".notdef",
    advanceWidth: 1000,
    path: new Path(),
  });

  const font = new Font({
    familyName: "parametric-font",
    styleName: "Medium",
    unitsPerEm: 1000,
    ascender: ASCENDER,
    descender: -120,
    glyphs: [notdefGlyph, ...glyphs],
  });
  font.download();
};
