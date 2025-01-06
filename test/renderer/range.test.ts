import { Range } from "../../src/renderer/range";
import { describe, it, expect } from "vitest";

describe("Range", () => {
  it("should create a range with the same start and end when only two arguments are provided", () => {
    const range = Range.create(1, 1);
    expect(range.start).toEqual([1, 1]);
    expect(range.end).toEqual([1, 1]);
  });

  it("should create a range with the correct start and end when four arguments are provided", () => {
    const range = Range.create(1, 1, 3, 3);
    expect(range.start).toEqual([1, 1]);
    expect(range.end).toEqual([3, 3]);
  });

  it("should correctly identify if a range contains another range", () => {
    const range1 = Range.create(1, 1, 5, 5);
    const range2 = Range.create(2, 2, 4, 4);
    expect(range1.contains(range2)).toBe(true);
    expect(range2.contains(range1)).toBe(false);
  });

  it("should correctly identify if a range is within another range", () => {
    const range1 = Range.create(1, 1, 5, 5);
    const range2 = Range.create(2, 2, 4, 4);
    expect(range2.within(range1)).toBe(true);
    expect(range1.within(range2)).toBe(false);
  });

  it("should correctly identify if two ranges intersect", () => {
    const range1 = Range.create(1, 1, 5, 5);
    const range2 = Range.create(4, 4, 6, 6);
    const range3 = Range.create(6, 6, 7, 7);
    expect(range1.intersects(range2)).toBe(true);
    expect(range1.intersects(range3)).toBe(false);
  });

  it("should correctly calculate the intersection of two ranges", () => {
    const range1 = Range.create(1, 1, 5, 5);
    const range2 = Range.create(4, 4, 6, 6);
    const intersection = range1.intersection(range2);
    expect(intersection.start).toEqual([4, 4]);
    expect(intersection.end).toEqual([5, 5]);
  });

  it("should correctly calculate the union of two ranges", () => {
    const range1 = Range.create(1, 1, 5, 5);
    const range2 = Range.create(4, 4, 6, 6);
    const union = range1.union(range2);
    expect(union.start).toEqual([1, 1]);
    expect(union.end).toEqual([6, 6]);
  });

  it("should correctly calculate the difference of two ranges when they intersect", () => {
    const range1 = Range.create(1, 1, 5, 5);
    const range2 = Range.create(3, 3, 6, 6);
    const difference = range1.exclude(range2);
    expect(difference.length).toBe(2);
    expect(difference[0].start).toEqual([1, 1]);
    expect(difference[0].end).toEqual([2, 5]);
    expect(difference[1].start).toEqual([3, 1]);
    expect(difference[1].end).toEqual([5, 2]);
  });

  it("should return an empty array when the ranges do not intersect", () => {
    const range1 = Range.create(1, 1, 2, 2);
    const range2 = Range.create(3, 3, 4, 4);
    const difference = range1.exclude(range2);
    expect(difference.length).toBe(1);
    expect(difference[0].start).toEqual([1, 1]);
    expect(difference[0].end).toEqual([2, 2]);
  });

  it("should create a range from a reference string", () => {
    const range = Range.with("A1:B2");
    expect(range.start).toEqual([0, 0]);
    expect(range.end).toEqual([1, 1]);
  });

  it("should iterate over each row in the range", () => {
    const range = Range.create(1, 1, 3, 3);
    const rows: number[] = [];
    range.forEachRow((rowIndex) => rows.push(rowIndex));
    expect(rows).toEqual([1, 2, 3]);
  });

  it("should iterate over each column in the range", () => {
    const range = Range.create(1, 1, 3, 3);
    const cols: number[] = [];
    range.forEachCol((colIndex) => cols.push(colIndex));
    expect(cols).toEqual([1, 2, 3]);
  });

  it("should iterate over each row in the range up to the specified end row", () => {
    const range = Range.create(1, 1, 5, 5);
    const rows: number[] = [];
    range.forEachRow((rowIndex) => rows.push(rowIndex), 3);
    expect(rows).toEqual([1, 2, 3]);
  });

  it("should iterate over each column in the range up to the specified end column", () => {
    const range = Range.create(1, 1, 5, 5);
    const cols: number[] = [];
    range.forEachCol((colIndex) => cols.push(colIndex), 3);
    expect(cols).toEqual([1, 2, 3]);
  });

  it("should iterate over each cell in the range", () => {
    const range = Range.create(1, 1, 2, 2);
    const cells: [number, number][] = [];
    range.forEachCell((rowIndex, colIndex) => cells.push([rowIndex, colIndex]));
    expect(cells).toEqual([
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 2],
    ]);
  });

  it("should iterate over each cell in the range with a larger range", () => {
    const range = Range.create(1, 1, 3, 3);
    const cells: [number, number][] = [];
    range.forEachCell((rowIndex, colIndex) => cells.push([rowIndex, colIndex]));
    expect(cells).toEqual([
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 1],
      [2, 2],
      [2, 3],
      [3, 1],
      [3, 2],
      [3, 3],
    ]);
  });
});
