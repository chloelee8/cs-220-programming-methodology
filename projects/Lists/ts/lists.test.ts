import assert from "assert";
import { List, node, empty, listToArray, arrayToList } from "../include/lists.js";
// listToArray and arrayToList are provided for your testing convenience only.
import {
  insertOrdered,
  everyNRev,
  everyNCond,
  keepTrendMiddles,
  keepLocalMaxima,
  keepLocalMinima,
  keepLocalMinimaAndMaxima,
  nonNegativeProducts,
  negativeProducts,
  deleteFirst,
  deleteLast,
  squashList,
} from "./lists.js";

describe("insertOrdered", () => {
  // Tests for insertOrdered go here

  it("should insert into empty list", () => {
    const lst: List<number> = empty();
    assert.deepStrictEqual(listToArray(insertOrdered(lst, 1)), [1]);
  });

  it("should insert at front", () => {
    const lst = node(2, node(3, node(4, empty())));
    assert.deepStrictEqual(listToArray(insertOrdered(lst, 1)), [1, 2, 3, 4]);
  });

  it("should insert in middle", () => {
    const lst = node(2, node(3, node(4, node(6, empty()))));
    assert.deepStrictEqual(listToArray(insertOrdered(lst, 5)), [2, 3, 4, 5, 6]);
  });

  it("should insert at end", () => {
    const lst = node(2, node(3, node(4, node(10, empty()))));
    assert.deepStrictEqual(listToArray(insertOrdered(lst, 9)), [2, 3, 4, 9, 10]);
  });

  it("should allow duplicates", () => {
    const lst = node(2, node(3, node(4, node(5, empty()))));
    assert.deepStrictEqual(listToArray(insertOrdered(lst, 4)), [2, 3, 4, 4, 5]);
  });

  it("should insert duplicate at front", () => {
    const lst = node(2, node(3, empty()));
    assert.deepStrictEqual(listToArray(insertOrdered(lst, 2)), [2, 2, 3]);
  });
});

describe("everyNRev", () => {
  // Tests for everyNRev go here

  it("n=1 returns reverse of list", () => {
    const lst = node(1, node(2, node(3, empty())));
    assert.deepStrictEqual(listToArray(everyNRev(lst, 1)), [3, 2, 1]);
  });

  it("should reverse every 2nd", () => {
    const lst = node(1, node(2, node(3, node(4, node(5, node(6, empty()))))));
    assert.deepStrictEqual(listToArray(everyNRev(lst, 2)), [6, 4, 2]);
  });

  it("should return empty for if n is larger than length", () => {
    const lst = node(1, node(2, empty()));
    assert.deepStrictEqual(listToArray(everyNRev(lst, 5)), []);
  });

  it("should let empty list stays empty", () => {
    assert.deepStrictEqual(listToArray(everyNRev(empty<number>(), 2)), []);
  });

  it("should handle length that is not divisible by n", () => {
    const lst = node(1, node(2, node(3, node(4, node(5, empty())))));
    assert.deepStrictEqual(listToArray(everyNRev(lst, 2)), [4, 2]);
  });
});

describe("everyNCond", () => {
  // Tests for everyNCond go here
  const isEven = (x: number) => x % 2 === 0;

  it("should order every 2nd even in original order", () => {
    const lst = node(1, node(2, node(3, node(4, node(5, node(6, node(7, node(8, empty()))))))));
    assert.deepStrictEqual(listToArray(everyNCond(lst, 2, isEven)), [4, 8]);
  });

  it("should return n = 1 for that are all satisfying", () => {
    const lst = node(1, node(2, node(3, node(4, empty()))));
    assert.deepStrictEqual(listToArray(everyNCond(lst, 1, isEven)), [2, 4]);
  });

  it("should return empty for that are not satisfying", () => {
    const lst = node(1, node(3, node(5, empty())));
    assert.deepStrictEqual(listToArray(everyNCond(lst, 2, isEven)), []);
  });

  it("should return empty list", () => {
    assert.deepStrictEqual(listToArray(everyNCond(empty<number>(), 2, isEven)), []);
  });

  it("should count only elements satisfying condition", () => {
    const lst = node(2, node(4, node(6, node(8, empty()))));
    assert.deepStrictEqual(listToArray(everyNCond(lst, 3, isEven)), [6]);
  });
});

describe("keepTrendMiddles", () => {
  // Tests for keepTrendMiddles go here

  it("should return empty for length < 3", () => {
    assert.deepStrictEqual(listToArray(keepTrendMiddles(empty<number>(), () => true)), []);
    assert.deepStrictEqual(listToArray(keepTrendMiddles(node(1, empty()), () => true)), []);
    assert.deepStrictEqual(listToArray(keepTrendMiddles(node(1, node(2, empty())), () => true)), []);
  });

  it("should keep the correct middles", () => {
    const lst = node(1, node(3, node(2, node(4, node(0, empty())))));
    assert.deepStrictEqual(listToArray(keepTrendMiddles(lst, (p, c, n) => p < c && c > n)), [3, 4]);
  });

  it("should not include neighbors that are equal to", () => {
    const lst = node(1, node(2, node(2, node(1, empty()))));
    assert.deepStrictEqual(listToArray(keepTrendMiddles(lst, (p, c, n) => p < c && c > n)), []);
  });
});

