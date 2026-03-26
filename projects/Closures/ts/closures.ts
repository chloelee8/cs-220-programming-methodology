import { GenericFunction } from "../include/types.js";

export function composeFunctions<T>(funs: GenericFunction<T>[]): (x: T) => T[] {
  // TODO
  return (x: T): T[] => {
    const results: T[] = [x];

    let current: T = x;

    for (const a of funs) {
      current = a(current);
      results.push(current);
    }
    return results;
  };
}

// Creates a function that applies each function in the array one by one to an input value and returns all intermediate results in an array.

export function cyclic<T>(values: T[]): () => T {
  // TODO
  if (values.length === 0) {
    throw new Error("Error");
  }
  let i = 0;

  return (): T => {
    const v = values[i];
    i = (i + 1) % values.length;
    return v;
  };
}

// Creates a function that returns the next element in the array each time it is called, looping back to the start when it reaches the end (and throws an error if the array is empty).

export function rateLimiter<T, R>(func: (x: T, y: T) => R, limit: number): (x: T, y: T) => R | undefined {
  // TODO
  let count = 0;
  return (x: T, y: T): R | undefined => {
    if (count >= limit) {
      return undefined;
    }
    count++;
    return func(x, y);
  };
}

// Creates a function that calls the original function only up to a specified number of times and returns undefined after the limit is reached.

export function byParity(evenFunc: (n: number) => number, oddFunc: (n: number) => number): (n: number) => number {
  // TODO
  return (n: number): number => {
    if (n % 2 === 0) {
      return evenFunc(n);
    } else {
      return oddFunc(n);
    }
  };
}

// Creates a function that applies one function if the input number is even and a different function if the input number is odd.

export function vendingMachine(price: number, stock: number): (amount: number) => number | undefined {
  // TODO

  return (amount: number): number | undefined => {
    if (stock <= 0 || amount < price) {
      return undefined;
    }
    stock--;
    return amount - price;
  };
}

// Creates a function that simulates buying one item from a vending machine, returning change if payment is enough and stock remains, otherwise returning undefined.

export function wageChange(
  calcNew: (yr: number, prevWage: number) => number
): (startWage: number, startYr: number, endYr: number) => number {
  // TODO
  return (startWage: number, startYr: number, endYr: number): number => {
    if (startWage <= 0 || startYr < 1970 || endYr > 2026) {
      return NaN;
    }
    let wage = startWage;

    for (let yr = startYr + 1; yr <= endYr; yr++) {
      wage = calcNew(yr, wage);
    }

    if (!isFinite(wage) || wage <= 0) {
      return NaN;
    }

    return wage;
  };
}

// Creates a function that calculates how a wage changes year by year using a provided update function, returning NaN if any inputs or results are invalid.

export function sineSeries(x: number): (moreTerms?: number) => number {
  // TODO
  let sum = 0;
  let k = 0;
  let term = x;
  return (moreTerms = 1): number => {
    for (let i = 0; i < moreTerms; i++) {
      sum += term;
      k++;
      term *= (-1 * x * x) / (2 * k * (2 * k + 1));
    }
    return sum;
  };
}

// Creates a function that progressively approximates sin(x) by adding more terms of its Taylor series each time it is called.
