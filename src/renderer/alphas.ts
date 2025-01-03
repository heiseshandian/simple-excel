// Converts an Excel cell reference (e.g., "A12") to an index value (e.g., [0, 11])
export function refToIndex(ref: string): [number, number] {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error("Invalid Excel reference");
  }

  const col = match[1];
  const row = parseInt(match[2], 10) - 1;

  let colIndex = 0;
  for (let i = 0; i < col.length; i++) {
    colIndex = colIndex * 26 + (col.charCodeAt(i) - "A".charCodeAt(0) + 1);
  }

  return [colIndex - 1, row];
}

// Converts an index value (e.g., [0, 11]) to an Excel cell reference (e.g., "A12")
export function indexToRef(index: [number, number]): string {
  let [colIndex, rowIndex] = index;
  let col = "";

  colIndex += 1;
  while (colIndex > 0) {
    const remainder = (colIndex - 1) % 26;
    col = String.fromCharCode("A".charCodeAt(0) + remainder) + col;
    colIndex = Math.floor((colIndex - 1) / 26);
  }

  return `${col}${rowIndex + 1}`;
}

// Converts a column index (e.g., 0) to an Excel column reference (e.g., "A")
export function indexToColumnRef(colIndex: number): string {
  let col = "";
  colIndex += 1;
  while (colIndex > 0) {
    const remainder = (colIndex - 1) % 26;
    col = String.fromCharCode("A".charCodeAt(0) + remainder) + col;
    colIndex = Math.floor((colIndex - 1) / 26);
  }
  return col;
}

// Converts an Excel column reference (e.g., "A") to a column index (e.g., 0)
export function columnRefToIndex(colRef: string): number {
  let colIndex = 0;
  for (let i = 0; i < colRef.length; i++) {
    colIndex = colIndex * 26 + (colRef.charCodeAt(i) - "A".charCodeAt(0) + 1);
  }
  return colIndex - 1;
}
