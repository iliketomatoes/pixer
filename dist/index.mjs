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
        return parseInt(n);
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

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var Pixer;
(function (Pixer) {
    var idCursor = 0;
    var IDs = [];
    var defaults$$1 = {
        stripes: 4
    };
    function init() {
        var targets = document.querySelectorAll('canvas[data-pixer]');
        var options = void 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var el = _step.value;

                if (el.tagName.toLowerCase() === 'canvas') {
                    // If elements are already initialized
                    if (el.hasAttribute('data-pixer-id')) continue;
                    options = el.getAttribute('data-pixer');
                    options = options != '' ? JSON.parse(options) : {};
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
    }
    Pixer.init = init;
    function setupCanvas(canvas, options) {
        var settings = Object.assign(defaults$$1, options);
        var canvasId = 'pixer_' + idCursor;
        canvas.setAttribute('data-pixer-id', canvasId);
        // Stringify settings so we can put them into the HTML data attribute
        canvas.setAttribute('data-pixer-opts', JSON.stringify(settings));
        // Icrease the cursor
        idCursor++;
        // Store the id
        IDs.push(canvasId);
        reflow(canvas);
    }
    function reflow(canvas) {
        var canvasSize = setSize(canvas);
        clearCanvas(canvas, canvasSize);
        paint(canvas, canvasSize, defaults$$1);
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
        var ctx = canvas.getContext("2d");
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
    function getSettings(options) {
        Object.assign(this.defaults, options);
    }
    function setSquares(canvas, size, colors, options) {
        var stripes = options.stripes;
        var squareDiagonal = stripes > 2 ? size.height / (stripes - 1) : size.height / stripes;
        var squareSide = squareDiagonal / Math.SQRT2;
        var squaresPerStripe = Math.round(size.width / squareDiagonal);
        var ctx = canvas.getContext("2d");
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

    var API = function () {
        function API() {
            classCallCheck(this, API);
        }

        createClass(API, null, [{
            key: 'Instance',
            get: function get() {
                return this._instance || (this._instance = new this());
            }
        }]);
        return API;
    }();

    Pixer.API = API;
})(Pixer || (Pixer = {}));
function pixer() {
    Pixer.init();
    return Pixer.API;
}

export default pixer;
//# sourceMappingURL=index.mjs.map
