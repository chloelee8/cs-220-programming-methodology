import assert from "assert";
import { COLORS, Image, Color } from "../include/image.js";
import { flipColors, saturateGreen, mapLine, imageMap, mapToGreen, mapFlipColors } from "./imageProcessing.js";

describe("saturateGreen", () => {
  it("should maximize green in the upper left corner", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(0, 0);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");

    // or alternatively, using jest, if you'd like
    // https://jestjs.io/docs/expect#toequalvalue
    // Use expect with .toEqual to compare recursively all properties of object instances (also known as "deep" equality).

    expect(p).toEqual([0, 255, 0]);

    // This will produce output showing the exact differences between the two objects, which is really helpful
    // for debugging. However, again, please use the simpler assert syntax if this is too confusing.
    // Focus on making your tests well written and correct, rather than using one syntax or another.
  });

  it("should maximize green in the center", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(5, 7);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });

  // More tests for saturateGreen go here.

  it("should not change red and blue", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    blackImage.setPixel(1, 1, [10, 20, 15]);
    const result = saturateGreen(blackImage);

    const p = result.getPixel(1, 1);
    assert(p[0] === 10);
    assert(p[1] === 255);
    assert(p[2] === 15);
  });
});

describe("flipColors", () => {
  it("should correctly flip top left corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(0, 0);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });

  // More tests for flipColors go here.
  it("should correctly flip top right corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    whiteImage.setPixel(9, 0, [20, 40, 80]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(9, 0);

    assert(p[0] === 60);
    assert(p[1] === 50);
    assert(p[2] === 30);
  });
});

describe("mapLine", () => {
  // Tests for mapLine go here.
  it("should correctly change color in row 3", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);

    for (let x = 0; x < whiteImage.width; x++) {
      whiteImage.setPixel(x, 3, [20, 40, 80]);
    }
    mapLine(whiteImage, 3, (p: Color) => [p[0] + 10, p[1] + 10, p[2] + 10]);
    const p = whiteImage.getPixel(2, 3);

    assert(p[0] === 30);
    assert(p[1] === 50);
    assert(p[2] === 90);
  });
});

describe("imageMap", () => {
  // Tests for imageMap go here.
  it("should correctly change color for all the pixels", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    whiteImage.setPixel(3, 3, [20, 40, 80]);
    const newImage = imageMap(whiteImage, (p: Color) => [p[0], 60, p[2]]);
    const p = newImage.getPixel(3, 3);

    assert(p[0] === 20);
    assert(p[1] === 60);
    assert(p[2] === 80);

    const originalImage = whiteImage.getPixel(3, 3);
    assert(originalImage[1] === 40);
  });
});

describe("mapToGreen", () => {
  // Tests for mapToGreen go here.
  it("should maximize green using imageMap", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    blackImage.setPixel(3, 3, [20, 40, 80]);

    const result = mapToGreen(blackImage);
    const p = result.getPixel(3, 3);

    assert(p[0] === 20);
    assert(p[1] === 255);
    assert(p[2] === 80);
  });
});

describe("mapFlipColors", () => {
  // Tests for mapFlipColors go here.
  it("should correctly flip colors using imageMap", () => {
    const whiteImage = Image.create(10, 15, COLORS.WHITE);
    whiteImage.setPixel(3, 3, [20, 40, 80]);

    const result = mapFlipColors(whiteImage);
    const p = result.getPixel(3, 3);

    assert(p[0] === 60);
    assert(p[1] === 50);
    assert(p[2] === 30);
  });
});
