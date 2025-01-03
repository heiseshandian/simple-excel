import { Range } from "./range";

export class Area {
  rowMap = new Map<number, { y: number; height: number }>();
  colMap = new Map<number, { x: number; width: number }>();

  public width: number;
  public height: number;

  constructor(
    public readonly range: Range,
    public readonly x: number,
    public readonly y: number,
    public readonly rowHeight: (index: number) => number,
    public readonly colWidth: (index: number) => number
  ) {
    let rangeHeight = 0;
    range.forEachRow((i) => {
      const height = rowHeight(i);
      this.rowMap.set(i, { y: rangeHeight, height });
      rangeHeight += height;
    });
    this.height = rangeHeight;

    let rangeWidth = 0;
    range.forEachCol((i) => {
      const width = colWidth(i);
      this.colMap.set(i, { x: rangeWidth, width });
      rangeWidth += width;
    });
    this.width = rangeWidth;
  }

  /**
   * Checks if a point (x, y) is within the area.
   * @param x - The x-coordinate of the point.
   * @param y - The y-coordinate of the point.
   * @returns True if the point is within the area, false otherwise.
   */
  contains(x: number, y: number) {
    return (
      x >= this.x &&
      x < this.x + this.width &&
      y >= this.y &&
      y < this.y + this.height
    );
  }

  /**
   * Iterates over each row in the area and executes a callback function.
   * @param cb - The callback function to execute for each row.
   */
  forEachRow(cb: (index: number, y: number, height: number) => void) {
    this.range.forEachRow((index) => {
      const { y, height } = this.rowMap.get(index) || { y: 0, height: 0 };
      if (height > 0) {
        cb(index, y, height);
      }
    });
  }

  /**
   * Iterates over each column in the area and executes a callback function.
   * @param cb - The callback function to execute for each column.
   */
  forEachCol(cb: (index: number, x: number, width: number) => void) {
    this.range.forEachCol((index) => {
      const { x, width } = this.colMap.get(index) || { x: 0, width: 0 };
      if (width > 0) {
        cb(index, x, width);
      }
    });
  }

  /**
   * Iterates over each cell in the area and executes a callback function.
   * @param cb - The callback function to execute for each cell.
   */
  forEachCell(cb: (rowIndex: number, colIndex: number, rect: Rect) => void) {
    this.forEachCol((row, y, height) => {
      this.forEachCol((col, x, width) => {
        cb(row, col, { x, y, width, height });
      });
    });
  }

  /**
   * Calculates the rectangular region that encompasses the given range.
   * @param range - The range of cells to include in the rectangle.
   * @returns A Rect object representing the rectangular region.
   */
  rect(range: Range): Rect {
    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;

    range.forEachRow((i) => {
      const row = this.rowMap.get(i);
      if (row) {
        if (height === 0) {
          y = row.y;
        }
        height += row.height;
      }
    });

    range.forEachCol((i) => {
      const col = this.colMap.get(i);
      if (col) {
        if (width === 0) {
          x = col.x;
        }
        width += col.width;
      }
    });

    return { x, y, width, height };
  }

  /**
   * Given a point (x, y), returns the corresponding row and column.
   * @param x - The x-coordinate of the point.
   * @param y - The y-coordinate of the point.
   * @returns An object containing the row and column indices, or null if the point is outside the area.
   */
  getCellAtPoint(x: number, y: number): AreaCell | null {
    if (!this.contains(x, y)) {
      return null;
    }
    let rowIndex: number | null = null;
    let colIndex: number | null = null;

    for (const [index, { y: rowY, height }] of this.rowMap) {
      if (y >= rowY && y < rowY + height) {
        rowIndex = index;
        break;
      }
    }

    for (const [index, { x: colX, width }] of this.colMap) {
      if (x >= colX && x < colX + width) {
        colIndex = index;
        break;
      }
    }
    if (rowIndex === null || colIndex === null) {
      return null;
    }

    return {
      row: rowIndex,
      col: colIndex,
      ...this.rowMap.get(rowIndex)!,
      ...this.colMap.get(colIndex)!,
    };
  }

  /**
   * Creates a new Area instance.
   * @param startRow - The starting row index.
   * @param startCol - The starting column index.
   * @param endRow - The ending row index.
   * @param endCol - The ending column index.
   * @param x - The x-coordinate of the top-left corner of the area.
   * @param y - The y-coordinate of the top-left corner of the area.
   * @param rowHeight - A function that returns the height of a given row index.
   * @param colWidth - A function that returns the width of a given column index.
   * @returns A new Area instance.
   */
  static create(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
    x: number,
    y: number,
    rowHeight: (index: number) => number,
    colWidth: (index: number) => number
  ) {
    return new Area(
      new Range(startRow, startCol, endRow, endCol),
      x,
      y,
      rowHeight,
      colWidth
    );
  }
}
