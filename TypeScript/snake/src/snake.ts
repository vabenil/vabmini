'use strict';

enum Color
{
    black = '#000000',
    white = '#FFFFFF',
    blue  = '#0000FF',
    green = '#00FF00',
    red   = '#FF0000'
}

enum CollisionType
{
    none = 0,
    tail,
    food,
    h_start,
    h_end,
    v_start,
    v_end
}

// Define constants
const cont_width = 300;
const cont_height = 400;

const tail_width = 10
const tail_height = 10

const food_width = 5;
const food_height = 5;

// number of squares inside the container 
const squares_x = cont_width / tail_width
const squares_y = cont_height / tail_height

// Snake initial position
const snake_init_x = Math.round((squares_x - 1) / 2);
const snake_init_y = Math.round((squares_y - 1) / 2);

class Food
{
    x: number;
    y: number;

    max_x: number;
    max_y: number;

    constructor(max_x: number, max_y: number)
    {
        this.max_x = max_x;
        this.max_y = max_y;

        this.x = Math.floor(Math.random() * (this.max_x - 1 + 1)) + 1;
        this.y = Math.floor(Math.random() * (this.max_y - 1 + 1)) + 1;
    }

    updatePos(): void
    {
        this.x = Math.floor(Math.random() * (this.max_x - 1 + 1)) + 1;
        this.y = Math.floor(Math.random() * (this.max_y - 1 + 1)) + 1;
    }
}

class SnakeTail
{
    x: number = 0;
    y: number = 0;
}

class Snake
{
    // Start with 3 tails
    queue: number = 3;
    tail_num: number = 0;
    tails: SnakeTail[] = [];
    direction: string = 'right'

    constructor(x: number, y: number)
    {
        // Initialize the head
        this.tails[this.tail_num] = { x: x, y: y };
        this.tail_num += 1;
    }

    addToQueue(n: number): void
    {
        this.queue += n;
    }

    addTail(): void
    {
        this.tails[this.tail_num] = {
            x: -1000,
            y: -1000,
        };

        this.queue -= 1;
        this.tail_num += 1;
    }

    updateHeadPos(): void
    {
        let head = this.tails[0];

        switch(this.direction)
        {
            case 'right':
                head.x += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'up':
                head.y -= 1;
                break;
        }
    }

    updateTailsPos(): void
    {
        for (let i = this.tail_num-1; i >= 1; i--) {
            let tail = this.tails[i];
            let prev_tail = this.tails[i-1];

            tail.x = prev_tail.x;
            tail.y = prev_tail.y;
        }
    }
}

export class SnakeGame
{
    scores: { [key: string]: number } = {}
    score = 0;

    username: string;
    container: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    food: Food;
    snake: Snake;
    quit: boolean;
    interval: number;
    gameOver: boolean = false;

    constructor(container: HTMLElement)
    {
        this.container = container;
    }

    isGameOver = (_: Event) => this.gameOver;

    init()
    {
        // clean container and create canvas
        this.container.innerHTML =
            "<div id='snake-game-menu'>" +
                "<div>" +
                    "<label for='fname'>Username: </label>" +
                    "<input type='text' id='snake-username' value='player'>" +
                    "<button id='snake-submit-button'>Play!</button>" +
                "</div>" +
            "</div>";
        // Can't be null because we just created it
        let btn = document.getElementById('snake-submit-button')!;
        // `(_) => this.start()` is to preserve `this` like D's delegates
        btn.onclick = (_: Event) => this.start();
    }

    start()
    {
        console.log("start!");
        this.username = (<HTMLInputElement>document.getElementById('snake-username')).value;

        this.container.innerHTML = "<canvas></canvas>";
        this.canvas = <HTMLCanvasElement>this.container.childNodes[0]; 
        this.ctx = this.canvas.getContext('2d')!;
        this.canvas.tabIndex = 1;

        // set conatiner and canvas width 
        this.container.style.width = cont_width + 'px';
        this.container.style.height = cont_height + 'px';

        this.ctx.canvas.width = cont_width;
        this.ctx.canvas.height = cont_height;

        this.food = new Food(squares_x - 1, squares_y - 1);
        this.snake = new Snake(snake_init_x, snake_init_y);

        this.canvas.focus();
        this.canvas.addEventListener("keydown", (e) => this.updateDirection(e));

        this.interval = setInterval((_: Event) => this.mainLoop(), 100);
    }

    show_score()
    {
        let score_html: string = "<div id='score'>";
        for (let user in this.scores) {
            score_html += "<span>" + user + ": " + this.scores[user] + "</span>";
        }
        score_html += "</div>";

        // console.log(score_html);
        this.container.innerHTML += score_html;
    }

