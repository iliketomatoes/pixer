import { colourGradientor, getBgColor, getGradientWeight } from './utils';
var Pixer;
(function (Pixer) {
    let idCursor = 0;
    let IDs = [];
    let defaults = {
        minSquareWidth: 100,
        stripes: 4
    };
    function init() {
        let targets = document.querySelectorAll('canvas[data-pixer]');
        for (let el of targets) {
            if (el.tagName.toLowerCase() === 'canvas') {
                // If elements are already initialized
                if (el.hasAttribute('data-pixer-id'))
                    continue;
                setupCanvas(el);
            }
        }
    }
    Pixer.init = init;
    function setupCanvas(el) {
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
    function paint(canvas, canvasSize, options) {
        let colors = setBgColor(canvas, canvasSize, options);
        setSquares(canvas, canvasSize, colors, options);
    }
    function setBgColor(canvas, size, options) {
        let colors = {
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
    function setSize(canvas) {
        let canvasSize = getSize(canvas);
        canvas.setAttribute('width', canvasSize.width.toString());
        canvas.setAttribute('height', canvasSize.height.toString());
        return canvasSize;
    }
    function getSize(canvas) {
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;
        return {
            width: width,
            height: height,
            ratio: width / height
        };
    }
    function getSettings(options) {
        Object.assign(this.defaults, options);
    }
    function setSquares(canvas, size, colors, options) {
        const stripes = options.stripes;
        const squareDiagonal = size.height / (stripes - 1);
        const squareSide = squareDiagonal / Math.SQRT2;
        const squaresPerStripe = Math.round(size.width / squareDiagonal);
        const ctx = canvas.getContext("2d");
        for (let j = 0; j < stripes; j++) {
            let startingY = (squareDiagonal / 2) * j;
            let gradientWeight = getGradientWeight(j + 1, stripes);
            let color1 = colourGradientor(gradientWeight.odd, colors.nextRGB, colors.previousRGB);
            let color2 = colourGradientor(gradientWeight.even, colors.nextRGB, colors.previousRGB);
            for (let i = 0; i <= squaresPerStripe; i++) {
                let startingX = (squareDiagonal / 2 * ((i * 2) + 1)) - (j % 2) * (squareDiagonal / 2);
                ctx.save();
                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        ctx.fillStyle = color1;
                    }
                    else {
                        ctx.fillStyle = color2;
                    }
                }
                else {
                    if (j % 2 === 0) {
                        ctx.fillStyle = color2;
                    }
                    else {
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
    class API {
        constructor() { }
        static get Instance() {
            return this._instance || (this._instance = new this());
        }
    }
    Pixer.API = API;
})(Pixer || (Pixer = {}));
function pixer() {
    Pixer.init();
    return Pixer.API;
}
export default pixer;
