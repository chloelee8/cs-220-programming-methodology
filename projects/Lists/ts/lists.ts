import { List, node, empty } from "../include/lists.js";

export function insertOrdered(lst: List<number>, el: number): List<number> {
  if (lst.isEmpty()) {
    return node(el, empty());
  }

  if (el <= lst.head()) {
    return node(el, lst);
  }

  return node(lst.head(), insertOrdered(lst.tail(), el));
}

export function everyNRev<T>(lst: List<T>, n: number): List<T> {
  type Acc = { index: number; out: List<T> };

  const acc0: Acc = { index: 0, out: empty() };

  const result = lst.reduce<Acc>((acc, e) => {
    const nextIndex = acc.index + 1;
    if (nextIndex % n === 0) {
      return { index: nextIndex, out: node(e, acc.out) };
    }
    return { index: nextIndex, out: acc.out };
  }, acc0);

  return result.out;
}

function reverse<T>(lst: List<T>): List<T> {
  function go(c: List<T>, a: List<T>): List<T> {
    if (c.isEmpty()) return a;
    return go(c.tail(), node(c.head(), a));
  }
  return go(lst, empty());
}

export function everyNCond<T>(lst: List<T>, n: number, cond: (e: T) => boolean): List<T> {
  function go(c: List<T>, seen: number, out_rev: List<T>): List<T> {
    if (c.isEmpty()) return reverse(out_rev);

    const h = c.head();

    if (!cond(h)) {
      return go(c.tail(), seen, out_rev);
    }

    const seen2 = seen + 1;

    if (seen2 % n === 0) {
      return go(c.tail(), seen2, node(h, out_rev));
    }

    return go(c.tail(), seen2, out_rev);
  }

  return go(lst, 0, empty());
}

export function keepTrendMiddles(
  lst: List<number>,
  allSatisfy: (prev: number, curr: number, next: number) => boolean
): List<number> {
  if (lst.isEmpty()) return empty();

  const firstTail = lst.tail();
  if (firstTail.isEmpty()) return empty();

  const secondTail = firstTail.tail();
  if (secondTail.isEmpty()) return empty();

  function go(prev: number, c_node: List<number>): List<number> {
    if (c_node.isEmpty()) return empty();

    const nextNode = c_node.tail();
    if (nextNode.isEmpty()) return empty();

    const c = c_node.head();
    const next = nextNode.head();

    const rest = go(c, nextNode);

    if (allSatisfy(prev, c, next)) {
      return node(c, rest);
    }

    return rest;
  }

  return go(lst.head(), firstTail);
}

export function keepLocalMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (p, c, n) => p < c && c > n);
}

export function keepLocalMinima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (p, c, n) => p > c && c < n);
}

export function keepLocalMinimaAndMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (p, c, n) => (p < c && c > n) || (p > c && c < n));
}

function streakProducts(lst: List<number>, qualifies: (x: number) => boolean): List<number> {
  function go(c: List<number>, streak: number, out_rev: List<number>): List<number> {
    if (c.isEmpty()) return reverse(out_rev);

    const x = c.head();

    if (qualifies(x)) {
      const newProd = streak * x;
      return go(c.tail(), newProd, node(newProd, out_rev));
    }

    return go(c.tail(), 1, out_rev);
  }

  return go(lst, 1, empty());
}

export function nonNegativeProducts(lst: List<number>): List<number> {
  return streakProducts(lst, x => x >= 0);
}

export function negativeProducts(lst: List<number>): List<number> {
  return streakProducts(lst, x => x < 0);
}

export function deleteFirst<T>(lst: List<T>, el: T): List<T> {
  if (lst.isEmpty()) return lst;

  if (lst.head() === el) {
    return lst.tail();
  }

  return node(lst.head(), deleteFirst(lst.tail(), el));
}

export function deleteLast<T>(lst: List<T>, el: T): List<T> {
  function go(c: List<T>): { out: List<T>; deleted: boolean } {
    if (c.isEmpty()) {
      return { out: c, deleted: false };
    }

    const rec = go(c.tail());

    if (rec.deleted) {
      return { out: node(c.head(), rec.out), deleted: true };
    }

    if (c.head() === el) {
      return { out: c.tail(), deleted: true };
    }

    return { out: c, deleted: false };
  }

  return go(lst).out;
}

export function squashList(lst: List<number | List<number>>): List<number> {
  function sum(inner: List<number>): number {
    return inner.reduce<number>((a, x) => a + x, 0);
  }

  if (lst.isEmpty()) return empty();

  const h = lst.head();

  const value = typeof h === "number" ? h : sum(h);

  return node(value, squashList(lst.tail()));
}
