/**
 * Saturates green color in each pixel of an image
 * @param img An image
 * @returns A new image where each pixel has the green channel set to its maximum.
 */
export function saturateGreen(img) {
    // TODO
    const image = img.copy();
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            const pixel = image.getPixel(x, y);
            pixel[1] = 255;
            image.setPixel(x, y, pixel);
        }
    }
    return image;
}
/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixel's channel has been
 *  set as the truncated average of the other two
 */
export function flipColors(img) {
    // TODO
    const image = img.copy();
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            const pixel = image.getPixel(x, y);
            const avg_red = Math.floor((pixel[1] + pixel[2]) / 2);
            const avg_green = Math.floor((pixel[0] + pixel[2]) / 2);
            const avg_blue = Math.floor((pixel[0] + pixel[1]) / 2);
            pixel[0] = avg_red;
            pixel[1] = avg_green;
            pixel[2] = avg_blue;
            image.setPixel(x, y, pixel);
        }
    }
    return image;
}
/**
 * Modifies the given `img` such that the value of each pixel
 * in the given line is the result of applying `func` to the
 * corresponding pixel of `img`. If `lineNo` is not a valid line
 * number, then `img` should not be modified.
 * @param img An image
 * @param lineNo A line number
 * @param func A color transformation function
 */
export function mapLine(img, lineNo, func) {
    // TODO
    if (lineNo < 0 || lineNo >= img.height) {
        return;
    }
    for (let x = 0; x < img.width; x++) {
        const old_color = img.getPixel(x, lineNo);
        const new_color = func(old_color);
        img.setPixel(x, lineNo, new_color);
    }
}
/**
 * The result must be a new image with the same dimensions as `img`.
 * The value of each pixel in the new image should be the result of
 * applying `func` to the corresponding pixel of `img`.
 * @param img An image
 * @param func A color transformation function
 */
export function imageMap(img, func) {
    // TODO
    const image = img.copy();
    for (let y = 0; y < img.height; y++) {
        mapLine(image, y, func);
    }
    return image;
}
/**
 * Saturates green color in an image
 * @param img An image
 * @returns A new image where each pixel has the green channel has been set to its maximum.
 */
export function mapToGreen(img) {
    // TODO
    return imageMap(img, (pixel) => {
        return [pixel[0], 255, pixel[2]];
    });
}
/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixels channel has been
 *  set as the truncated average of the other two
 */
export function mapFlipColors(img) {
    // TODO
    return imageMap(img, (pixel) => {
        const avg_red = Math.floor((pixel[1] + pixel[2]) / 2);
        const avg_green = Math.floor((pixel[0] + pixel[2]) / 2);
        const avg_blue = Math.floor((pixel[0] + pixel[1]) / 2);
        return [avg_red, avg_green, avg_blue];
    });
}
//# sourceMappingURL=imageProcessing.js.map