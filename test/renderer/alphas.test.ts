import { describe, it, expect } from "vitest";
import {
  refToIndex,
  indexToRef,
  indexToColumnRef,
  columnRefToIndex,
} from "../../src/renderer/alphas";

describe("alphas.ts", () => {
  it("should convert Excel reference to index", () => {
    expect(refToIndex("A1")).toEqual([0, 0]);
    expect(refToIndex("B2")).toEqual([1, 1]);
    expect(refToIndex("Z1")).toEqual([25, 0]);
    expect(refToIndex("AA1")).toEqual([26, 0]);
  });

  it("should convert index to Excel reference", () => {
    expect(indexToRef([0, 0])).toBe("A1");
    expect(indexToRef([1, 1])).toBe("B2");
    expect(indexToRef([25, 0])).toBe("Z1");
    expect(indexToRef([26, 0])).toBe("AA1");
  });

  it("should convert column index to column reference", () => {
    expect(indexToColumnRef(0)).toBe("A");
    expect(indexToColumnRef(1)).toBe("B");
    expect(indexToColumnRef(25)).toBe("Z");
    expect(indexToColumnRef(26)).toBe("AA");
  });

  it("should convert column reference to column index", () => {
    expect(columnRefToIndex("A")).toBe(0);
    expect(columnRefToIndex("B")).toBe(1);
    expect(columnRefToIndex("Z")).toBe(25);
    expect(columnRefToIndex("AA")).toBe(26);
  });
});
