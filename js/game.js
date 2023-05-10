class Canvas {
    constructor() {
        this.element = document.getElementById('snake');
        this.context = this.element.getContext('2d');

        this.background = new Image();
        this.background.src = './img/background_snake.png';

        this.cup = new Image();
        this.cup.src = './img/cup.png';

        this.eat = new Image();
        this.eat.src = './img/eat_snake.png';
    }

    draw() {
        this.context.drawImage(this.background, 0, 0);
        this.context.drawImage(this.cup, 5 * config.box, 0.7 * config.box);
        this.context.drawImage(this.eat, 1 * config.box, 0.7 * config.box);
    }
}

class Config {
    constructor() {
        this.box = 32;
        this.speedGame = 0.5;
    }
}

class Food {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.canvas = canvas.context;
        this.config = config.box;

        this.images = [
            './img/burger.png', 
            './img/avocado.png', 
            './img/fishcake.png', 
            './img/hotdog.png', 
            './img/mushroom.png', 
            './img/strawberry.png', 
            './img/apple.png'
        ];

        this.food = new Image();
    }

    initialize(canvas, config) {
        this.canvas = canvas.context;
        this.config = config.box;
        this.randomPositionFood();
    }

    draw() {
        if (!snake.gameOver) {
            this.canvas.drawImage(this.food, this.x, this.y);
        }
    }

    randomPositionFood() {
        this.x = Math.floor((Math.random() * 17) + 1) * this.config;
        this.y = Math.floor((Math.random() * 15) + 3) * this.config;
        this.setRandomImage();
    }

    setRandomImage() {
        this.randomIndex = Math.floor(Math.random() * this.images.length);
        this.food.src = this.images[this.randomIndex];
    }
}

class Snake {
    constructor() {
        this.x = 8 * config.box;
        this.y = 10 * config.box;
        this.dx = config.box;
        this.dy = 0;
        this.tails = [];
        this.maxTails = 2;
        this.dir = 'right';
        this.gameOver = false;

        this.control();
    }

    startGame() {
        this.gameOver = false;
        this.updata();
        food.randomPositionFood();
    }

    updata() {
        if (!this.gameOver) {
            setTimeout(this.updata.bind(this), 100 / config.speedGame);
        }
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < config.box || this.x > canvas.element.width - config.box * 2 ||
            this.y < 3 * config.box || this.y > canvas.element.height - config.box * 2) {
            this.refreshGame();
        }

        this.tails.unshift({
            x: this.x,
            y: this.y
        });

        if (this.tails.length > this.maxTails) {
            this.tails.pop();
        }

        this.tails.forEach((item, index) => {
            if (item.x === food.x && item.y === food.y) {
                this.maxTails++;

                score.increaseScore();
                score.increaseSpeed();
                food.randomPositionFood();
            }

            for (let i = index + 1; i < this.tails.length; i++) {
                if (item.x === this.tails[i].x && item.y === this.tails[i].y) {
                    this.refreshGame();
                }
            }
        })
    }

    draw() {
        this.tails.forEach((item, index) => {
            if (index === 0) {
                canvas.context.fillStyle = '#16251c';
            } else {
                canvas.context.fillStyle = '#587462';
            }
            canvas.context.fillRect(item.x, item.y, config.box - 1, config.box - 1);
        })
    }

    refreshGame() {
        score.refreshScore();
        this.gameOver = true;
        this.dir = 'right';
        this.x = 8 * config.box;
        this.y = 10 * config.box;
        this.tails = [];
        this.maxTails = 2;
        this.dx = config.box;
        this.dy = 0;
    
        config.speedGame = 0.5;
        clearInterval(gameLoop); 
        canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
    
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const gameOverText = document.createElement('div');
        gameOverText.classList.add('overlay__text');
        gameOverText.innerText = 'К сожалению, Вы проиграли...';

        const restartButton = document.createElement('button');
        restartButton.classList.add('overlay__button');
        restartButton.innerText = 'Начать заново';
        restartButton.addEventListener('click', () => {
            overlay.remove();
            this.restartGame();
        });

        overlay.appendChild(gameOverText);
        overlay.appendChild(restartButton);
        document.body.appendChild(overlay);
    
        gameLoop = setInterval(game.draw, 100);
    
        food.randomPositionFood();
    }

    restartGame() {
        canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);

        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.remove();
        }

        this.gameOver = false;
        this.updata()
    }


    control() {
        document.addEventListener('keydown', (event) => {
            if (event.keyCode === 37 && this.dir !== 'right') {
                this.dir = 'left';
                this.dx = -config.box;
                this.dy = 0;
            } else if (event.keyCode === 38 && this.dir !== 'down') {
                this.dir = 'up';
                this.dx = 0;
                this.dy = -config.box;
            } else if (event.keyCode === 39 && this.dir !== 'left') {
                this.dir = 'right';
                this.dx = config.box;
                this.dy = 0;
            } else if (event.keyCode === 40 && this.dir !== 'up') {
                this.dir = 'down';
                this.dx = 0;
                this.dy = config.box;
            }
        })
    }
}

class Score {
    #score
    #bestScore

    constructor() {
        this.#score = 0;
        this.#bestScore = 0;
    }

    increaseScore() {
        this.#score++;
    }

    increaseSpeed() {
        switch (score.#score) {
            case 10:
                config.speedGame += 0.2;
                break
            case 20:
                config.speedGame += 0.2;
                break
            case 30:
                config.speedGame += 0.2;
                break
            case 40:
                config.speedGame += 0.2;
                break
            case 50:
                config.speedGame += 0.2;
                break
            case 60:
                config.speedGame += 0.2;
                break
            case 70:
                config.speedGame += 0.2;
                break
        }

        gameLoop = setInterval(game.draw, 100);
    }

    refreshScore() {
        if (this.#score > score.#bestScore) {
            localStorage.setItem('bestScore', this.#score);
        }
        score.#bestScore = Number(localStorage.getItem('bestScore'));
        this.#score = 0;
    }

    localStorageScore() {
        if (localStorage.getItem('bestScore')) {
            score.#bestScore = Number(localStorage.getItem('bestScore'));
        } else {
            score.#bestScore = 0;
        }
    }

    draw() {
        canvas.context.fillStyle = '#aad751';
        canvas.context.font = '45px Arial';
        canvas.context.fillText(this.#score, config.box * 2.5, config.box * 1.7);

        canvas.context.fillStyle = '#aad751';
        canvas.context.font = '45px Arial';
        canvas.context.fillText(this.#bestScore, config.box * 6.5, config.box * 1.7);
    }
}

class Game {
    draw() {
        canvas.draw();
        food.draw();
        snake.draw();
        score.draw();
    }
}

let canvas = new Canvas();
let config = new Config();
let snake = new Snake();
let food = new Food();
let score = new Score();
const game = new Game();

score.localStorageScore();

let gameStarted = false;
let startButton = document.querySelector('.start__button');
startButton.addEventListener('click', () => {
    snake.startGame();
    food.initialize(canvas, config);
    gameStarted = true;
    startButton.style.display = 'none';
});

let gameLoop = setInterval(game.draw, 100);