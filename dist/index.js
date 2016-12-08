(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.pixer = factory());
}(this, (function () { 'use strict';

// http://stackoverflow.com/a/24253254/1550955
function colourGradientor(p, first_color, second_color) {
    var w = p * 2 - 1;
    var rgb_beginning = turnRgbIntoArray(first_color);
    var rgb_end = turnRgbIntoArray(second_color);
    var w1 = (w + 1) / 2.0;
    var w2 = 1 - w1;
    var rgb = [Math.round(rgb_beginning[0] * w1 + rgb_end[0] * w2), Math.round(rgb_beginning[1] * w1 + rgb_end[1] * w2), Math.round(rgb_beginning[2] * w1 + rgb_end[2] * w2)];
    return turnArrayIntoRgb(rgb);
}

function getBgColor(el) {
    return window.getComputedStyle(el, null).getPropertyValue('background-color');
}
// http://stackoverflow.com/a/1183906/1550955
function turnRgbIntoArray(rgb) {
    var numberPattern = /\d+/g;
    return rgb.match(numberPattern).map(function (n) {
        return parseInt(n, 10);
    });
}
function turnArrayIntoRgb(rgbArr) {
    return 'rgb(' + rgbArr[0] + ', ' + rgbArr[1] + ', ' + rgbArr[2] + ')';
}
function getGradientWeight(lineNumber, totalLines) {
    var startingEdge = lineNumber - 1;
    var endingEdge = lineNumber;
    var startingEdgeRatio = startingEdge / totalLines;
    var endingEdgeRatio = endingEdge / totalLines;
    var deltaRatio = endingEdgeRatio - startingEdgeRatio;
    return {
        even: startingEdgeRatio + deltaRatio * 0.33,
        odd: startingEdgeRatio + deltaRatio * 0.66
    };
}

var Pixer;
(function (Pixer) {
    var idCursor = 0;
    var IDs = [];
    var defaults = {
        stripes: 4
    };
    function init() {
        var targets = document.querySelectorAll('canvas[data-pixer]');
        var options = void 0;
        var debounced = null;
        var delay = 400;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var el = _step.value;

                if (el.tagName.toLowerCase() === 'canvas') {
                    // If elements are already initialized
                    if (el.hasAttribute('data-pixer-id')) {
                        continue;
                    }
                    options = el.getAttribute('data-pixer');
                    options = options !== '' ? JSON.parse(options) : {};
                    // Reset data-pixer attribute
                    el.setAttribute('data-pixer', '');
                    setupCanvas(el, options);
                } else {
                    console.error('Pixer.js: target must be a canvas element');
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        window.addEventListener('resize', function () {
            clearTimeout(debounced);
            debounced = setTimeout(reflowAll, delay);
        });
    }
    Pixer.init = init;
    function setupCanvas(canvas, options) {
        var settings = void 0,
            canvasId = void 0;
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
        var target = void 0,
            options = void 0,
            settings = void 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = IDs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var id = _step2.value;

                target = document.querySelector('canvas[data-pixer-id="' + id + '"]');
                options = JSON.parse(target.getAttribute('data-pixer-opts'));
                settings = Object.assign(defaults, options);
                reflow(target, settings);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }
    function reflow(canvas, settings) {
        var canvasSize = setSize(canvas);
        clearCanvas(canvas, canvasSize);
        paint(canvas, canvasSize, settings);
    }
    function clearCanvas(canvas, canvasSize) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    function paint(canvas, canvasSize, options) {
        var colors = setBgColor(canvas, canvasSize, options);
        setSquares(canvas, canvasSize, colors, options);
    }
    function setBgColor(canvas, size, options) {
        var colors = {
            previousRGB: getBgColor(canvas.previousElementSibling),
            nextRGB: getBgColor(canvas.nextElementSibling)
        };
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = colors.previousRGB;
        ctx.fillRect(0, 0, size.width, size.height / 2);
        ctx.fillStyle = colors.nextRGB;
        ctx.fillRect(0, size.height / 2, size.width, size.height / 2);
        return colors;
    }
    function setSize(canvas) {
        var canvasSize = getSize(canvas);
        canvas.setAttribute('width', canvasSize.width.toString());
        canvas.setAttribute('height', canvasSize.height.toString());
        return canvasSize;
    }
    function getSize(canvas) {
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        return {
            width: width,
            height: height
        };
    }
    function setSquares(canvas, size, colors, options) {
        var stripes = options.stripes;
        var squareDiagonal = stripes > 2 ? size.height / (stripes - 1) : size.height / stripes;
        var squareSide = squareDiagonal / Math.SQRT2;
        var squaresPerStripe = Math.round(size.width / squareDiagonal);
        var ctx = canvas.getContext('2d');
        for (var j = 0; j < stripes; j++) {
            var startingY = squareDiagonal / 2 * j;
            var gradientWeight = getGradientWeight(j + 1, stripes);
            var color1 = colourGradientor(gradientWeight.odd, colors.nextRGB, colors.previousRGB);
            var color2 = colourGradientor(gradientWeight.even, colors.nextRGB, colors.previousRGB);
            for (var i = 0; i <= squaresPerStripe; i++) {
                var startingX = squareDiagonal / 2 * (i * 2 + 1) - j % 2 * (squareDiagonal / 2);
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
    Pixer.API = {
        reflow: function reflow() {
            reflowAll();
        }
    };
})(Pixer || (Pixer = {}));
function pixer() {
    Pixer.init();
    return Pixer.API;
}

return pixer;

})));
//# sourceMappingURL=index.js.map
