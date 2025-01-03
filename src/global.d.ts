type RemoveMethods<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AreaCell = {
  row: number;
  col: number;
} & Rect;
