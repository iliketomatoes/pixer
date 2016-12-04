import { PixerOptions,
	PixerSize,
	PixerColors,
	colourGradientor,
 	getBgColor,
 	turnRgbIntoArray,
 	getGradientWeight } from './utils';

namespace Pixer {

	let idCursor: number = 0;

	let IDs: string[] = [];

	let defaults: PixerOptions = {
		minSquareWidth: 100,
		stripes: 4
	};

	export function init() {

		let targets: NodeListOf<Element> = document.querySelectorAll('canvas[data-pixer]');

		for (let el of targets) {

			if (el.tagName.toLowerCase() === 'canvas') {
				// If elements are already initialized
				if (el.hasAttribute('data-pixer-id')) continue;

				setupCanvas(<HTMLCanvasElement>el);
			}

		}

	}

	function setupCanvas(el: HTMLCanvasElement) {

		let canvasSize = setSize(el);

		// Stringify options so we can put them into the HTML data attribute
		// let options = JSON.stringify(settings);
		let defaultSettings = JSON.stringify(defaults);

		let canvasId = 'pixer_' + idCursor;

		el.setAttribute('data-pixer-id', canvasId);
		el.setAttribute('data-pixer-opts', defaultSettings);

		// Icrease the cursor
		idCursor++;

		// Store the id
		IDs.push(canvasId);

		paint(el, canvasSize, defaults);
	}

	function paint(canvas: HTMLCanvasElement, canvasSize: PixerSize, options: PixerOptions) {

		let colors = setBgColor(canvas, canvasSize, options);

		setSquares(canvas, canvasSize, colors, options);
	}

	function setBgColor(canvas: HTMLCanvasElement, size: PixerSize, options: PixerOptions): PixerColors {

		let colors: PixerColors = {
			previousRGB: getBgColor(canvas.previousElementSibling),
			nextRGB: getBgColor(canvas.nextElementSibling)
		};

		const ctx = canvas.getContext("2d");

		ctx.fillStyle = colors.previousRGB;
		ctx.fillRect(0, 0, size.width, size.height / 2);

		ctx.fillStyle = colors.nextRGB;
		ctx.fillRect(0, size.height / 2, size.width, size.height / 2);

		return colors;
	}

	function setSize(canvas: HTMLCanvasElement) {
		let canvasSize = getSize(canvas);

		canvas.setAttribute('width', canvasSize.width.toString());
		canvas.setAttribute('height', canvasSize.height.toString());

		return canvasSize;
	}

	function getSize(canvas: HTMLCanvasElement): PixerSize {
		let width: number = canvas.clientWidth;
		let height: number = canvas.clientHeight;

		return {
			width: width,
			height: height,
			ratio: width / height
		};
	}

	function getSettings(options: PixerOptions) {
		Object.assign(this.defaults, options);
	}

	function setSquares(canvas: HTMLCanvasElement, size: PixerSize, colors: PixerColors, options: PixerOptions) {

		const stripes = options.stripes;

		const squareSide: number = Math.round(size.height / options.stripes);

		const squaresPerStripe: number = Math.round(size.width / squareSide);

		const ctx = canvas.getContext("2d");

		for (let j = 0; j < stripes; j++) {

			let gradientWeight = getGradientWeight(j+1, stripes);
			console.log(gradientWeight);
			let color1 = colourGradientor(gradientWeight.odd, colors.nextRGB, colors.previousRGB);
			let color2 = colourGradientor(gradientWeight.even, colors.nextRGB, colors.previousRGB);

			for (let i = 0; i <= squaresPerStripe; i++) {

				let x = squareSide * i;

				if (i % 2 === 0) {
					if (j % 2 === 0) {
						ctx.fillStyle = color1;
					} else {
						ctx.fillStyle = color2;
					}

				} else {
					if (j % 2 === 0) {
						ctx.fillStyle = color2;
					} else {
						ctx.fillStyle = color1;
					}

				}

				ctx.fillRect(x, j * squareSide, squareSide, squareSide);
			}

		}

	}

	export class API {
		private static _instance: API;

		private constructor() { }

		public static get Instance(): API {
			return this._instance || (this._instance = new this());
		}
	}
}

function pixer(): Pixer.API {

	Pixer.init();

	return Pixer.API;

}

export default pixer;
