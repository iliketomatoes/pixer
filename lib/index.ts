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
		stripes: 4
	};

	export function init() {

		let targets: NodeListOf<Element> = document.querySelectorAll('canvas[data-pixer]');
		let options: any;

		for (let el of targets) {
			if (el.tagName.toLowerCase() === 'canvas') {

				// If elements are already initialized
				if (el.hasAttribute('data-pixer-id')) continue;

				options = el.getAttribute('data-pixer');
				options = options != '' ? JSON.parse(options) : {};

				// Reset data-pixer attribute
				el.setAttribute('data-pixer', '');

				setupCanvas(<HTMLCanvasElement>el, options);
			} else {
				console.error('Pixer.js: target must be a canvas element');
			}

		}

	}

	function setupCanvas(canvas: HTMLCanvasElement, options: any) {

		let settings = Object.assign(defaults, options);

		let canvasId = 'pixer_' + idCursor;
		canvas.setAttribute('data-pixer-id', canvasId);

		// Stringify settings so we can put them into the HTML data attribute
		canvas.setAttribute('data-pixer-opts', JSON.stringify(settings));

		// Icrease the cursor
		idCursor++;

		// Store the id
		IDs.push(canvasId);

		reflow(canvas);
	}

	function reflow(canvas: HTMLCanvasElement) {
		let canvasSize = setSize(canvas);
		clearCanvas(canvas, canvasSize);
		paint(canvas, canvasSize, defaults);
	}

	function clearCanvas(canvas: HTMLCanvasElement, canvasSize: PixerSize) {
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
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
			height: height
		};
	}

	function getSettings(options: PixerOptions) {
		Object.assign(this.defaults, options);
	}

	function setSquares(canvas: HTMLCanvasElement, size: PixerSize, colors: PixerColors, options: PixerOptions) {

		const stripes = options.stripes;

		const squareDiagonal: number = size.height / (stripes - 1);

		const squareSide: number = squareDiagonal / Math.SQRT2;

		const squaresPerStripe: number = Math.round(size.width / squareDiagonal);

		const ctx = canvas.getContext("2d");

		for (let j = 0; j < stripes; j++) {

			let startingY = (squareDiagonal / 2) * j;

			let gradientWeight = getGradientWeight(j + 1, stripes);
			let color1 = colourGradientor(gradientWeight.odd, colors.nextRGB, colors.previousRGB);
			let color2 = colourGradientor(gradientWeight.even, colors.nextRGB, colors.previousRGB);

			for (let i = 0; i <= squaresPerStripe; i++) {

				let startingX = (squareDiagonal / 2 * ((i * 2) + 1)) - ((j % 2) * (squareDiagonal / 2));

				ctx.save();

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

				ctx.translate(startingX, startingY);
				ctx.rotate(Math.PI / 4);
				ctx.fillRect(0, 0, squareSide, squareSide);
				ctx.restore();
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
