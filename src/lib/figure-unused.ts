/*type Line =
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
    };*/

// 点を移動させる
/*const movePoint = (point: Point, delta: Point): Point => ({
  x: point.x + delta.x,
  y: point.y + delta.y,
});*/

// 2 点を通る直線の式を求める
/*const getLine = (p0: Point, p1: Point): Line => {
  const dx = p1.x - p0.x;
  if (dx === 0) {
    return { type: "vertical", x: p0.x };
  }
  const a = (p1.y - p0.y) / dx;
  const b = -a * p0.x + p0.y;
  return { type: "normal", a, b };
};*/

// 2 直線の交点を求める
/*const getIntersection = (line0: Line, line1: Line): Point | null => {
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
};*/

// Arc の t における法線を求める
/*const getArcNormal = (arc: Arc, t: number): Point => {
  const differentiate = (p0: number, p1: number, p2: number, p3: number) =>
    -3 * (1 - t) ** 2 * p0 +
    (9 * t ** 2 - 12 * t + 3) * p1 +
    (-9 * t ** 2 + 6 * t) * p2 +
    3 * t ** 2 * p3;

  const dx = differentiate(arc.p0.x, arc.p1.x, arc.p2.x, arc.p3.x);
  const dy = differentiate(arc.p0.y, arc.p1.y, arc.p2.y, arc.p3.y);
  return { x: dy, y: dx };
};*/

// Arc を distance 移動させた平行曲線を求める
/*const getParallelArc = (arc: Arc, d0: number, d1: number): Arc => {
  // アンカーポイントの移動量を求める
  const n0 = getArcNormal(arc, 0);
  const n1 = getArcNormal(arc, 1);
  const getDelta = (n: Point, d: number) => ({
    x: Math.cos(Math.atan2(n.y, n.x)) * d,
    y: Math.sin(Math.atan2(n.y, n.x)) * -d,
  });
  const fromDelta = getDelta(n0, d0);
  const toDelta = getDelta(n1, d1);

  // 移動前のハンドルを法線方向に d 移動させる
  const move = (p: Point, d: number) => {
    const line = getLine(arc.p1, arc.p2);
    if (line.type === "vertical") {
      //
    }
    if (line.type === "normal") {
      const y = arc.p1.y > arc.p2.y ? -1 : 1;
      const tan = Math.atan2((1 / line.a) * y, 1);
      p.y += d / -Math.sin(tan);
    }
    return p;
  };
  const tempP1 = move({ ...arc.p1 }, d0);
  const tempP2 = move({ ...arc.p2 }, d1);
  const handleLine = getLine(tempP1, tempP2);

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
};*/
