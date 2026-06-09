import { describe, it, expect } from "vitest";

// Sample utility function to test
function add(a: number, b: number) {
  return a + b;
}

describe("utils", () => {
  it("should add two numbers correctly", () => {
    expect(add(1, 2)).toBe(3);
  });
});
