// http://stackoverflow.com/a/24253254/1550955
export function colourGradientor(p, first_color, second_color) {
    let w = p * 2 - 1;
    let rgb_beginning = turnRgbIntoArray(first_color);
    let rgb_end = turnRgbIntoArray(second_color);
    let w1 = (w + 1) / 2.0;
    let w2 = 1 - w1;
    let rgb = [Math.round(rgb_beginning[0] * w1 + rgb_end[0] * w2),
        Math.round(rgb_beginning[1] * w1 + rgb_end[1] * w2),
        Math.round(rgb_beginning[2] * w1 + rgb_end[2] * w2)];
    return turnArrayIntoRgb(rgb);
}
;
export function getBgColor(el) {
    return window.getComputedStyle(el, null).getPropertyValue('background-color');
}
// http://stackoverflow.com/a/1183906/1550955
export function turnRgbIntoArray(rgb) {
    const numberPattern = /\d+/g;
    return rgb.match(numberPattern).map(n => parseInt(n));
}
export function turnArrayIntoRgb(rgbArr) {
    return `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`;
}
export function getGradientWeight(lineNumber, totalLines) {
    const startingEdge = lineNumber - 1;
    const endingEdge = lineNumber;
    const startingEdgeRatio = startingEdge / totalLines;
    const endingEdgeRatio = endingEdge / totalLines;
    let deltaRatio = endingEdgeRatio - startingEdgeRatio;
    return {
        even: startingEdgeRatio + (deltaRatio * 0.33),
        odd: startingEdgeRatio + (deltaRatio * 0.66)
    };
}
