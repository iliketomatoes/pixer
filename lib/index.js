var Pixer;
(function (Pixer) {
    let idCursor = 0;
    let IDs = [];
    let defaults = {
        minSquareWidth: 100
    };
    function init(el) {
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
    Pixer.init = init;
    function getSettings(options) {
        Object.assign(this.defaults, options);
    }
    function setScene(canvas) {
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "rgb(200,0,0)";
            ctx.fillRect(10, 10, 50, 50);
            ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
            ctx.fillRect(30, 30, 50, 50);
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
    let targets = document.querySelectorAll('[data-pixer]');
    for (let el of targets) {
        let child = el.firstChild;
        // If elements are already initialized
        if (child && child.tagName === 'canvas' && child.hasAttribute('data-pixer-id'))
            continue;
        Pixer.init(el);
    }
    return Pixer.API;
}
export default pixer;
