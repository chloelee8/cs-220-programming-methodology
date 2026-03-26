import { node, empty } from "../include/lists.js";
export function insertOrdered(lst, el) {
    if (lst.isEmpty()) {
        return node(el, empty());
    }
    if (el <= lst.head()) {
        return node(el, lst);
    }
    return node(lst.head(), insertOrdered(lst.tail(), el));
}
export function everyNRev(lst, n) {
    const acc0 = { index: 0, out: empty() };
    const result = lst.reduce((acc, e) => {
        const nextIndex = acc.index + 1;
        if (nextIndex % n === 0) {
            return { index: nextIndex, out: node(e, acc.out) };
        }
        return { index: nextIndex, out: acc.out };
    }, acc0);
    return result.out;
}
function reverse(lst) {
    function go(c, a) {
        if (c.isEmpty())
            return a;
        return go(c.tail(), node(c.head(), a));
    }
    return go(lst, empty());
}
export function everyNCond(lst, n, cond) {
    function go(c, seen, out_rev) {
        if (c.isEmpty())
            return reverse(out_rev);
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
export function keepTrendMiddles(lst, allSatisfy) {
    if (lst.isEmpty())
        return empty();
    const firstTail = lst.tail();
    if (firstTail.isEmpty())
        return empty();
    const secondTail = firstTail.tail();
    if (secondTail.isEmpty())
        return empty();
    function go(prev, c_node) {
        if (c_node.isEmpty())
            return empty();
        const nextNode = c_node.tail();
        if (nextNode.isEmpty())
            return empty();
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
export function keepLocalMaxima(lst) {
    return keepTrendMiddles(lst, (p, c, n) => p < c && c > n);
}
export function keepLocalMinima(lst) {
    return keepTrendMiddles(lst, (p, c, n) => p > c && c < n);
}
export function keepLocalMinimaAndMaxima(lst) {
    return keepTrendMiddles(lst, (p, c, n) => (p < c && c > n) || (p > c && c < n));
}
function streakProducts(lst, qualifies) {
    function go(c, streak, out_rev) {
        if (c.isEmpty())
            return reverse(out_rev);
        const x = c.head();
        if (qualifies(x)) {
            const newProd = streak * x;
            return go(c.tail(), newProd, node(newProd, out_rev));
        }
        return go(c.tail(), 1, out_rev);
    }
    return go(lst, 1, empty());
}
export function nonNegativeProducts(lst) {
    return streakProducts(lst, x => x >= 0);
}
export function negativeProducts(lst) {
    return streakProducts(lst, x => x < 0);
}
export function deleteFirst(lst, el) {
    if (lst.isEmpty())
        return lst;
    if (lst.head() === el) {
        return lst.tail();
    }
    return node(lst.head(), deleteFirst(lst.tail(), el));
}
export function deleteLast(lst, el) {
    function go(c) {
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
export function squashList(lst) {
    function sum(inner) {
        return inner.reduce((a, x) => a + x, 0);
    }
    if (lst.isEmpty())
        return empty();
    const h = lst.head();
    const value = typeof h === "number" ? h : sum(h);
    return node(value, squashList(lst.tail()));
}
//# sourceMappingURL=lists.js.map