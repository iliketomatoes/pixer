import { colourGradientor, getBgColor, getGradientWeight } from './utils';
var Pixer;
(function (Pixer) {
    let idCursor = 0;
    let IDs = [];
    let defaults = {
        stripes: 4
    };
    function init() {
        let targets = document.querySelectorAll('canvas[data-pixer]');
        let options;
        let debounced = null;
        let delay = 400;
        for (let el of targets) {
            if (el.tagName.toLowerCase() === 'canvas') {
                // If elements are already initialized
                if (el.hasAttribute('data-pixer-id'))
                    continue;
                options = el.getAttribute('data-pixer');
                options = options != '' ? JSON.parse(options) : {};
                // Reset data-pixer attribute
                el.setAttribute('data-pixer', '');
                setupCanvas(el, options);
            }
            else {
                console.error('Pixer.js: target must be a canvas element');
            }
        }
        window.addEventListener('resize', function () {
            clearTimeout(debounced);
            debounced = setTimeout(reflowAll, delay);
        });
    }
    Pixer.init = init;
    function setupCanvas(canvas, options) {
        let settings, canvasId;
        settings = Object.assign(defaults, options);
        canvasId = 'pixer_' + idCursor;
        canvas.setAttribute('data-pixer-id', canvasId);
        // Stringify settings so we can put them into the HTML data attribute
        canvas.setAttribute('data-pixer-opts', JSON.stringify(settings));
        // Icrease the cursor
        idCursor++;
        // Store the id
        IDs.push(canvasId);
        reflow(canvas, settings);
    }
    function reflowAll() {
        let target, options, settings;
        for (let id of IDs) {
            target = document.querySelector(`canvas[data-pixer-id="${id}"]`);
            options = JSON.parse(target.getAttribute('data-pixer-opts'));
            settings = Object.assign(defaults, options);
            reflow(target, settings);
        }
    }
    function reflow(canvas, settings) {
        let canvasSize = setSize(canvas);
        clearCanvas(canvas, canvasSize);
        paint(canvas, canvasSize, settings);
    }
    function clearCanvas(canvas, canvasSize) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            height: height
        };
    }
    function getSettings(options) {
        Object.assign(this.defaults, options);
    }
    function setSquares(canvas, size, colors, options) {
        const stripes = options.stripes;
        const squareDiagonal = stripes > 2 ? (size.height / (stripes - 1)) : (size.height / stripes);
        const squareSide = squareDiagonal / Math.SQRT2;
        const squaresPerStripe = Math.round(size.width / squareDiagonal);
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
        static reflow() {
            reflowAll();
        }
    }
    Pixer.API = API;
})(Pixer || (Pixer = {}));
function pixer() {
    Pixer.init();
    return Pixer.API;
}
export default pixer;
