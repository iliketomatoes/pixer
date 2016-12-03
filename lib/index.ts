import { PixerOptions } from './utils';

namespace Pixer {

	let idCursor: number = 0;

	let IDs: string[] = [];

	let defaults: PixerOptions = {
		minSquareWidth: 100
	};

	export function init(el: Element) {

		// Stringify options so we can put them into the HTML data attribute
		// let options = JSON.stringify(settings);
		let defaultSettings = JSON.stringify(defaults);

		let canvasId = 'pixer_' + idCursor;

		let canvas = document.createElement('canvas');

		canvas.setAttribute('data-pixer-id', canvasId);
		canvas.setAttribute('data-pixer-opts', defaultSettings);

		// Icrease the cursor
		idCursor++;

		// Store the id
		IDs.push(canvasId);

		setScene(canvas);

		el.appendChild(canvas);

	}


	function getSettings(options: PixerOptions) {
		Object.assign(this.defaults, options);
	}

	function setScene(canvas: HTMLCanvasElement) {
		if (canvas.getContext) {
			var ctx = canvas.getContext("2d");

			ctx.fillStyle = "rgb(200,0,0)";
			ctx.fillRect (10, 10, 50, 50);

			ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
			ctx.fillRect (30, 30, 50, 50);
		}
	}

	export class API {
		private static _instance: API;

		private constructor() {}

		public static get Instance(): API
		{
			return this._instance || (this._instance = new this());
		}
	}
}

function pixer(): Pixer.API {

	let targets: NodeListOf<Element> = document.querySelectorAll('[data-pixer]');

	for(let el of targets) {

		let child = <Element>el.firstChild;

		// If elements are already initialized
		if (child && child.tagName === 'canvas' && child.hasAttribute('data-pixer-id')) continue;

		Pixer.init(el);
	}

	return Pixer.API;

}

export default pixer;
