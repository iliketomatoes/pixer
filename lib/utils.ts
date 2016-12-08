import { PixerGradientWeight } from './core';

// http://stackoverflow.com/a/24253254/1550955
export function colourGradientor(p: number, first_color: string, second_color: string): string {

	let w = p * 2 - 1;

	let rgb_beginning = turnRgbIntoArray(first_color);
	let rgb_end = turnRgbIntoArray(second_color);

	let w1 = (w + 1) / 2.0;
	let w2 = 1 - w1;

	let rgb = [Math.round(rgb_beginning[0] * w1 + rgb_end[0] * w2),
		Math.round(rgb_beginning[1] * w1 + rgb_end[1] * w2),
		Math.round(rgb_beginning[2] * w1 + rgb_end[2] * w2)];
	return turnArrayIntoRgb(rgb);
};

export function getBgColor(el: Element): string {
	return window.getComputedStyle(el, null).getPropertyValue('background-color');
}

// http://stackoverflow.com/a/1183906/1550955
export function turnRgbIntoArray(rgb: string): number[] {
	const numberPattern = /\d+/g;
	return rgb.match(numberPattern).map(n => parseInt(n, 10));
}

export function turnArrayIntoRgb(rgbArr: number[]): string {
	return `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`;
}

export function getGradientWeight(lineNumber: number, totalLines: number): PixerGradientWeight {
	const startingEdge = lineNumber - 1;
	const endingEdge = lineNumber;
	const startingEdgeRatio = startingEdge / totalLines;
	const endingEdgeRatio = endingEdge / totalLines;

	let deltaRatio = endingEdgeRatio - startingEdgeRatio;

	return {
		even: (startingEdgeRatio + (deltaRatio * 0.33)),
		odd: (startingEdgeRatio + (deltaRatio * 0.66))
	};
}
