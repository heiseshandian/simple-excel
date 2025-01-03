import { indexToRef, refToIndex } from "./alphas";

/**
 * Represents a range of cells in a spreadsheet.
 */
export class Range {
  /**
   * Creates an instance of Range.
   * @param startRow - The starting row of the range.
   * @param startCol - The starting column of the range.
   * @param endRow - The ending row of the range.
   * @param endCol - The ending column of the range.
   */
  constructor(
    public startRow: number,
    public startCol: number,
    public endRow: number,
    public endCol: number
  ) {}

  /**
   * Gets the starting cell of the range.
   * @returns A tuple containing the starting row and column.
   */
  get start(): [number, number] {
    return [this.startRow, this.startCol];
  }

  /**
   * Gets the ending cell of the range.
   * @returns A tuple containing the ending row and column.
   */
  get end(): [number, number] {
    return [this.endRow, this.endCol];
  }

  get rows() {
    return this.endRow - this.startRow + 1;
  }

  get cols() {
    return this.endCol - this.startCol + 1;
  }

  get multiple() {
    return this.rows >= 1 || this.cols >= 1;
  }

  /**
   * Checks if this range completely contains another range.
   * @param other - The other range to check.
   * @returns True if this range contains the other range, false otherwise.
   */
  contains(other: Range): boolean {
    return (
      this.startRow <= other.startRow &&
      this.startCol <= other.startCol &&
      this.endRow >= other.endRow &&
      this.endCol >= other.endCol
    );
  }

  /**
   * Checks if this range is completely within another range.
   * @param other - The other range to check.
   * @returns True if this range is within the other range, false otherwise.
   */
  within(other: Range): boolean {
    return (
      this.startRow >= other.startRow &&
      this.startCol >= other.startCol &&
      this.endRow <= other.endRow &&
      this.endCol <= other.endCol
    );
  }

  /**
   * Checks if this range intersects with another range.
   * @param other - The other range to check.
   * @returns True if the ranges intersect, false otherwise.
   */
  intersects(other: Range): boolean {
    return (
      this.startRow <= other.endRow &&
      this.endRow >= other.startRow &&
      this.startCol <= other.endCol &&
      this.endCol >= other.startCol
    );
  }

  /**
   * Gets the intersection of this range with another range.
   * @param other - The other range to intersect with.
   * @returns A new range representing the intersection.
   */
  intersection(other: Range): Range {
    const startRow = Math.max(this.startRow, other.startRow);
    const startCol = Math.max(this.startCol, other.startCol);
    const endRow = Math.min(this.endRow, other.endRow);
    const endCol = Math.min(this.endCol, other.endCol);

    return new Range(startRow, startCol, endRow, endCol);
  }

  /**
   * Gets the union of this range with another range.
   * @param other - The other range to union with.
   * @returns A new range representing the union.
   */
  union(other: Range): Range {
    const startRow = Math.min(this.startRow, other.startRow);
    const startCol = Math.min(this.startCol, other.startCol);
    const endRow = Math.max(this.endRow, other.endRow);
    const endCol = Math.max(this.endCol, other.endCol);

    return new Range(startRow, startCol, endRow, endCol);
  }

  /**
   * Iterates over each row in the range and calls the callback function.
   * @param cb - The callback function to call for each row.
   * @param endRow - The optional ending row to stop the iteration.
   */
  forEachRow(cb: (rowIndex: number) => void, endRow?: number): void {
    const finalRow =
      endRow !== undefined ? Math.min(this.endRow, endRow) : this.endRow;
    for (let rowIndex = this.startRow; rowIndex <= finalRow; rowIndex++) {
      cb(rowIndex);
    }
  }

  /**
   * Iterates over each column in the range and calls the callback function.
   * @param cb - The callback function to call for each column.
   * @param endCol - The optional ending column to stop the iteration.
   */
  forEachCol(cb: (colIndex: number) => void, endCol?: number): void {
    const finalCol =
      endCol !== undefined ? Math.min(this.endCol, endCol) : this.endCol;
    for (let colIndex = this.startCol; colIndex <= finalCol; colIndex++) {
      cb(colIndex);
    }
  }

  /**
   * Iterates over each cell in the range and calls the callback function.
   * @param cb - The callback function to call for each cell.
   */
  forEachCell(cb: (rowIndex: number, colIndex: number) => void): void {
    for (let rowIndex = this.startRow; rowIndex <= this.endRow; rowIndex++) {
      for (let colIndex = this.startCol; colIndex <= this.endCol; colIndex++) {
        cb(rowIndex, colIndex);
      }
    }
  }

  clone(): Range {
    return new Range(this.startRow, this.startCol, this.endRow, this.endCol);
  }

  toString(): string {
    const left = indexToRef([this.startCol, this.startRow]);
    const right = indexToRef([this.endCol, this.endRow]);

    if (this.multiple) {
      return `${left}:$${right}`;
    }
    return left;
  }

  equals(other: Range): boolean {
    return (
      this.startRow === other.startRow &&
      this.startCol === other.startCol &&
      this.endRow === other.endRow &&
      this.endCol === other.endCol
    );
  }

  /**
   * Creates a new range from the given rows and columns.
   * @param row - The starting row.
   * @param col - The starting column.
   * @param row1 - The optional ending row.
   * @param col1 - The optional ending column.
   * @returns A new range.
   */
  static create(row: number, col: number): Range;
  static create(row: number, col: number, row1: number, col1: number): Range;
  static create(row: number, col: number, row1?: number, col1?: number): Range {
    if (row1 !== undefined && col1 !== undefined) {
      let [startRow, startCol, endRow, endCol] = [row, col, row1, col1];
      if (row > row1) {
        startRow = row1;
        endRow = row;
      }
      if (col > col1) {
        startCol = col1;
        endCol = col;
      }
      return new Range(startRow, startCol, endRow, endCol);
    }
    return new Range(row, col, row, col);
  }

  /**
   * Creates a new range from a string reference.
   * @param ref - The string reference in the format "A1" or "A1:B2".
   * @returns A new range.
   */
  static with(ref: string): Range {
    const refs = ref.split(":");
    const [col, row] = refToIndex(refs[0]);
    if (refs.length === 1) {
      return Range.create(row, col);
    }
    const [col1, row1] = refToIndex(refs[1]);
    return Range.create(row, col, row1, col1);
  }
}
