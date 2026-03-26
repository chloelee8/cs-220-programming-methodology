export function imageMapCoord(img, func) {
    // TODO
    const image = img.copy();
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            const newColor = func(img, x, y);
            image.setPixel(x, y, newColor);
        }
    }
    return image; // Dummy code to make the autograder work, replace as necessary.
}
export function imageMapIf(img, cond, func) {
    // TODO
    return imageMapCoord(img, (img, x, y) => {
        const originalColor = img.getPixel(x, y);
        if (cond(img, x, y)) {
            return func(originalColor);
        }
        return originalColor;
    });
    // Dummy code to make the autograder work, replace as necessary.
}
export function mapWindow(img, xInterval, // Assumed to be a two element array containing [x_min, x_max]
yInterval, // Assumed to be a two element array containing [y_min, y_max]
func) {
    // TODO
    const xmin = xInterval[0];
    const xmax = xInterval[1];
    const ymin = yInterval[0];
    const ymax = yInterval[1];
    return imageMapIf(img, (img, x, y) => x >= xmin && x <= xmax && y >= ymin && y <= ymax, func);
    // Dummy code to make the autograder work, replace as necessary.
}
export function isGrayish(p) {
    // TODO
    const r = p[0];
    const g = p[1];
    const b = p[2];
    return Math.max(r, g, b) - Math.min(r, g, b) <= 85; // Dummy code to make the autograder work, replace as necessary.
}
export function makeGrayish(img) {
    // TODO
    return imageMapIf(img, (img, x, y) => !isGrayish(img.getPixel(x, y)), (p) => {
        const m = Math.floor((p[0] + p[1] + p[2]) / 3);
        return [m, m, m];
    });
    // Dummy code to make the autograder work, replace as necessary.
}
export function pixelBlur(img, x, y) {
    // TODO
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let count = 0;
    for (let ny = y - 1; ny <= y + 1; ny++) {
        for (let nx = x - 1; nx <= x + 1; nx++) {
            if (nx >= 0 && nx < img.width && ny >= 0 && ny < img.height) {
                const p = img.getPixel(nx, ny);
                sumR += p[0];
                sumG += p[1];
                sumB += p[2];
                count++;
            }
        }
    }
    return [Math.floor(sumR / count), Math.floor(sumG / count), Math.floor(sumB / count)];
}
// Dummy code to make the autograder work, replace as necessary.}
export function imageBlur(img) {
    // TODO
    return imageMapCoord(img, (img, x, y) => {
        return pixelBlur(img, x, y);
    });
}
// Dummy code to make the autograder work, replace as necessary.
//# sourceMappingURL=imageProcessingHOF.js.map