describe("keepLocalMaxima", () => {
  // Tests for keepLocalMaxima go here

  it("should keep local maxima", () => {
    const lst = node(1, node(3, node(2, node(4, node(0, empty())))));
    assert.deepStrictEqual(listToArray(keepLocalMaxima(lst)), [3, 4]);
  });

  it("should not set flat values to maxima", () => {
    const lst = node(1, node(2, node(2, node(1, empty()))));
    assert.deepStrictEqual(listToArray(keepLocalMaxima(lst)), []);
  });
});

describe("keepLocalMinima", () => {
  // Tests for keepLocalMinima go here

  it("should keep local minima", () => {
    const lst = node(3, node(1, node(2, node(0, node(4, empty())))));
    assert.deepStrictEqual(listToArray(keepLocalMinima(lst)), [1, 0]);
  });
});

describe("keepLocalMinimaAndMaxima", () => {
  // Tests for keepLocalMinimaAndMaxima go here

  it("should keep both minima and maxima", () => {
    const lst = node(1, node(3, node(2, node(4, node(0, empty())))));
    assert.deepStrictEqual(listToArray(keepLocalMinimaAndMaxima(lst)), [3, 2, 4]);
  });
});

describe("nonNegativeProducts", () => {
  // Tests for nonNegativeProducts go here

  it("should check example case", () => {
    const lst = node(2, node(3, node(-1, node(0.5, node(2, empty())))));
    assert.deepStrictEqual(listToArray(nonNegativeProducts(lst)), [2, 6, 0.5, 1]);
  });

  it("should check all nonnegative", () => {
    const lst = node(1, node(2, node(3, empty())));
    assert.deepStrictEqual(listToArray(nonNegativeProducts(lst)), [1, 2, 6]);
  });

  it("should check none nonnegative", () => {
    const lst = node(-1, node(-2, empty()));
    assert.deepStrictEqual(listToArray(nonNegativeProducts(lst)), []);
  });

  it("should reset after negative", () => {
    const lst = node(2, node(3, node(-1, node(4, empty()))));
    assert.deepStrictEqual(listToArray(nonNegativeProducts(lst)), [2, 6, 4]);
  });
});

describe("negativeProducts", () => {
  // Tests for negativeProducts go here

  it("should check example case", () => {
    const lst = node(-1, node(-2, node(-3, empty())));
    assert.deepStrictEqual(listToArray(negativeProducts(lst)), [-1, 2, -6]);
  });

  it("should check all negative", () => {
    const lst = node(-1, node(-2, node(-3, empty())));
    assert.deepStrictEqual(listToArray(negativeProducts(lst)), [-1, 2, -6]);
  });

  it("should check none negative", () => {
    const lst = node(1, node(2, node(0, empty())));
    assert.deepStrictEqual(listToArray(negativeProducts(lst)), []);
  });
});

describe("deleteFirst", () => {
  // Tests for deleteFirst go here

  it("should remove the first occurrence", () => {
    const lst = node(1, node(2, node(3, node(2, empty()))));
    assert.deepStrictEqual(listToArray(deleteFirst(lst, 2)), [1, 3, 2]);
  });

  it("should return the same when there is no occurrence", () => {
    const lst = node(1, node(2, node(3, empty())));
    assert.deepStrictEqual(listToArray(deleteFirst(lst, 9)), [1, 2, 3]);
  });

  it("should return empty list", () => {
    assert.deepStrictEqual(listToArray(deleteFirst(empty<number>(), 1)), []);
  });
});

describe("deleteLast", () => {
  // Tests for deleteLast go here

  it("should remove the last occurrence", () => {
    const lst = node(1, node(2, node(3, node(2, empty()))));
    assert.deepStrictEqual(listToArray(deleteLast(lst, 2)), [1, 2, 3]);
  });

  it("should return the same when there is no occurrence", () => {
    const lst = node(1, node(2, node(3, empty())));
    assert.deepStrictEqual(listToArray(deleteLast(lst, 9)), [1, 2, 3]);
  });

  it("return single element", () => {
    const lst = node(7, empty());
    assert.deepStrictEqual(listToArray(deleteLast(lst, 7)), []);
  });

  it("should delete only the last occurrence", () => {
    const lst = node(1, node(2, node(3, node(2, node(2, empty())))));
    assert.deepStrictEqual(listToArray(deleteLast(lst, 2)), [1, 2, 3, 2]);
  });
});

describe("squashList", () => {
  // Tests for squashList go here

  it("should replace the inner lists with sums", () => {
    assert.deepStrictEqual(
      listToArray(squashList(arrayToList([1, arrayToList([2, 3]), 4, arrayToList([]), arrayToList([10])]))),
      [1, 5, 4, 0, 10]
    );
  });

  it("should not change all the numbers", () => {
    assert.deepStrictEqual(listToArray(squashList(arrayToList([1, 2, 3]))), [1, 2, 3]);
  });

  it("should return empty list", () => {
    assert.deepStrictEqual(listToArray(squashList(arrayToList([]))), []);
  });
});
