import assert from "assert";

import type { StableMatcherWithTrace, Hire } from "../include/stableMatching.js";
/**
 * Returns a random integer i where min <= i < max
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Fisher-Yates shuffle for arrays
 */
function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

/**
 * Generates an n x n preference matrix
 */
export function generateInput(n: number): number[][] {
  // TODO
  const result: number[][] = [];
  for (let i = 0; i < n; i++) {
    const prefs = Array.from({ length: n }, (_, idx) => idx);
    result.push(shuffle(prefs));
  }
  return result;
}

const NUM_TESTS = 20; // Change this to some reasonably large value
const N = 6; // Change this to some reasonable size

/**
 * Tests whether or not the supplied function follows the supplied algorithm.
 * @param makeStableMatchingTrace A possible solution to the stable matching problem and its possible steps
 * @throws An `AssertionError` if `makeStableMatchingTrace` does not follow the specified algorithm, or its steps (trace)
 * do not match with the result (out).
 */
export function stableMatchingRunOracle(makeStableMatchingTrace: StableMatcherWithTrace): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const { trace, out } = makeStableMatchingTrace(companies, candidates);

    // This statement is here to prevent linter warnings about `trace` and `out` not being used.
    // Remove it as necessary.
    console.log(trace, out);

    // TODO: Assertions go here

    // Keep track of current matches and proposals
    const companyMatch: (number | null)[] = Array.from({ length: N }, () => null);
    const candidateMatch: (number | null)[] = Array.from({ length: N }, () => null);
    const companyNextOffer: number[] = Array.from({ length: N }, () => 0); // index of next candidate to propose to
    const candidateNextOffer: number[] = Array.from({ length: N }, () => 0); // index of next company to propose to

    for (const offer of trace) {
      const fromCo = offer.fromCo;
      const proposer = offer.from;
      const receiver = offer.to;

      // Ensure proposer is proposing to next candidate/company in order
      if (fromCo) {
        assert(companyNextOffer[proposer] < N, `Company ${proposer} has exhausted its preference list`);
        const expectedReceiver = companies[proposer][companyNextOffer[proposer]];
        assert(
          receiver === expectedReceiver,
          `Company ${proposer} should propose to ${expectedReceiver}, not ${receiver}`
        );
        companyNextOffer[proposer]++;
      } else {
        assert(candidateNextOffer[proposer] < N, `Candidate ${proposer} has exhausted its preference list`);
        const expectedReceiver = candidates[proposer][candidateNextOffer[proposer]];
        assert(
          receiver === expectedReceiver,
          `Candidate ${proposer} should propose to ${expectedReceiver}, not ${receiver}`
        );
        candidateNextOffer[proposer]++;
      }

      // Handle acceptance/rejection
      if (fromCo) {
        const current = candidateMatch[receiver];
        if (current === null) {
          // Candidate is unmatched, accept
          candidateMatch[receiver] = proposer;
          companyMatch[proposer] = receiver;
        } else {
          // Candidate already matched, check preference
          const pref = candidates[receiver];
          if (pref.indexOf(proposer) < pref.indexOf(current)) {
            // Accept new offer
            companyMatch[current] = null;
            candidateMatch[receiver] = proposer;
            companyMatch[proposer] = receiver;
          }
        }
      } else {
        const current = companyMatch[receiver];
        if (current === null) {
          // Company is unmatched, accept
          companyMatch[receiver] = proposer;
          candidateMatch[proposer] = receiver;
        } else {
          const pref = companies[receiver];
          if (pref.indexOf(proposer) < pref.indexOf(current)) {
            // Accept new offer
            candidateMatch[current] = null;
            companyMatch[receiver] = proposer;
            candidateMatch[proposer] = receiver;
          }
        }
      }
    }

    // Verify final hires match the computed matches
    const finalHires: Hire[] = [];
    for (let c = 0; c < N; c++) {
      const candidate = companyMatch[c];
      if (candidate !== null) finalHires.push({ company: c, candidate });
    }

    // Each hire in `out` must match computed hires
    assert(finalHires.length === out.length, "Number of hires does not match trace result");

    for (const hire of out) {
      const match = companyMatch[hire.company];
      assert(
        match === hire.candidate,
        `Hire mismatch: company ${hire.company} should be matched with ${match ?? "null"}, got ${hire.candidate}`
      );
    }
  }
}
