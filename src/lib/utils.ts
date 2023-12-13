export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Typo {
  ratio0: number;
  ratio1: number;
  ratio2: number;
}

const sum = (array: number[]) => array.reduce((prev, value) => prev + value, 0);

// 移動平均を算出
export const calculateMovingAverage = (
  array: Point3D[],
  newValue: Point3D,
  windowSize: number
) => {
  const newArray = [...array, newValue].slice(-windowSize);
  const totalX = sum(newArray.map((value) => value.x));
  const totalY = sum(newArray.map((value) => value.y));
  const totalZ = sum(newArray.map((value) => value.z));
  return {
    x: totalX / newArray.length,
    y: totalY / newArray.length,
    z: totalZ / newArray.length,
  };
};

export const withinRange = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
