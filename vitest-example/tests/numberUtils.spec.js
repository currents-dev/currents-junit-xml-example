import { describe, it, expect, test } from "vitest";
import { calculateAverage } from "../numberUtils";

describe("calculateAverage", () => {
  it("calculates average of positive numbers", () => {
    expect(calculateAverage([1, 2, 3, 4, 5])).toBe(3);
  });

  it("handles array with single number", () => {
    expect(calculateAverage([5])).toBe(5);
  });

  it("handles empty array", () => {
    expect(calculateAverage([])).toBe(0);
  });

  it("handles negative numbers", () => {
    expect(calculateAverage([-1, -2, -3])).toBe(-2);
  });

  it("handles decimal numbers", () => {
    expect(calculateAverage([1.5, 2.5])).toBe(2);
  });

  it("returns 0 for invalid input", () => {
    expect(calculateAverage(null)).toBe(0);
    expect(calculateAverage(undefined)).toBe(0);
  });
  it("timeout", async () => {
    const count = Number(process.env.TEST_ATTEMPTS || 0) + 1;
    process.env.TEST_ATTEMPTS = String(count);
    console.log("COUNT::", count, process.env.TEST_ATTEMPTS);

    if (count < 3) {
      console.log("TIMEO::")
      expect(false).toBe(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    console.log("DEL::")

    // Optional cleanup
    delete process.env.TEST_ATTEMPTS;
  });
});
