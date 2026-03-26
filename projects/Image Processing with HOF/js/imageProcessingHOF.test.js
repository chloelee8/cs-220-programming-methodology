import assert from "assert";
import { COLORS, Image } from "../include/image.js";
import { imageMapCoord, imageMapIf, mapWindow, isGrayish, makeGrayish, pixelBlur, imageBlur, } from "./imageProcessingHOF.js";
// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual, expected, error = 1) {
    [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}
describe("imageMapCoord", () => {
    function identity(img, x, y) {
        return img.getPixel(x, y);
    }
    it("should return a different image", () => {
        const input = Image.create(10, 10, COLORS.WHITE);
        const output = imageMapCoord(input, identity);
        assert(input !== output);
    });
    // More tests for imageMapCoord go here.
    it("should copy pixels correctly", () => {
        const input = Image.create(5, 5, COLORS.BLACK);
        input.setPixel(2, 3, [10, 20, 30]);
        const output = imageMapCoord(input, identity);
        const p1 = output.getPixel(2, 3);
        assert(p1[0] === 10);
        assert(p1[1] === 20);
        assert(p1[2] === 30);
        const p2 = output.getPixel(0, 0);
        assert(p2[0] === 0);
        assert(p2[1] === 0);
        assert(p2[2] === 0);
    });
});
describe("imageMapIf", () => {
    // More tests for imageMapIf go here
    it("shouldn't change image when condition is always false", () => {
        const img = Image.create(3, 3, COLORS.BLACK);
        img.setPixel(1, 1, [10, 20, 30]);
        const out = imageMapIf(img, () => false, () => [255, 255, 255]);
        const p = out.getPixel(1, 1);
        assert(p[0] === 10);
        assert(p[1] === 20);
        assert(p[2] === 30);
    });
    it("should change all pixels when condition is always true", () => {
        const image = Image.create(2, 2, COLORS.BLACK);
        const out = imageMapIf(image, () => true, (p) => [p[0] + 1, p[1] + 1, p[2] + 1]);
        const p = out.getPixel(0, 0);
        assert(p[0] === 1);
        assert(p[1] === 1);
        assert(p[2] === 1);
    });
});
describe("mapWindow", () => {
    // More tests for mapWindow go here
    it("should apply function inside window", () => {
        const image = Image.create(4, 4, COLORS.BLACK);
        const out = mapWindow(image, [1, 2], [1, 2], () => [7, 7, 7]);
        const inside = out.getPixel(1, 1);
        assert(inside[0] === 7);
        const outside = out.getPixel(0, 0);
        assert(outside[0] === 0);
    });
    it("should include values at the edge", () => {
        const image = Image.create(3, 3, COLORS.BLACK);
        const out = mapWindow(image, [0, 1], [0, 1], () => [8, 8, 8]);
        const edge = out.getPixel(1, 1);
        assert(edge[0] === 8);
    });
});
describe("isGrayish", () => {
    // More tests for isGrayish go here
    it("should return true when difference is less than 85", () => {
        assert(isGrayish([10, 20, 30]));
    });
    it("should return true when difference is equals 85", () => {
        assert(isGrayish([0, 85, 85]));
    });
    it("should return false when difference is greater than 85", () => {
        assert(isGrayish([0, 0, 100]));
    });
});
describe("makeGrayish", () => {
    // More tests for makeGrayish go here
    it("shouldn't change gray pixels", () => {
        const image = Image.create(1, 1, COLORS.BLACK);
        image.setPixel(0, 0, [100, 105, 110]);
        const out = makeGrayish(image);
        const p = out.getPixel(0, 0);
        assert(p[0] === 100);
        assert(p[1] === 105);
        assert(p[2] === 110);
    });
    it("should change non-grayish pixel to gray", () => {
        const image = Image.create(1, 1, COLORS.BLACK);
        image.setPixel(0, 0, [200, 50, 10]);
        const out = makeGrayish(image);
        const p = out.getPixel(0, 0);
        const expected = Math.floor((200 + 50 + 10) / 3);
        expectColorToBeCloseTo(p, [expected, expected, expected]);
    });
});
describe("pixelBlur", () => {
    // Tests for pixelBlur go here
    it("should blur center pixel using 9 neighbors", () => {
        const img = Image.create(3, 3, COLORS.BLACK);
        img.setPixel(1, 1, [90, 90, 90]);
        const blur = pixelBlur(img, 1, 1);
        const expected = Math.floor(90 / 9);
        expectColorToBeCloseTo(blur, [expected, expected, expected]);
    });
    it("should work for 1x1 image", () => {
        const img = Image.create(1, 1, COLORS.BLACK);
        img.setPixel(0, 0, [50, 60, 70]);
        const blur = pixelBlur(img, 0, 0);
        assert(blur[0] === 50);
        assert(blur[1] === 60);
        assert(blur[2] === 70);
    });
    it("should blur corner pixel using less pixels", () => {
        const img = Image.create(2, 2, COLORS.BLACK);
        img.setPixel(0, 0, [100, 100, 100]);
        const blur = pixelBlur(img, 0, 0);
        // Only 4 pixels contribute in a 2x2 corner case
        const expected = Math.floor(100 / 4);
        expectColorToBeCloseTo(blur, [expected, expected, expected]);
    });
});
describe("imageBlur", () => {
    // Tests for imageBlur go here
    it("should return a new image", () => {
        const image = Image.create(2, 2, COLORS.BLACK);
        const out = imageBlur(image);
        assert(image !== out);
    });
    it("should blur whole image", () => {
        const image = Image.create(2, 2, COLORS.BLACK);
        image.setPixel(0, 0, [100, 100, 100]);
        const out = imageBlur(image);
        const expected = pixelBlur(image, 0, 0);
        const actual = out.getPixel(0, 0);
        expectColorToBeCloseTo(actual, expected);
    });
});
//# sourceMappingURL=imageProcessingHOF.test.js.map