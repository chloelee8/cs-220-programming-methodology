import { AssertionError } from "assert";
import {
  FLAWED_STABLE_MATCHING_SOLUTION_1_TRACE,
  STABLE_MATCHING_SOLUTION_1_TRACE,
} from "../include/stableMatching.js";
import { generateInput, stableMatchingRunOracle } from "./oracles.js";

describe("generateInput", () => {
  // Tests for generateInput go here.
  it("should create an N x N preference matrix containing values 0..N-1 in every row", () => {
    const size = 5;
    const result = generateInput(size);
    expect(result.length).toBe(size);

    for (const preferenceRow of result) {
      expect(preferenceRow.length).toBe(size);
      const orderedRow = [...preferenceRow].sort((x, y) => x - y);
      for (let index = 0; index < size; index++) {
        expect(orderedRow[index]).toBe(index);
      }
    }
  });
});

describe("stableMatchingRunOracle", () => {
  // You do not need to write more tests than the two provided

  // Given an correct solution, no assertion should fail, and no errors should be thrown
  it("should pass when the stable matching trace is correct", () => {
    expect(() => stableMatchingRunOracle(STABLE_MATCHING_SOLUTION_1_TRACE)).not.toThrow();
  });

  // Given an incorrect solution, some assertion should fail
  it("throw an AssertionError for the flawed trace", () => {
    expect(() => stableMatchingRunOracle(FLAWED_STABLE_MATCHING_SOLUTION_1_TRACE)).toThrow(AssertionError);
  });
});
