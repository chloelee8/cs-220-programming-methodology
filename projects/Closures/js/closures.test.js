import assert from "assert";
import { composeFunctions, cyclic, rateLimiter, byParity, vendingMachine, wageChange, sineSeries } from "./closures";
describe("composeFunctions", () => {
    // Write tests for composeFunctions here
    it("should return [x] when funs is empty", () => {
        const g = composeFunctions([]);
        assert.deepStrictEqual(g(1), [1]);
    });
    it("should work correctly with one function", () => {
        const f = (n) => n + 1;
        const g = composeFunctions([f]);
        assert.deepStrictEqual(g(1), [1, 2]);
    });
    it("should run functions in order and show every result", () => {
        const f0 = (n) => n + 1;
        const f1 = (n) => n * 2;
        const f2 = (n) => n - 3;
        const g = composeFunctions([f0, f1, f2]);
        assert.deepStrictEqual(g(4), [4, 5, 10, 7]);
    });
    it("should run each function one time when called", () => {
        let call0 = 0, call1 = 0;
        const f0 = (n) => {
            call0++;
            return n + 1;
        };
        const f1 = (n) => {
            call1++;
            return n * 2;
        };
        const g = composeFunctions([f0, f1]);
        assert.deepStrictEqual(g(4), [4, 5, 10]);
        assert.strictEqual(call0, 1);
        assert.strictEqual(call1, 1);
    });
    it("should work with different inputs", () => {
        const f0 = (n) => n + 1;
        const f1 = (n) => n * 2;
        const g = composeFunctions([f0, f1]);
        assert.deepStrictEqual(g(4), [4, 5, 10]);
        assert.deepStrictEqual(g(5), [5, 6, 12]);
    });
});
describe("cyclic", () => {
    // Write tests for cyclic here
    it("should throw new Error if array is empty", () => {
        assert.throws(() => {
            cyclic([]);
        });
    });
    it("should return the same value if there is only one element in array", () => {
        const g = cyclic([1]);
        assert.strictEqual(g(), 1);
        assert.strictEqual(g(), 1);
        assert.strictEqual(g(), 1);
        assert.strictEqual(g(), 1);
    });
    it("should cycle through the array and return the value", () => {
        const g = cyclic([1, 2, 3, 4]);
        assert.strictEqual(g(), 1);
        assert.strictEqual(g(), 2);
        assert.strictEqual(g(), 3);
        assert.strictEqual(g(), 4);
        assert.strictEqual(g(), 1);
        assert.strictEqual(g(), 2);
    });
    it("should not share state between different cyclic instances", () => {
        const g1 = cyclic([1, 2, 3]);
        const g2 = cyclic([1, 2, 3]);
        assert.strictEqual(g1(), 1);
        assert.strictEqual(g1(), 2);
        assert.strictEqual(g1(), 3);
        assert.strictEqual(g1(), 1);
        assert.strictEqual(g1(), 2);
        assert.strictEqual(g2(), 1);
        assert.strictEqual(g2(), 2);
        assert.strictEqual(g2(), 3);
        assert.strictEqual(g2(), 1);
        assert.strictEqual(g2(), 2);
    });
});
describe("rateLimiter", () => {
    // Write tests for rateLimiter here
    it("should return undefined when limit = 0", () => {
        const call = 0;
        const func = (x, y) => x + y;
        const g = rateLimiter(func, 0);
        assert.strictEqual(g(1, 2), undefined);
        assert.strictEqual(call, 0);
    });
    it("should be able to call func until the limit, once it reaches limit return undefined", () => {
        const func = (x, y) => x + y;
        const g = rateLimiter(func, 2);
        assert.strictEqual(g(1, 2), 3);
        assert.strictEqual(g(2, 3), 5);
        assert.strictEqual(g(3, 4), undefined);
    });
    it("should not be able to call func if it reached the limit", () => {
        let call = 0;
        const func = (x, y) => {
            call++;
            return x + y;
        };
        const g = rateLimiter(func, 2);
        assert.strictEqual(g(1, 2), 3);
        assert.strictEqual(g(2, 3), 5);
        assert.strictEqual(g(3, 4), undefined);
        assert.strictEqual(call, 2);
    });
});
describe("byParity", () => {
    // Write tests for byParity here
    it("should treat 0 as an even number", () => {
        const evenFunc = (n) => n * 2;
        const oddFunc = (n) => n + 2;
        const g = byParity(evenFunc, oddFunc);
        assert.strictEqual(g(0), 0);
    });
    it("should use evenFunc if the number is even, use odd if the number is odd", () => {
        const evenFunc = (n) => n + 1;
        const oddFunc = (n) => n + 2;
        const g = byParity(evenFunc, oddFunc);
        assert.strictEqual(g(2), 3);
        assert.strictEqual(g(3), 5);
    });
    it("should only call the correct function", () => {
        let e_call = 0;
        let o_call = 0;
        const evenFunc = (n) => {
            e_call++;
            return n + 1;
        };
        const oddFunc = (n) => {
            o_call++;
            return n + 2;
        };
        const g = byParity(evenFunc, oddFunc);
        assert.strictEqual(g(2), 3);
        assert.strictEqual(e_call, 1);
        assert.strictEqual(o_call, 0);
        assert.strictEqual(g(3), 5);
        assert.strictEqual(e_call, 1);
        assert.strictEqual(o_call, 1);
    });
});
describe("vendingMachine", () => {
    // Write tests for vendingMachine here
    it("should return change if amount is greater than or equal to the price and reduce stock", () => {
        const g = vendingMachine(3, 2);
        assert.strictEqual(g(7), 4);
        assert.strictEqual(g(8), 5);
        assert.strictEqual(g(9), undefined);
    });
    it("should return undefined if amount is less than the price", () => {
        const g = vendingMachine(3, 2);
        assert.strictEqual(g(1), undefined);
    });
    it("should return undefined if there is no more stock left", () => {
        const g = vendingMachine(3, 0);
        assert.strictEqual(g(4), undefined);
    });
});
describe("wageChange", () => {
    // Write tests for wageChange here
    it("should correctly calculate wage increase over years", () => {
        const calcNew = (yr, prevWage) => prevWage + 5;
        const g = wageChange(calcNew);
        assert.strictEqual(g(10, 2000, 2002), 20);
    });
    it("should return NaN if start wage is less than or equal to 0", () => {
        const calcNew = (yr, prevWage) => prevWage + 5;
        const g = wageChange(calcNew);
        assert.strictEqual(Number.isNaN(g(0, 2000, 2002)), true);
    });
    it("should return NaN if start year is less earlier than 1970 or end year is later than 2026", () => {
        const calcNew = (yr, prevWage) => prevWage + 5;
        const g = wageChange(calcNew);
        assert.strictEqual(Number.isNaN(g(10, 1969, 2002)), true);
        assert.strictEqual(Number.isNaN(g(10, 2000, 2027)), true);
    });
    it("should return NaN if start year is greater than end year", () => {
        const calcNew = (yr, prevWage) => prevWage + 5;
        const g = wageChange(calcNew);
        assert.strictEqual(Number.isNaN(g(10, 2002, 2000)), true);
    });
});
describe("sineSeries", () => {
    // Write tests for sineSeries here
    it("should return the first term x", () => {
        const g = sineSeries(1);
        assert.strictEqual(g(), 1);
    });
    it("should add the second term on the next call", () => {
        const g = sineSeries(1);
        const f1 = g();
        const f2 = g();
        assert.strictEqual(f1, 1);
        assert.strictEqual(Number(f2.toFixed(4)), Number((5 / 6).toFixed(4)));
    });
    it("should continue from previous sum instead of restarting", () => {
        const g = sineSeries(1);
        const f1 = g();
        const f2 = g();
        const f3 = g();
        assert.notStrictEqual(f1, f2);
        assert.notStrictEqual(f2, f3);
    });
    it("should calculate when multiple terms at once", () => {
        const g = sineSeries(1);
        const f = g(2);
        assert.strictEqual(Number(f.toFixed(4)), Number((5 / 6).toFixed(4)));
    });
});
//# sourceMappingURL=closures.test.js.map