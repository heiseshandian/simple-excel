import { describe, it, expect } from "vitest";
import { Area } from "../../src/renderer/area";
import { Range } from "../../src/renderer/range";

describe("Area", () => {
  const mockRange = {
    forEachRow: (cb: (index: number) => void) => {
      for (let i = 0; i < 5; i++) cb(i);
    },
    forEachCol: (cb: (index: number) => void) => {
      for (let i = 0; i < 5; i++) cb(i);
    },
  } as Range;

  const rowHeight = (index: number) => 20;
  const colWidth = (index: number) => 50;

  const area = new Area(mockRange, 0, 0, rowHeight, colWidth);

  it("should calculate the correct width and height", () => {
    expect(area.width).toBe(250); // 5 columns * 50 width
    expect(area.height).toBe(100); // 5 rows * 20 height
  });

  it("should check if a point is within the area", () => {
    expect(area.contains(10, 10)).toBe(true);
    expect(area.contains(300, 10)).toBe(false);
    expect(area.contains(10, 150)).toBe(false);
  });

  it("should iterate over each row", () => {
    const rows: number[] = [];
    area.forEachRow((index) => rows.push(index));
    expect(rows).toEqual([0, 1, 2, 3, 4]);
  });

  it("should iterate over each column", () => {
    const cols: number[] = [];
    area.forEachCol((index) => cols.push(index));
    expect(cols).toEqual([0, 1, 2, 3, 4]);
  });

  it("should iterate over each cell", () => {
    const cells: { row: number; col: number }[] = [];
    area.forEachCell((row, col) => cells.push({ row, col }));
    expect(cells.length).toBe(25); // 5 rows * 5 columns
    expect(cells[0]).toEqual({ row: 0, col: 0 });
    expect(cells[24]).toEqual({ row: 4, col: 4 });
  });

  it("should calculate the correct rectangle for a given range", () => {
    const range = {
      forEachRow: (cb: (index: number) => void) => {
        cb(1);
        cb(2);
      },
      forEachCol: (cb: (index: number) => void) => {
        cb(1);
        cb(2);
      },
    } as Range;

    const rect = area.rect(range);
    expect(rect).toEqual({ x: 50, y: 20, width: 100, height: 40 });
  });

  it("should return an empty rectangle for an empty range", () => {
    const emptyRange = {
      forEachRow: (cb: (index: number) => void) => {},
      forEachCol: (cb: (index: number) => void) => {},
    } as Range;

    const rect = area.rect(emptyRange);
    expect(rect).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });

  it("should return the correct cell for a given point", () => {
    const cell = area.getCellAtPoint(60, 30);
    expect(cell).toEqual({
      row: 1,
      col: 1,
      y: 20,
      height: 20,
      x: 50,
      width: 50,
    });
  });

  it("should return null for a point outside the area", () => {
    const cell = area.getCellAtPoint(300, 300);
    expect(cell).toBeNull();
  });

  it("should create a new Area instance using the create method", () => {
    const newArea = Area.create(0, 0, 4, 4, 0, 0, rowHeight, colWidth);
    expect(newArea.width).toBe(250); // 5 columns * 50 width
    expect(newArea.height).toBe(100); // 5 rows * 20 height
    expect(newArea.contains(10, 10)).toBe(true);
    expect(newArea.contains(300, 10)).toBe(false);
  });

  it("should create a new Area instance with different dimensions", () => {
    const newArea = Area.create(1, 1, 3, 3, 10, 10, rowHeight, colWidth);
    expect(newArea.width).toBe(150); // 3 columns * 50 width
    expect(newArea.height).toBe(60); // 3 rows * 20 height
    expect(newArea.contains(20, 20)).toBe(true);
    expect(newArea.contains(200, 20)).toBe(false);
  });
});
