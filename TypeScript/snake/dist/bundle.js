/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst snake_1 = __webpack_require__(/*! ./snake */ \"./src/snake.ts\");\nwindow.onload = function (e) {\n    let game_container = document.getElementById('snake-game');\n    if (game_container != null) {\n        let game = new snake_1.SnakeGame(game_container);\n        game.init();\n    }\n};\n\n\n//# sourceURL=webpack://snake-game/./src/index.ts?");

/***/ }),

/***/ "./src/snake.ts":
/*!**********************!*\
  !*** ./src/snake.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SnakeGame = void 0;\nvar Color;\n(function (Color) {\n    Color[\"black\"] = \"#000000\";\n    Color[\"white\"] = \"#FFFFFF\";\n    Color[\"blue\"] = \"#0000FF\";\n    Color[\"green\"] = \"#00FF00\";\n    Color[\"red\"] = \"#FF0000\";\n})(Color || (Color = {}));\nvar CollisionType;\n(function (CollisionType) {\n    CollisionType[CollisionType[\"none\"] = 0] = \"none\";\n    CollisionType[CollisionType[\"tail\"] = 1] = \"tail\";\n    CollisionType[CollisionType[\"food\"] = 2] = \"food\";\n    CollisionType[CollisionType[\"h_start\"] = 3] = \"h_start\";\n    CollisionType[CollisionType[\"h_end\"] = 4] = \"h_end\";\n    CollisionType[CollisionType[\"v_start\"] = 5] = \"v_start\";\n    CollisionType[CollisionType[\"v_end\"] = 6] = \"v_end\";\n})(CollisionType || (CollisionType = {}));\n// Define constants\nconst cont_width = 300;\nconst cont_height = 400;\nconst tail_width = 10;\nconst tail_height = 10;\nconst food_width = 5;\nconst food_height = 5;\n// number of squares inside the container \nconst squares_x = cont_width / tail_width;\nconst squares_y = cont_height / tail_height;\n// Snake initial position\nconst snake_init_x = Math.round((squares_x - 1) / 2);\nconst snake_init_y = Math.round((squares_y - 1) / 2);\nclass Food {\n    x;\n    y;\n    max_x;\n    max_y;\n    constructor(max_x, max_y) {\n        this.max_x = max_x;\n        this.max_y = max_y;\n        this.x = Math.floor(Math.random() * (this.max_x - 1 + 1)) + 1;\n        this.y = Math.floor(Math.random() * (this.max_y - 1 + 1)) + 1;\n    }\n    updatePos() {\n        this.x = Math.floor(Math.random() * (this.max_x - 1 + 1)) + 1;\n        this.y = Math.floor(Math.random() * (this.max_y - 1 + 1)) + 1;\n    }\n}\nclass SnakeTail {\n    x = 0;\n    y = 0;\n}\nclass Snake {\n    // Start with 3 tails\n    queue = 3;\n    tail_num = 0;\n    tails = [];\n    direction = 'right';\n    constructor(x, y) {\n        // Initialize the head\n        this.tails[this.tail_num] = { x: x, y: y };\n        this.tail_num += 1;\n    }\n    addToQueue(n) {\n        this.queue += n;\n    }\n    addTail() {\n        this.tails[this.tail_num] = {\n            x: -1000,\n            y: -1000,\n        };\n        this.queue -= 1;\n        this.tail_num += 1;\n    }\n    updateHeadPos() {\n        let head = this.tails[0];\n        switch (this.direction) {\n            case 'right':\n                head.x += 1;\n                break;\n            case 'left':\n                head.x -= 1;\n                break;\n            case 'down':\n                head.y += 1;\n                break;\n            case 'up':\n                head.y -= 1;\n                break;\n        }\n    }\n    updateTailsPos() {\n        for (let i = this.tail_num - 1; i >= 1; i--) {\n            let tail = this.tails[i];\n            let prev_tail = this.tails[i - 1];\n            tail.x = prev_tail.x;\n            tail.y = prev_tail.y;\n        }\n    }\n}\nclass SnakeGame {\n    scores = {};\n    score = 0;\n    username;\n    container;\n    canvas;\n    ctx;\n    food;\n    snake;\n    quit;\n    interval;\n    gameOver = false;\n    constructor(container) {\n        this.container = container;\n    }\n    isGameOver = (_) => this.gameOver;\n    init() {\n        // clean container and create canvas\n        this.container.innerHTML =\n            \"<div id='snake-game-menu'>\" +\n                \"<div>\" +\n                \"<label for='fname'>Username: </label>\" +\n                \"<input type='text' id='snake-username' value='player'>\" +\n                \"<button id='snake-submit-button'>Play!</button>\" +\n                \"</div>\" +\n                \"</div>\";\n        // Can't be null because we just created it\n        let btn = document.getElementById('snake-submit-button');\n        // `(_) => this.start()` is to preserve `this` like D's delegates\n        btn.onclick = (_) => this.start();\n    }\n    start() {\n        console.log(\"start!\");\n        this.username = document.getElementById('snake-username').value;\n        this.container.innerHTML = \"<canvas></canvas>\";\n        this.canvas = this.container.childNodes[0];\n        this.ctx = this.canvas.getContext('2d');\n        this.canvas.tabIndex = 1;\n        // set conatiner and canvas width \n        this.container.style.width = cont_width + 'px';\n        this.container.style.height = cont_height + 'px';\n        this.ctx.canvas.width = cont_width;\n        this.ctx.canvas.height = cont_height;\n        this.food = new Food(squares_x - 1, squares_y - 1);\n        this.snake = new Snake(snake_init_x, snake_init_y);\n        this.canvas.focus();\n        this.canvas.addEventListener(\"keydown\", (e) => this.updateDirection(e));\n        this.interval = setInterval((_) => this.mainLoop(), 100);\n    }\n    show_score() {\n        let score_html = \"<div id='score'>\";\n        for (let user in this.scores) {\n            score_html += \"<span>\" + user + \": \" + this.scores[user] + \"</span>\";\n        }\n        score_html += \"</div>\";\n        // console.log(score_html);\n        this.container.innerHTML += score_html;\n    }\n    stop() {\n        this.scores[this.username] = this.score;\n        this.canvas.removeEventListener(\"keydown\", this.updateDirection);\n        this.show_score();\n        window.clearInterval(this.interval);\n    }\n    mainLoop() {\n        let head = this.snake.tails[0];\n        if (this.quit) {\n            console.log(\"Quitting\");\n            return this.stop();\n        }\n        if (this.snake.queue) {\n            this.snake.addTail();\n        }\n        this.snake.updateTailsPos();\n        this.snake.updateHeadPos();\n        switch (this.checkCollision()) {\n            case CollisionType.h_start: // Collission with the left border of the container\n                head.x = squares_x - 1;\n                break;\n            case CollisionType.h_end: // Collission with the right border of the container\n                head.x = 0;\n                break;\n            case CollisionType.v_start: // Collission with the bottom border of the container\n                head.y = squares_y - 1;\n                break;\n            case CollisionType.v_end: // Collission with the top border of the container\n                head.y = 0;\n                break;\n            case CollisionType.food: // Collission with Food\n                this.eat();\n                break;\n            case CollisionType.tail: // Collision with another tail\n                this.gameOver = true;\n                this.quit = true;\n                break;\n        }\n        this.render();\n    }\n    checkCollision() {\n        let coltn = CollisionType.none;\n        coltn = this.containerCollision();\n        coltn = this.foodCollision() ? CollisionType.food : coltn;\n        coltn = this.tailCollision() ? CollisionType.tail : coltn;\n        return coltn;\n    }\n    tailCollision() {\n        let head = this.snake.tails[0];\n        for (let i = 1; i < this.snake.tail_num; i++) {\n            let tail = this.snake.tails[i];\n            if (head.x == tail.x && head.y == tail.y) {\n                return true;\n            }\n        }\n        return false;\n    }\n    containerCollision() {\n        let head = this.snake.tails[0];\n        let collision = CollisionType.none;\n        if (head.x < 0) {\n            collision = CollisionType.h_start;\n        }\n        else if (head.x >= squares_x) {\n            collision = CollisionType.h_end;\n        }\n        else if (head.y < 0) {\n            collision = CollisionType.v_start;\n        }\n        else if (head.y >= squares_y) {\n            collision = CollisionType.v_end;\n        }\n        return collision;\n    }\n    foodCollision() {\n        let head = this.snake.tails[0];\n        return numInRange(head.x, this.food.x, 1) && numInRange(head.y, this.food.y, 1);\n    }\n    eat() {\n        this.score++;\n        this.snake.addToQueue(1);\n        this.food.updatePos();\n        while (this.foodInTails()) {\n            this.food.updatePos();\n        }\n    }\n    foodInTails() {\n        for (let i = 0; i < this.snake.tail_num; i++) {\n            let tail = this.snake.tails[i];\n            if (tail.x == this.food.x && tail.y == this.food.y) {\n                return true;\n            }\n        }\n        return false;\n    }\n    render() {\n        this.ctx.clearRect(0, 0, cont_width, cont_height);\n        this.renderContainer();\n        this.renderSnake();\n        this.renderFood();\n        this.renderScore();\n    }\n    renderScore() {\n        let text_width = this.ctx.measureText(this.score.toString()).width;\n        this.ctx.font = '16px sans-serif';\n        this.ctx.fillStyle = Color.white;\n        this.ctx.fillText(this.score.toString(), cont_width - text_width - 8, 20);\n    }\n    renderContainer() {\n        this.ctx.fillStyle = Color.black;\n        this.ctx.fillRect(0, 0, cont_width, cont_height);\n    }\n    renderFood() {\n        let x = this.food.x * tail_width;\n        let y = this.food.y * tail_height;\n        this.ctx.fillStyle = Color.red;\n        this.ctx.fillRect(x, y, food_width, food_height);\n    }\n    renderSnake() {\n        for (let i = 0; i < this.snake.tail_num - 1; i++) {\n            let tail = this.snake.tails[i];\n            let x = tail.x * tail_width;\n            let y = tail.y * tail_height;\n            this.ctx.fillStyle = Color.green;\n            this.ctx.fillRect(x, y, tail_width, tail_height);\n        }\n    }\n    updateDirection(e) {\n        switch (e.key) {\n            case 'q':\n                this.quit = true;\n                break;\n            case 'ArrowRight':\n                this.snake.direction = \"right\";\n                break;\n            case 'ArrowLeft':\n                this.snake.direction = \"left\";\n                break;\n            case 'ArrowUp':\n                this.snake.direction = \"up\";\n                break;\n            case 'ArrowDown':\n                this.snake.direction = \"down\";\n                break;\n        }\n    }\n}\nexports.SnakeGame = SnakeGame;\nfunction numInRange(num, num2, range) {\n    return (num >= num2 - range && num <= num2 + range);\n}\n\n\n//# sourceURL=webpack://snake-game/./src/snake.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;