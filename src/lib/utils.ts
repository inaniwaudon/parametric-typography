export interface Pos {
  x: number;
  y: number;
  z: number;
}

const sum = (array: number[]) => array.reduce((prev, value) => prev + value, 0);

// 移動平均を算出
export const calculateMovingAverage = (
  array: Pos[],
  newValue: Pos,
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