    stop()
    {
        this.scores[this.username] = this.score;
        this.canvas.removeEventListener("keydown", this.updateDirection);
        this.show_score();
        window.clearInterval(this.interval);
    }

    mainLoop()
    {
        let head: SnakeTail = this.snake.tails[0];

        if (this.quit) {
            console.log("Quitting");
            return this.stop();
        }

        if (this.snake.queue) {
            this.snake.addTail();
        }

        this.snake.updateTailsPos();
        this.snake.updateHeadPos();

        switch (this.checkCollision())
        {
            case CollisionType.h_start: // Collission with the left border of the container
                head.x = squares_x - 1;
                break;
            case CollisionType.h_end: // Collission with the right border of the container
                head.x = 0;
                break;
            case CollisionType.v_start: // Collission with the bottom border of the container
                head.y = squares_y - 1;
                break;
            case CollisionType.v_end: // Collission with the top border of the container
                head.y = 0;
                break;
            case CollisionType.food:    // Collission with Food
                this.eat();
                break;
            case CollisionType.tail:    // Collision with another tail
                this.gameOver = true;
                this.quit = true;
                break;
        } 
        this.render();
    }


    checkCollision(): CollisionType
    {
        let coltn: CollisionType = CollisionType.none;

        coltn = this.containerCollision();
        coltn = this.foodCollision() ? CollisionType.food : coltn;
        coltn = this.tailCollision() ? CollisionType.tail : coltn;

        return coltn;
    }

    tailCollision(): boolean
    {
        let head = this.snake.tails[0];
        for (let i = 1; i < this.snake.tail_num; i++) {
            let tail = this.snake.tails[i];

            if (head.x == tail.x && head.y == tail.y) {
                return true;
            }
        }
        return false;
    }

    containerCollision(): CollisionType
    {
        let head = this.snake.tails[0];
        let collision = CollisionType.none;

        if (head.x < 0) {
            collision = CollisionType.h_start;
        }
        else if (head.x >= squares_x) {
            collision = CollisionType.h_end;
        }
        else if (head.y < 0) {
            collision = CollisionType.v_start;
        }
        else if (head.y >= squares_y) {
            collision = CollisionType.v_end;
        }
        return collision;
    }

    foodCollision(): boolean
    {
        let head = this.snake.tails[0];
        return numInRange(head.x, this.food.x, 1) && numInRange(head.y, this.food.y, 1);
    }

    eat(): void
    {
        this.score++;
        this.snake.addToQueue(1);

        this.food.updatePos();
        while (this.foodInTails()) {
            this.food.updatePos();
        }
    }

    foodInTails(): boolean
    {
        for (let i = 0; i < this.snake.tail_num; i++) {
            let tail = this.snake.tails[i];
            if (tail.x == this.food.x && tail.y == this.food.y) {
                return true;
            }
        }
        return false;
    }

    render(): void
    {
        this.ctx.clearRect(0, 0, cont_width, cont_height);

        this.renderContainer();
        this.renderSnake();
        this.renderFood();
        this.renderScore();
    }

    renderScore(): void
    {
        let text_width: number = this.ctx.measureText(this.score.toString()).width;
        this.ctx.font = '16px sans-serif';
        this.ctx.fillStyle = Color.white;
        this.ctx.fillText(this.score.toString(), cont_width - text_width - 8, 20);
    }

    renderContainer(): void
    {
        this.ctx.fillStyle = Color.black;
        this.ctx.fillRect(0, 0, cont_width, cont_height);
    }

    renderFood(): void
    {
        let x: number = this.food.x * tail_width;
        let y: number = this.food.y * tail_height;

        this.ctx.fillStyle = Color.red;
        this.ctx.fillRect(x, y, food_width, food_height);
    }

    renderSnake(): void
    {
        for(let i = 0; i < this.snake.tail_num - 1; i++) {
            let tail: SnakeTail = this.snake.tails[i];

            let x: number = tail.x * tail_width;
            let y: number = tail.y * tail_height;

            this.ctx.fillStyle = Color.green;
            this.ctx.fillRect( x, y, tail_width, tail_height );
        }
    }

    updateDirection(e: KeyboardEvent): void
    {
        switch (e.key)
        {
            case 'q':
                this.quit = true;
                break;
            case 'ArrowRight':
                this.snake.direction = "right";
                break;
            case 'ArrowLeft':
                this.snake.direction = "left";
                break;
            case 'ArrowUp':
                this.snake.direction = "up";
                break;
            case 'ArrowDown':
                this.snake.direction = "down";
                break;
        }
    }
}

function numInRange(num: number, num2: number, range: number)
{
    return (num >= num2 - range && num <= num2 + range)
}
