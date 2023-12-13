export interface Point3D {
  x: number;
  y: number;
  z: number;
}

const sum = (array: number[]) => array.reduce((prev, value) => prev + value, 0);

// 移動平均を算出する
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

export const displayDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};
